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
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { prop } from 'ramda';
import { displayFields } from 'utils/siteViewHelpers';

interface AdministrativePageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
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

          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
          ).map(prop('name'));

          this.props.onLoaded && this.props.onLoaded();
          const info = data.study.administrativeInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {fields.includes('studyId') &&
                  this.renderItem('NCT Number', info.studyId)}
                {fields.includes('otherStudyIds') &&
                  this.renderItem('Other Study ID Numbers', info.otherStudyIds)}
                {fields.includes('hasDataMonitoringCommittee') &&
                  this.renderItem(
                    'Has Data Monitoring Committee',
                    info.hasDataMonitoringCommittee ? 'Yes' : 'No',
                  )}
                {fields.includes('isFdaRegulated') &&
                  this.renderItem(
                    'Is FDA-Regulated Product',
                    info.isFdaRegulated ? 'Yes' : 'No',
                  )}
                {fields.includes('planToShareIpd') &&
                  this.renderItem('Plan to Share Data', info.planToShareIpd)}
                {fields.includes('planToShareIpdDescription') &&
                  this.renderItem(
                    'IPD Description',
                    info.planToShareIpdDescription,
                  )}
                {fields.includes('responsibleParty') &&
                  this.renderItem('Responsible Party', info.responsibleParty)}
                {fields.includes('sponsor') &&
                  this.renderItem('Sponsor', info.sponsor)}
                {fields.includes('collaborators') &&
                  this.renderItem('Collaborators', info.collaborators)}
                {fields.includes('investigators') &&
                  this.renderItem('Investigators', info.investigators)}
                {fields.includes('source') &&
                  this.renderItem('Information Provided By', info.source)}
                {fields.includes('verificationDate') &&
                  this.renderItem('Verification Date', info.verificationDate)}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default AdministrativePage;
