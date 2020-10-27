import * as React from 'react';
import styled from 'styled-components';
import { Query, QueryComponentOptions } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Checkbox } from 'react-bootstrap';
import {
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables,
  SuggestedLabelsQuery_crowdAggFacets_aggs,
} from 'types/SuggestedLabelsQuery';
import {
  pipe,
  map,
  fromPairs,
  keys,
  defaultTo,
} from 'ramda';
import { bucketKeyStringIsMissing } from 'utils/aggs/bucketKeyIsMissing';
// import { SearchParams, SearchQuery } from 'containers/SearchPage/shared';
// import { WorkSearch } from './WorkSearch';
import FacetCard from 'components/FacetCard/FacetCard';
import { WorkflowConfigFragment_suggestedLabelsConfig } from 'types/WorkflowConfigFragment';
import { BeatLoader } from 'react-spinners';
import Error from 'components/Error';

interface SuggestedLabelsProps {
  nctId: string;
  onSelect: (key: string, value: string, checked: boolean) => void;
  disabled?: boolean;
  allowedSuggestedLabels: string[];
  suggestedLabelsConfig: Record<
    string,
    WorkflowConfigFragment_suggestedLabelsConfig
  >;
  showAnimation:any;
}

const QUERY = gql`
  query SuggestedLabelsQuery($nctId: String!, $crowdBucketsWanted: [String!]) {
    crowdAggFacets(crowdBucketsWanted: $crowdBucketsWanted) { 
      aggs {
        name
        buckets {
          key
          keyAsString
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

const QueryComponent = (
  props: QueryComponentOptions<
    SuggestedLabelsQuery,
    SuggestedLabelsQueryVariables
  >
) => Query(props);

const LabelsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

interface SuggestedLabelsState {
  list: string[];
}

class SuggestedLabels extends React.PureComponent<
  SuggestedLabelsProps,
  SuggestedLabelsState
> {
  handleSelect = (key: string, value: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.showAnimation()
    this.props.onSelect(key, value, e.currentTarget.checked);
  };

  public getID() {
    return this.props.nctId;
  }

  renderAgg = (
    key: string,
    values: [string, boolean][],
    meta: Record<string, string>,
    refetch,
    config?: WorkflowConfigFragment_suggestedLabelsConfig
  ) => {
    // If config.visibleOptions is present replace values with the whitelist, preserve checked

    const checkedValues = new Set(
      values.filter(([_, checked]) => checked).map(([value, _]) => value)
    );

    let items = values.map(([value, _]) => value);

    if (
      config &&
      config.visibleOptions.kind === 'WHITELIST' &&
      config.visibleOptions.values.length > 0
    ) {
      items = config.visibleOptions.values;
      // 'key' means alpha
      if (config.order?.sortKind === 'key') {
        items.sort();
        if (!config.order?.desc) {
          items.reverse();
        }
      }
    }
    return (
      <FacetCard
        key={key}
        label={key}
        meta={meta}
        nctId={this.props.nctId}
        values={items}
        onSelect={this.props.onSelect}
        refetch={refetch}
        showAnimation={this.props.showAnimation}
        >
        {items.map(value => {
          if (bucketKeyStringIsMissing(value)) {
            return null;
          }
          return (
            <Checkbox
              key={value}
              checked={checkedValues.has(value)}
              disabled={this.props.disabled}
              onChange={this.handleSelect(key, value)}>
              {value}
            </Checkbox>
          );
        })}
      </FacetCard>
    );
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{
          nctId: this.props.nctId,
          crowdBucketsWanted: this.props.allowedSuggestedLabels
        }}>
        {({ data, loading, error, refetch }) => {
          
          if (loading) return <BeatLoader />;
          if (error) return <Error message={error.message} />;
          if (!data) return null;

          let meta: Record<string, string> = {};
          try {
            meta = JSON.parse(data.study?.wikiPage?.meta || '{}');
          } catch (e) {
            console.log(`Error parsing meta: ${meta}`);
          }

          const labels = fromPairs(
            keys(meta).map(key => [key, meta[key].split('|')])
          );

          const aggs = pipe(
            map((agg: SuggestedLabelsQuery_crowdAggFacets_aggs) => {
              const name = agg.name.substring(3);
              const existingLabels = labels[name] || [];
              return [
                name,
                agg.buckets.map(bucket => {
                  return [
                    defaultTo(bucket.key)(bucket.keyAsString),
                    existingLabels.includes(bucket.key),
                  ];
                }),
              ];
            }),
            // @ts-ignore
            fromPairs
            // @ts-ignore
          )(data?.crowdAggFacets?.aggs || []);

          const config = this.props.suggestedLabelsConfig;

          const max = 999999;
          const aggNames = keys(aggs)
            .filter(name => this.props.allowedSuggestedLabels.includes(name))
            .sort(
              (a, b) => (config[a]?.rank || max) - (config[b]?.rank || max)
            );

          const allCrowdAggs = keys(aggs);

          return (
            <LabelsContainer>
              {aggNames.map(key =>
                this.renderAgg(
                  key,
                  aggs[key],
                  meta,
                  refetch,
                  this.props.suggestedLabelsConfig[key]
                )
              )}
              <FacetCard
                meta={meta}
                label="Add Label"
                addLabel
                nctId={this.props.nctId}
                refetch={refetch}
                aggNames={allCrowdAggs}
                allValues={aggs}
                showAnimation={this.props.showAnimation}
              />
            </LabelsContainer>
          );
        }}
      </QueryComponent>
    );
  }
}
export default SuggestedLabels;
