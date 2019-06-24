import * as React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  SearchStudyPageQuery,
  SearchStudyPageQueryVariables,
} from 'types/SearchStudyPageQuery';
import { path, pathOr, test } from 'ramda';
import StudyPage from 'containers/StudyPage';

const QUERY = gql`
  query SearchStudyPageQuery($hash: String!, $id: String!) {
    search(searchHash: $hash) {
      studyEdge(id: $id) {
        nextId
        prevId
        isWorkflow
        study {
          nctId
        }
        recordsTotal
        counterIndex
        hashNext
        hashPrev
        pageSize
      }
    }
  }
`;

interface StudySearchPageProps {
  match: match<{ nctId: string; searchId: string }>;
  history: History;
  location: Location;
}

class SearchStudyPageQueryComponent extends Query<
  SearchStudyPageQuery,
  SearchStudyPageQueryVariables
> {}

class StudySearchPage extends React.PureComponent<StudySearchPageProps> {
  render() {
    const variables = {
      hash: this.props.match.params.searchId,
      id: this.props.match.params.nctId,
    };

    return (
      <SearchStudyPageQueryComponent query={QUERY} variables={variables}>
        {({ data, loading, error }) => {
          let prevLink: string | null | undefined = null;
          let nextLink: string | null | undefined = null;
          let isWorkflow: boolean = false;
          let recordsTotal: number | null | undefined = 1;
          let counterIndex: number | null | undefined = 1;
          let pageSize: number | undefined = 25;
          if (data && !loading) {
            const prevId = path(['search', 'studyEdge', 'prevId'], data);
            const nextId = path(['search', 'studyEdge', 'nextId'], data);
            isWorkflow = pathOr(
              false,
              ['search', 'studyEdge', 'isWorkflow'],
              data,
            ) as boolean;
            recordsTotal = pathOr(1, ['search', 'studyEdge', 'recordsTotal'], data) as number;
            counterIndex = pathOr(1, ['search', 'studyEdge', 'counterIndex'], data) as number;
            pageSize = path(['search', 'studyEdge', 'pageSize'], data);
            const hashNext = path(['search', 'studyEdge', 'hashNext'], data);
            const hashPrev = path(['search', 'studyEdge', 'hashNext'], data);
            // if it's the last on the page
            if (pageSize && counterIndex % pageSize === 0) {
              nextLink = nextId && `/search/${hashNext}/study/${nextId}`;
            } else {
              nextLink = nextId && `/search/${variables.hash}/study/${nextId}`;
            }
            // if it's the first on the page
            if (pageSize && counterIndex % pageSize === 1) {
              prevLink = prevId && `/search/${hashPrev}/study/${prevId}`;
            } else {
              prevLink = prevId && `/search/${variables.hash}/study/${prevId}`;
            }
          }
          return (
            <StudyPage
              history={this.props.history}
              location={this.props.location}
              match={this.props.match}
              prevLink={prevLink}
              nextLink={nextLink}
              isWorkflow={isWorkflow}
              recordsTotal={recordsTotal}
              counterIndex={counterIndex}
            />
          );
        }}
      </SearchStudyPageQueryComponent>
    );
  }
}

export default StudySearchPage;
