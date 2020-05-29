import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Checkbox, Col } from 'react-bootstrap';
import {
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables,
  SuggestedLabelsQuery_crowdAggFacets_aggs,
} from 'types/SuggestedLabelsQuery';
import {
  pipe,
  pathOr,
  map,
  filter,
  sortWith,
  fromPairs,
  keys,
  defaultTo,
  sort,
} from 'ramda';
import { bucketKeyStringIsMissing } from 'utils/aggs/bucketKeyIsMissing';
import CollapsiblePanel from 'components/CollapsiblePanel';
// import { SearchParams, SearchQuery } from 'containers/SearchPage/shared';
// import { WorkSearch } from './WorkSearch';
import FacetCard from 'components/FacetCard/FacetCard';
import { WorkflowConfigFragment_suggestedLabelsConfig } from 'types/WorkflowConfigFragment';

interface SuggestedLabelsProps {
  nctId: string;
  searchHash: string | null;
  onSelect: (key: string, value: string, checked: boolean) => void;
  disabled?: boolean;
  allowedSuggestedLabels: string[];
  suggestedLabelsConfig: Record<
    string,
    WorkflowConfigFragment_suggestedLabelsConfig
  >;
  siteView?: any;
  showAnimation:any;
}

const QUERY = gql`
  query SuggestedLabelsQuery($nctId: String!) {
    crowdAggFacets {
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

class QueryComponent extends Query<
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables
> {}

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
      config.visibleOptions.kind == 'WHITELIST' &&
      config.visibleOptions.values.length > 0
    ) {
      items = config.visibleOptions.values;
      // 'key' means alpha
      if (config.order?.sortKind == 'key') {
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
        siteView={this.props.siteView}
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
    if (!this.props.searchHash) return null;
    return (
      <QueryComponent
        query={QUERY}
        variables={{
          nctId: this.props.nctId,
        }}>
        {({ data, loading, error, refetch }) => {
          if (loading || error || !data) return null;
          let meta: Record<string, string> = {};
          try {
            meta = JSON.parse(data.study?.wikiPage?.meta || '{}');
          } catch (e) {
            console.log(`Error parsing meta: ${meta}`);
          }

          const labels = pipe(
            keys,
            map((key: string) => [key, meta[key].split('|')]),
            // @ts-ignore
            fromPairs
          )(meta);

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
                siteView={this.props.siteView}
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
