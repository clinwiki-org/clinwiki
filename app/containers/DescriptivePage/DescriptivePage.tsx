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
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { prop } from 'ramda';

interface DescriptivePageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
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
          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
          ).map(prop('name'));

          this.props.onLoaded && this.props.onLoaded();
          const descriptiveInfo = data.study.descriptiveInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {fields.includes('briefTitle') &&
                  this.renderItem('Brief Title', descriptiveInfo.briefTitle)}
                {fields.includes('officialTitle') &&
                  this.renderItem(
                    'Official Title',
                    descriptiveInfo.officialTitle,
                  )}
                {fields.includes('briefSummary') &&
                  this.renderItem(
                    'Brief Summary',
                    descriptiveInfo.briefSummary,
                  )}
                {fields.includes('detailedDescription') &&
                  this.renderItem(
                    'Detailed Description',
                    descriptiveInfo.detailedDescription,
                  )}
                {fields.includes('studyType') &&
                  this.renderItem('Study Type', descriptiveInfo.studyType)}
                {fields.includes('phase') &&
                  this.renderItem('Study Phase', descriptiveInfo.phase)}
                {fields.includes('design') &&
                  this.renderItem('Study Design', descriptiveInfo.design)}
                {fields.includes('conditions') &&
                  this.renderItem('Conditions', descriptiveInfo.conditions)}
                {fields.includes('studyArms') &&
                  this.renderItem('Study Arms', descriptiveInfo.studyArms)}
                {fields.includes('publications') &&
                  this.renderItem('Publications', descriptiveInfo.publications)}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default DescriptivePage;
