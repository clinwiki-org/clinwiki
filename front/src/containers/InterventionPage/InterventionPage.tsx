import * as React from 'react';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import { gql }  from '@apollo/client';
import { match } from 'react-router-dom';
import Intervention from 'components/Intervention';
import SearchPage from 'containers/SearchPage/index';
import {
  InterventionPageQuery,
  InterventionPageQueryVariables,
} from 'types/InterventionPageQuery';
import { SearchParams, SearchQuery } from '../SearchPage/shared';
import {
  ThemedMainContainer,
  StyledInterventionHeading,
} from 'components/StyledComponents';
import { AggFilterInput, SortInput } from 'types/globalTypes';

const QUERY = gql`
  query InterventionPageQuery($id: Int!) {
    intervention(id: $id) {
      ...InterventionFragment
    }
  }

  ${Intervention.fragment}
`;

const QueryComponent = (
  props: QueryComponentOptions<
    InterventionPageQuery,
    InterventionPageQueryVariables
  >
) => Query(props);

interface InterventionPageProps {
  match?: match<{ id: string }>;
  history?: any;
}

class InterventionPage extends React.PureComponent<InterventionPageProps> {
  getInterventionsId = () => {
    const x = this.props.match?.params?.id;
    return x ? parseInt(x, 10) : null;
  };

  setInterventionTerm = name => {
  };

  render() {
    const id = this.getInterventionsId();
    if (id == null) return null;

    return (
      <QueryComponent query={QUERY} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading || error || !data || !data.intervention) return null;

          const searchParams: SearchParams = {
            q: { key: '*' , children: [] as SearchQuery[] },
            sorts: [],
            aggFilters: [
              {
                field: 'interventions_mesh_terms',
                values: [data.intervention.name as string],
              },
            ] as  AggFilterInput[],
            crowdAggFilters: [] as  AggFilterInput[],
            page: 0,
            pageSize: 25,
          };

          return (
            <ThemedMainContainer>
              <StyledInterventionHeading>
                <Intervention intervention={data.intervention} />
              </StyledInterventionHeading>
              <SearchPage
                match={this.props.match}
                history={this.props.history}
                searchParams={searchParams}
                intervention={true}
              />
            </ThemedMainContainer>
          );
        }}
      </QueryComponent>
    );
  }
}

export default InterventionPage;
