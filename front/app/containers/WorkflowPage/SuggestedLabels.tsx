import * as React from 'react';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import PREFETCH_QUERY from '../StudyPage';
import { Checkbox, Col } from 'react-bootstrap';
import {
  SuggestedLabelsQuery,
  SuggestedLabelsQueryVariables,
  SuggestedLabelsQuery_crowdAggFacets_aggs,
} from 'types/SuggestedLabelsQuery';
import { pipe, pathOr, map, filter, fromPairs, keys, defaultTo } from 'ramda';
import { bucketKeyStringIsMissing } from 'utils/aggs/bucketKeyIsMissing';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { SearchParams, SearchQuery } from 'containers/SearchPage/shared';
import { WorkSearch } from './WorkSearch';
import FacetCard from 'components/FacetCard/FacetCard';

interface SuggestedLabelsProps {
  nctId: string;
  searchHash: string | null;
  onSelect: (key: string, value: string, checked: boolean) => void;
  disabled?: boolean;
  allowedSuggestedLabels: string[];
  siteView?: any;
}

const SEARCH_QUERY = gql`
  query AllQuery($nctId: String!) {
    study(nctId: $nctId) {
      nctId
      briefSummary
      detailedDescription
      eligibilityCriteria
      conditions
      briefTitle
      overallStatus
      createdAt
      updatedAt
      facilities {
        id
        city
        state
        country
        zip
      }
      interventions {
        id
        name
        description
      }
    }
  }
`;

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
const StyledPanel = styled(CollapsiblePanel)`
  margin: 0 1% 10px 1%;
  width: 23%;
  flex-wrap: wrap;
  .panel-heading h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .panel-body {
    height: 450px !important;
    overflow-x: hidden;
    white-space: normal;
    overflow-wrap: break-word;
    overflow-y: scroll;
  }
`;
const QueryResult = PREFETCH_QUERY;

interface MyFilterProps {
  params: SearchParams;
}
interface MyFilterState {
  searchTerm: string;
  params: SearchParams | null;
}

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
    this.props.onSelect(key, value, e.currentTarget.checked);
  };

  public getID() {
    return this.props.nctId;
  }

  renderAgg = (key: string, values: [string, boolean][], meta, refetch) => {
    return (
      <FacetCard
        label={key}
        meta={meta}
        nctId={this.props.nctId}
        values={values}
        onSelect={this.props.onSelect}
        refetch={refetch}
        siteView={this.props.siteView}>
        {values.map(([value, checked]) => {
          if (bucketKeyStringIsMissing(value)) {
            return null;
          }
          if (checked) {
            return (
              <Checkbox
                key={value}
                checked={checked}
                disabled={this.props.disabled}
                onChange={this.handleSelect(key, value)}>
                {value}
              </Checkbox>
            );
          } else return null;
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
          let meta: { [key: string]: string } = {};
          try {
            meta = JSON.parse(
              (data.study && data.study.wikiPage && data.study.wikiPage.meta) ||
                '{}'
            );
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

          const aggNames = pipe(
            keys,
            filter(name => this.props.allowedSuggestedLabels.includes(name))
          )(aggs) as string[];
          return (
            <LabelsContainer>
              {aggNames.map(key =>
                this.renderAgg(key, aggs[key], meta, refetch)
              )}
              <FacetCard
                meta={meta}
                label="Add Label"
                addLabel
                nctId={this.props.nctId}
                refetch={refetch}
              />
            </LabelsContainer>
          );
        }}
      </QueryComponent>
    );
  }
}
export default SuggestedLabels;
