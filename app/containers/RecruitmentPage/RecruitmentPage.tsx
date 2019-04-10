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

interface RecruitmentPageProps {
  history: History;
  match: match<{ nctId: string }>;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
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

          this.props.onLoaded && this.props.onLoaded();
          const info = data.study.recruitmentInfo;
          return (
            <Table striped bordered condensed>
              <tbody>
                {this.renderItem('Recruitment Status', info.overallStatus)}
                {this.renderItem('Enrollment', info.enrollment)}
                {this.renderItem('Completion date', info.completionDate)}
                {this.renderItem(
                  'Primary Completion Date',
                  info.primaryCompletionDate,
                )}
                {this.renderItem(
                  'Eligibility Criteria',
                  info.eligibility.criteria,
                )}
                {this.renderItem('Gender', info.eligibility.gender)}
                {this.renderItem('Ages', info.ages)}
                {this.renderItem(
                  'Accepts Healthy Volunteers',
                  info.eligibility.healthyVolunteers,
                )}
                {this.renderItem('Contacts', info.contacts)}
                {this.renderItem(
                  'Listed Location Countries',
                  info.listedLocationCountries,
                )}
                {this.renderItem(
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
