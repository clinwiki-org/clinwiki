import * as React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { match } from 'react-router-dom';
import { pipe, path, isNil } from 'ramda';
import { Grid, Row, Col } from 'react-bootstrap';
import Intervention from 'components/Intervention';
import SearchPage from 'containers/SearchPage/index';
import { InterventionPageQuery, InterventionPageQueryVariables } from 'types/InterventionPageQuery';
import { SearchQuery, SearchParams } from '../SearchPage/shared';

const QUERY = gql`
  query InterventionPageQuery($id: Int!) {
    intervention(id: $id) {
      ...InterventionFragment
    }
  }

  ${Intervention.fragment}
`;

class QueryComponent extends Query<InterventionPageQuery, InterventionPageQueryVariables> {}

const StyleWrapper = styled.div`
  .intervention-container {
    margin-bottom: 2rem;
  }
`;

interface InterventionPageProps {
  match?: match<{id: string}>;
  history?: any;
}

class InterventionPage extends React.PureComponent<InterventionPageProps> {
  getInterventionsId = () => {
    return pipe(
      path(['match', 'params', 'id']),
      (x: string) => x ? parseInt(x, 10) : null,
    )(this.props);
  }

  setInterventionTerm = (name) => {
    const searchQuery = {
      a: [
        {
          field: 'interventions_mesh_terms',
          values: [name],
        },
      ],
    };
  }

  render() {
    const id = this.getInterventionsId();
    if (isNil(id)) return null;

    return (
      <StyleWrapper>
        <QueryComponent query={QUERY} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading || error || !data || !data.intervention) return null;

            const searchParams : SearchParams = {
              q: { key : '*' },
              sorts: [],
              aggFilters: [{ field: 'interventions_mesh_terms', values: [data.intervention.name as string] }],
              crowdAggFilters: [],
              page: 0,
              pageSize: 25,
            };

            return (
              <div>
                <div className="intervention-container">
                  <Intervention intervention={data.intervention} />
                </div>
                <Grid>
                  <Row>
                    <Col md={12}>
                      <SearchPage
                        match={this.props.match}
                        history={this.props.history}
                        ignoreUrlHash
                        searchParams={searchParams}
                      />
                    </Col>
                  </Row>
                </Grid>
              </div>
            );
          }}
        </QueryComponent>
      </StyleWrapper>
    );
  }
}

export default InterventionPage;
