import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  DescriptivePageQuery,
  DescriptivePageQueryVariables,
} from 'types/DescriptivePageQuery';
import StudySummary from 'components/StudySummary';

interface DescriptivePageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

const FRAGMENT = gql`
  fragment DescriptiveInfoFragment on DescriptiveInfo {
    briefSummary
    briefTitle
    conditions
    design
    detailedDescription
    officialTitle
    phase
    publications
    studyArms
    studyType
  }
`;

const QUERY = gql`
  query DescriptivePageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      descriptiveInfo {
        ...DescriptiveInfoFragment
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
  DescriptivePageQuery,
  DescriptivePageQueryVariables
> {}

class DescriptivePage extends React.PureComponent<DescriptivePageProps> {
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
            !data.study.descriptiveInfo
          ) {
            return null;
          }

          this.props.onLoaded && this.props.onLoaded();
          const descriptiveInfo = data.study.descriptiveInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {this.renderItem('Brief Title', descriptiveInfo.briefTitle)}
                {this.renderItem(
                  'Official Title',
                  descriptiveInfo.officialTitle,
                )}
                {this.renderItem('Brief Summary', descriptiveInfo.briefSummary)}
                {this.renderItem(
                  'Detailed Description',
                  descriptiveInfo.detailedDescription,
                )}
                {this.renderItem('Study Type', descriptiveInfo.studyType)}
                {this.renderItem('Study Phase', descriptiveInfo.phase)}
                {this.renderItem('Study Design', descriptiveInfo.design)}
                {this.renderItem('Conditions', descriptiveInfo.conditions)}
                {this.renderItem('Study Arms', descriptiveInfo.studyArms)}
                {this.renderItem('Publications', descriptiveInfo.publications)}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default DescriptivePage;
