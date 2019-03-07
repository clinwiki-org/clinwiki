import * as React from 'react';
import { gql } from 'apollo-boost';
import { Redirect, Switch, Route } from 'react-router-dom';
import { SearchPageHashQuery, SearchPageHashQueryVariables } from 'types/SearchPageHashQuery';
import {
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';
import { SearchParams, AggKind } from './shared';
import SearchStudyPage from 'containers/SearchStudyPage';
import { Query, ApolloConsumer } from 'react-apollo';
import { path, map, dissoc, pathOr, prop, any, pipe } from 'ramda';
import SearchView from './SearchView';
import { AggFilterInput, SortInput } from 'types/globalTypes';

const HASH_QUERY = gql`
  query SearchPageHashQuery(
    $q: String,
    $sorts:[SortInput!],
    $aggFilters:[AggFilterInput!],
    $crowdAggFilters:[AggFilterInput!],
    $page: Int,
    $pageSize: Int
  ) {
    searchHash(params: {
      q: $q,
      sorts: $sorts,
      aggFilters: $aggFilters,
      crowdAggFilters:$crowdAggFilters,
      page: $page,
      pageSize: $pageSize
    })
  }
`;

const PARAMS_QUERY = gql`
  query SearchPageParamsQuery($hash: String) {
    searchParams(hash: $hash) {
      q,
      sorts {
        id
        desc
      },
      aggFilters {
        field
        values
      },
      crowdAggFilters {
        field
        values
      },
      page,
      pageSize
    }
  }
`;

class HashQueryComponent extends Query<SearchPageHashQuery, SearchPageHashQueryVariables> {}
class ParamsQueryComponent extends Query<SearchPageParamsQuery, SearchPageParamsQueryVariables> {}

interface SearchPageProps {
  match: any;
  history: any;
  ignoreUrlHash: boolean | null | undefined;
}

interface SearchPageState {
  params: SearchParams | null;
  openedAgg: {
    name: string,
    kind: AggKind,
  } | null;
}

const defaultParams = {
  q: '*',
  aggFilters: [],
  crowdAggFilters: [],
  sorts: [],
  page: 0,
  pageSize: 25,
};

class SearchPage extends React.Component<SearchPageProps, SearchPageState> {
  state = {
    params: null,
    openedAgg: null,
  };

  static getDerivedStateFromProps(props: SearchPageProps, state: SearchPageState) {
    if ((state.params == null) && (props.ignoreUrlHash)) {
      return {
        params: defaultParams,
        openedAgg: null,
      };
    }
  }

  searchParamsFromQuery = (
    params: SearchPageParamsQuery_searchParams | null | undefined,
  ): SearchParams => {
    if (!params) return defaultParams;

    const aggFilters = map(dissoc('__typename'), params.aggFilters || []) as AggFilterInput[];
    const crowdAggFilters = map(
      dissoc('__typename'),
      params.crowdAggFilters || [],
    ) as AggFilterInput[];
    const sorts = map(dissoc('__typename'), params.sorts || []) as SortInput[];

    return {
      aggFilters,
      crowdAggFilters,
      sorts,
      q: params.q || '*',
      page: params.page || 0,
      pageSize: params.pageSize || 25,
    };
  }

  handleUpdateParams = (updater: (params: SearchParams) => SearchParams) => {
    console.log('Params before:');
    console.log(this.state.params);
    console.log('Params after:');
    console.log(updater(this.state.params as any));
    this.setState({ params: updater(this.state.params as any) });
  }

  isWorkflow = () => {
    return pipe(
      pathOr([], ['params', 'crowdAggFilters']),
      map(prop('field')),
      // @ts-ignore
      any(x => (x as string).toLowerCase().includes('wf_')),
    )(this.state);
  }

  handleRowClick = (nctId: string) => {
    const suffix = this.isWorkflow() && !this.props.ignoreUrlHash ? '/reviews/new' : '';
    const prefix = this.props.ignoreUrlHash ? '' : this.props.match.url;
    this.props.history.push(`${prefix}/study/${nctId}${suffix}`);
  }

  handleOpenAgg = (name: string, kind: AggKind) => {
    if (!this.state.openedAgg) {
      this.setState({ openedAgg: { name, kind } });
      return;
    }
    // @ts-ignore
    const { name: currentName, kind: currentKind } = this.state.openedAgg;
    if ((name === currentName) && (kind === currentKind)) {
      this.setState({ openedAgg: null });
      return;
    }

    this.setState({ openedAgg: { name, kind } });
  }

  render() {
    if (this.props.ignoreUrlHash) {
      return <SearchView
        params={this.state.params as any}
        openedAgg={this.state.openedAgg}
        onUpdateParams={this.handleUpdateParams}
        onRowClick={this.handleRowClick}
        onOpenAgg={this.handleOpenAgg}
      />;
    }

    const hash = path(['match', 'params', 'searchId'], this.props) as string | null;

    // if (!hash) {
    //   return (
    //     <HashQueryComponent query={HASH_QUERY} variables={defaultParams} >
    //       {({ data, loading, error }) => {
    //         if (error || loading || !data) return null;

    //         return <Redirect to={`/search/${data.searchHash}`} />;
    //       }}
    //     </HashQueryComponent>
    //   );
    // }
    return (
      <ParamsQueryComponent query={PARAMS_QUERY} variables={{ hash }}>
        {({ data, loading, error }) => {
          if (error || loading) return null;
          const params: SearchParams = this.searchParamsFromQuery(data && data.searchParams);
          // hydrate state params from hash
          if (!this.state.params) this.setState({ params });
          return (
            <HashQueryComponent query={HASH_QUERY} variables={this.state.params || undefined} >
              {({ data, loading, error }) => {
                if (error || loading || !data) return null;
                // We have a mismatch between url and params in state
                if (data.searchHash !== hash) {
                  return <Redirect to={`/search/${data.searchHash}`} />;
                }

                return (
                  <Switch>
                    <Route
                      path={`${this.props.match.path}/study/:studyId`}
                      component={SearchStudyPage}
                    />
                    <Route render={() => (
                      <SearchView
                        params={this.searchParamsFromQuery(params as any)}
                        openedAgg={this.state.openedAgg}
                        onUpdateParams={this.handleUpdateParams}
                        onRowClick={this.handleRowClick}
                        onOpenAgg={this.handleOpenAgg}
                      />
                    )} />
                  </Switch>
                );
              }}
            </HashQueryComponent>
          );
        }}
      </ParamsQueryComponent>
    );
  }
}

export default SearchPage;
