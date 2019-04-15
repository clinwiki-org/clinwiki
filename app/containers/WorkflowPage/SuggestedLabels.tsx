import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button } from 'react-bootstrap';
import {
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables,
} from 'types/SuggestedLabelsQuery';
import { pipe, pathOr, head, prop, defaultTo, map, divide } from 'ramda';

interface SuggestedLabelsProps {
  searchHash: string | null;
  onSelect: (value: string) => void;
}

const QUERY = gql`
  query SuggestedLabelsQuery($searchHash: String!) {
    crowdAggs: aggBuckets(
      searchHash: $searchHash
      params: {
        page: 0
        pageSize: 100000
        agg: "front_matter_keys"
        q: { key: "*" }
      }
    ) {
      aggs {
        buckets {
          key
          docCount
        }
      }
    }
  }
`;

class QueryComponent extends Query<
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables
> {}

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledButton = styled(Button)`
  margin: 0 10px 10px 0;
`;

class SuggestedLabels extends React.PureComponent<SuggestedLabelsProps> {
  handleSelect = (value: string) => () => {
    this.props.onSelect(value);
  };

  renderAgg = (agg: string) => {
    return (
      <StyledButton key={agg} onClick={this.handleSelect(agg)}>
        {agg}
      </StyledButton>
    );
  };

  render() {
    if (!this.props.searchHash) return null;
    return (
      <QueryComponent
        query={QUERY}
        variables={{ searchHash: this.props.searchHash }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          const aggs = pipe(
            pathOr([], ['crowdAggs', 'aggs']),
            head,
            defaultTo({ buckets: [] }),
            prop('buckets'),
            map(prop('key')),
          )(data);
          return <LabelsContainer>{aggs.map(this.renderAgg)}</LabelsContainer>;
        }}
      </QueryComponent>
    );
  }
}

export default SuggestedLabels;
