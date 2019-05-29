import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  AdministrativePageQuery,
  AdministrativePageQueryVariables,
} from 'types/AdministrativePageQuery';
import StudySummary from 'components/StudySummary';

interface AdministrativePageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

// We need to rename nctId so that it's not id of the object according to Apollo.
// O/w Apollo errors with "You're using heuristic fragment matcher"
const FRAGMENT = gql`
  fragment AdministrativeInfoFragment on AdministrativeInfo {
    studyId: nctId
    collaborators
    hasDataMonitoringCommittee
    investigators
    isFdaRegulated
    otherStudyIds
    otherStudyIds
    planToShareIpd
    planToShareIpdDescription
    responsibleParty
    source
    sponsor
    verificationDate
  }
`;

const QUERY = gql`
  query AdministrativePageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      administrativeInfo {
        ...AdministrativeInfoFragment
      }
      nctId
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
  ${FRAGMENT}
`;

class QueryComponent extends Query<
  AdministrativePageQuery,
  AdministrativePageQueryVariables
> {}

class AdministrativePage extends React.PureComponent<AdministrativePageProps> {
  static fragment = FRAGMENT;

  renderItem = (key: string, value: string | null) => {
    return (
      <tr key={key}>
        <td style={{ width: '30%', verticalAlign: 'middle' }}>
          <b>{key}</b>
        </td>
        <td>{value || ''}</td>
      </tr>
    );
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
      >
        {({ data, loading, error }) => {
          if (
            loading ||
            error ||
            !data ||
            !data.study ||
            !data.study.administrativeInfo
          ) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();
          const info = data.study.administrativeInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {this.renderItem('NCT Number', info.studyId)}
                {this.renderItem('Other Study ID Numbers', info.otherStudyIds)}
                {this.renderItem(
                  'Has Data Monitoring Committee',
                  info.hasDataMonitoringCommittee ? 'Yes' : 'No',
                )}
                {this.renderItem(
                  'Is FDA-Regulated Product',
                  info.isFdaRegulated ? 'Yes' : 'No',
                )}
                {this.renderItem('Plan to Share Data', info.planToShareIpd)}
                {this.renderItem(
                  'IPD Description',
                  info.planToShareIpdDescription,
                )}
                {this.renderItem('Responsible Party', info.responsibleParty)}
                {this.renderItem('Sponsor', info.sponsor)}
                {this.renderItem('Collaborators', info.collaborators)}
                {this.renderItem('Investigators', info.investigators)}
                {this.renderItem('Information Provided By', info.source)}
                {this.renderItem('Verification Date', info.verificationDate)}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default AdministrativePage;
