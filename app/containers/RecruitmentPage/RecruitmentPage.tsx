import * as React from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import {
  RecruitmentPageQuery,
  RecruitmentPageQueryVariables,
} from 'types/RecruitmentPageQuery';
import StudySummary from 'components/StudySummary';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { prop } from 'ramda';

interface RecruitmentPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

const FRAGMENT = gql`
  fragment RecruitmentInfoFragment on RecruitmentInfo {
    ages
    completionDate
    contacts
    enrollment
    listedLocationCountries
    overallStatus
    primaryCompletionDate
    removedLocationCountries
    eligibility {
      criteria
      gender
      healthyVolunteers
    }
  }
`;

const QUERY = gql`
  query RecruitmentPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      recruitmentInfo {
        ...RecruitmentInfoFragment
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
  RecruitmentPageQuery,
  RecruitmentPageQueryVariables
> {}

class RecruitmentPage extends React.PureComponent<RecruitmentPageProps> {
  static fragment = FRAGMENT;

  renderItem = (key: string, value: string | number | null) => {
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
            !data.study.recruitmentInfo
          ) {
            return null;
          }

          const fields = displayFields(
            this.props.metaData.selected.kind,
            this.props.metaData.selected.values,
            this.props.metaData.fields.map(name => ({ name, rank: null })),
          ).map(prop('name'));

          this.props.onLoaded && this.props.onLoaded();
          const info = data.study.recruitmentInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {fields.includes('overallStatus') &&
                  this.renderItem('Recruitment Status', info.overallStatus)}
                {fields.includes('enrollment') &&
                  this.renderItem('Enrollment', info.enrollment)}
                {fields.includes('completionDate') &&
                  this.renderItem('Completion date', info.completionDate)}
                {fields.includes('primaryCompletionDate') &&
                  this.renderItem(
                    'Primary Completion Date',
                    info.primaryCompletionDate,
                  )}
                {fields.includes('eligibilityCriteria') &&
                  this.renderItem(
                    'Eligibility Criteria',
                    info.eligibility.criteria,
                  )}
                {fields.includes('eligibilityGender') &&
                  this.renderItem('Gender', info.eligibility.gender)}
                {fields.includes('ages') && this.renderItem('Ages', info.ages)}
                {fields.includes('eligibilityHealthyVolunteers') &&
                  this.renderItem(
                    'Accepts Healthy Volunteers',
                    info.eligibility.healthyVolunteers,
                  )}
                {fields.includes('contacts') &&
                  this.renderItem('Contacts', info.contacts)}
                {fields.includes('listedLocationCountries') &&
                  this.renderItem(
                    'Listed Location Countries',
                    info.listedLocationCountries,
                  )}
                {fields.includes('removedLocationCountries') &&
                  this.renderItem(
                    'Removed Location Countries',
                    info.removedLocationCountries,
                  )}
              </tbody>
            </Table>
          );
        }}
      </QueryComponent>
    );
  }
}

export default RecruitmentPage;
