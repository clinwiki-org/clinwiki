import * as React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { SearchStudyPageQuery, SearchStudyPageQueryVariables } from 'types/SearchStudyPageQuery';
import { path, pathOr, test } from 'ramda';
import StudyPage from 'containers/StudyPage';
import { Redirect } from 'react-router-dom';

const QUERY = gql`
  query SearchStudyPageQuery($hash: String!, $id: String!) {
    search(searchHash:$hash) {
      studyEdge(id: $id) {
        nextId
        prevId
        isWorkflow
        study {
          nctId
        }
      }
    }
  }
`;

interface StudySearchPageProps {
  match: any;
  history: any;
  location: any;
}

class SearchStudyPageQueryComponent
  extends Query<SearchStudyPageQuery, SearchStudyPageQueryVariables> {}

class StudySearchPage extends React.PureComponent<StudySearchPageProps> {
  render() {
    const variables = {
      hash: this.props.match.params.searchId,
      id: this.props.match.params.studyId,
    };

    return (
      <SearchStudyPageQueryComponent query={QUERY} variables={variables}>
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          const id = path(['search', 'studyEdge', 'study', 'nctId'], data);
          const prevId = path(['search', 'studyEdge', 'prevId'], data);
          const nextId = path(['search', 'studyEdge', 'nextId'], data);
          const isWorkflow = pathOr(false, ['search', 'studyEdge', 'isWorkflow'], data);
          const workflowSuffix = isWorkflow ? '/reviews/new' : '';
          const prevLink = prevId && `/search/${variables.hash}/study/${prevId}${workflowSuffix}`;
          const nextLink = nextId && `/search/${variables.hash}/study/${nextId}${workflowSuffix}`;
          const backLink = `/search/${variables.hash}`;
          const match = {
            ...this.props.match,
            params: { ...this.props.match.params, nctId: id },
          };

          return (
            <StudyPage
              history={this.props.history}
              match={match}
              prevLink={prevLink}
              nextLink={nextLink}
              backLink={backLink}
              isFeed
            />
          );
        }}
      </SearchStudyPageQueryComponent>
    );
  }
}

export default StudySearchPage;
