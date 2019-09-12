import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Button, Checkbox } from 'react-bootstrap';
import {
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables,
} from 'types/SuggestedLabelsQuery';
import { pipe, pathOr, prop, map, filter, fromPairs, keys } from 'ramda';
import CollapsiblePanel from 'components/CollapsiblePanel';

interface SuggestedLabelsProps {
  nctId: string;
  searchHash: string | null;
  onSelect: (key: string, value: string, checked: boolean) => void;
  disabled?: boolean;
  allowedSuggestedLabels: string[];
}

const QUERY = gql`
  query SuggestedLabelsQuery($searchHash: String!, $nctId: String!) {
    search(searchHash: $searchHash, params: { page: 0, q: { key: "*" } }) {
      aggs {
        name
        buckets {
          key
          docCount
        }
      }
    }
    study(nctId: $nctId) {
      nctId
      wikiPage {
        nctId
        meta
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

const StyledPanel = styled(CollapsiblePanel)`
  margin: 0 10px 10px 0;
  width: 250px;
  .panel-heading h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    max-width: 200px;
  }
  .panel-body {
    height: 150px !important;
    overflow: scroll;
  }
`;

class SuggestedLabels extends React.PureComponent<SuggestedLabelsProps> {
  handleSelect = (key: string, value: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    this.props.onSelect(key, value, e.currentTarget.checked);
  };

  renderAgg = (key: string, values: [string, boolean][]) => {
    return (
      <StyledPanel key={key} header={key} dropdown>
        {values.map(([value, checked]) => (
          <Checkbox
            key={value}
            checked={checked}
            disabled={this.props.disabled}
            onChange={this.handleSelect(key, value)}
          >
            {value}
          </Checkbox>
        ))}
      </StyledPanel>
    );
  };

  render() {
    if (!this.props.searchHash) return null;
    return (
      <QueryComponent
        query={QUERY}
        variables={{
          searchHash: this.props.searchHash,
          nctId: this.props.nctId,
        }}
      >
        {({ data, loading, error }) => {
          if (loading || error || !data) return null;
          let meta: { [key: string]: string } = {};
          try {
            meta = JSON.parse(
              (data.study && data.study.wikiPage && data.study.wikiPage.meta) ||
                '{}',
            );
          } catch (e) {
            console.log(`Error parsing meta: ${meta}`);
          }

          const labels = pipe(
            keys,
            map((key: string) => [key, meta[key].split('|')]),
            // @ts-ignore
            fromPairs,
          )(meta);
          const aggs = pipe(
            pathOr([], ['search', 'aggs']),
            filter((agg: any) => agg.name.startsWith('fm_')),
            map((agg: any) => {
              const name = agg.name.substring(3, 1000);
              const existingLabels = labels[name] || [];
              return [
                name,
                agg.buckets.map(bucket => [
                  bucket.key,
                  existingLabels.includes(bucket.key),
                ]),
              ];
            }),
            // @ts-ignore
            fromPairs,
          )(data);

          const aggNames = pipe(
            keys,
            filter(name => this.props.allowedSuggestedLabels.includes(name)),
          )(aggs) as string[];

          return (
            <LabelsContainer>
              {aggNames.map(key => this.renderAgg(key, aggs[key]))}
            </LabelsContainer>
          );
        }}
      </QueryComponent>
    );
  }
}

export default SuggestedLabels;
