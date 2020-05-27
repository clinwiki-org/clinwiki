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
import { PulseLoader } from 'react-spinners';
import { MAX_WINDOW_SIZE } from '../../utils/constants';
import { UserFragment } from 'types/UserFragment';

const QUERY = gql`
  query SearchStudyPageQuery($hash: String!, $id: String!) {
    search(searchHash: $hash) {
      studyEdge(id: $id) {
        nextId
        prevId
        firstId
        lastId
        isWorkflow
        workflowName
        study {
          nctId
        }
        recordsTotal
        counterIndex
        firstId
        lastId
      }
    }
  }
`;

interface StudySearchPageProps {
  match: match<{ nctId: string; searchId: string }>;
  history: History;
  location: Location;
  refetch:any;
  user: UserFragment | null;
}

class SearchStudyPageQueryComponent extends Query<
  SearchStudyPageQuery,
  SearchStudyPageQueryVariables
> {}
class StudySearchPage extends React.PureComponent<StudySearchPageProps> {
  render() {
    let hash = new URLSearchParams(this.props.history.location.search)
      .getAll('hash')
      .toString();
    let siteViewUrl = new URLSearchParams(this.props.history.location.search)
      .getAll('sv')
      .toString();

    const variables = {
      hash: hash,
      id: this.props.match.params.nctId,
    };

    return (
      <SearchStudyPageQueryComponent query={QUERY} variables={variables}>
        {({ data, loading, error }) => {
          let prevLink: string | null | undefined = null;
          let nextLink: string | null | undefined = null;
          let firstLink: string | null | undefined = null;
          let lastLink: string | null | undefined = null;
          let isWorkflow: boolean = false;
          let recordsTotal: number | JSX.Element | null | undefined = (
            <div id="divsononeline">
              <PulseLoader color="#cccccc" size={8} />
            </div>
          );
          let counterIndex: number | JSX.Element | null | undefined = null;
          let workflowName: string | null = null;

          if (data && !loading) {
            const prevId = path(['search', 'studyEdge', 'prevId'], data);
            const nextId = path(['search', 'studyEdge', 'nextId'], data);
            const firstId = path(['search', 'studyEdge', 'firstId'], data);
            const lastId = path(['search', 'studyEdge', 'lastId'], data);
            isWorkflow = pathOr(
              false,
              ['search', 'studyEdge', 'isWorkflow'],
              data
            ) as boolean;
            workflowName = pathOr(
              false,
              ['search', 'studyEdge', 'workflowName'],
              data
            ) as string | null;

            // counterIndex will remain null if it's >200 or whatever we set the max page size to
            counterIndex = path(['search', 'studyEdge', 'counterIndex'], data);
            recordsTotal =
              counterIndex &&
              (pathOr(
                1,
                ['search', 'studyEdge', 'recordsTotal'],
                data
              ) as number);
            nextLink =
              nextId &&
              `/study/${nextId}?hash=${variables.hash}&sv=${siteViewUrl}`;
            prevLink =
              prevId &&
              `/study/${prevId}?hash=${variables.hash}&sv=${siteViewUrl}`;

            // just so that there isn't a first button if there isn't a prev button
            // likewise for the last button
            if (prevLink != null) {
              firstLink =
                firstId &&
                `/study/${firstId}?hash=${variables.hash}&sv=${siteViewUrl}`;
              // firstId && `/search/${variables.hash}/study/${firstId}`;
            }
            if (nextLink != null && counterIndex != null) {
              lastLink =
                lastId &&
                `/study/${lastId}?hash=${variables.hash}&sv=${siteViewUrl}`;
            }
          }
          return (
            <StudyPage
              history={this.props.history}
              location={this.props.location}
              match={this.props.match}
              prevLink={hash != '' ? prevLink : undefined}
              nextLink={hash != '' ? nextLink : undefined}
              firstLink={hash != '' ? firstLink : undefined}
              lastLink={hash != '' ? lastLink : undefined}
              isWorkflow={isWorkflow}
              recordsTotal={hash != '' ? recordsTotal : undefined}
              counterIndex={counterIndex}
              workflowName={workflowName}
              refetch={this.props.refetch}
              user={this.props.user}
            />
          );
        }}
      </SearchStudyPageQueryComponent>
    );
  }
}
export default StudySearchPage;
