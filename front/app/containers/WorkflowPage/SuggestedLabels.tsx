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
import { pipe, pathOr, map, filter, fromPairs, keys } from 'ramda';
import { bucketKeyStringIsMissing } from 'utils/aggs/bucketKeyIsMissing';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { SearchParams, SearchQuery } from 'containers/SearchPage/shared';
import { WorkSearch } from './WorkSearch';
interface SuggestedLabelsProps {
  nctId: string;
  searchHash: string | null;
  onSelect: (key: string, value: string, checked: boolean) => void;
  disabled?: boolean;
  allowedSuggestedLabels: string[];
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
const StyledCol = styled(Col)`
  width: 30%;
`;
const StyledPanel = styled(CollapsiblePanel)`
  margin: 0 2% 10px 2%;
  width: 46%;
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

  renderAgg = (key: string, values: [string, boolean][]) => {
    if (bucketKeyStringIsMissing(key)) {
      // don't suggest the "missing" label
      return null;
    }
    return (
      <StyledPanel key={key} header={key} dropdown>
        {/* <Col xs={4}> */}
        {values.map(([value, checked]) => (
          <Checkbox
            key={value}
            checked={checked}
            disabled={this.props.disabled}
            onChange={this.handleSelect(key, value)}>
            {value}
          </Checkbox>
        ))}
        {/* </Col> */}
        {/* <Col xs={4}>
            <div>
              <WorkSearch nctid={this.props.nctId} />
            </div>
          </Col> */}
      </StyledPanel>
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
        {({ data, loading, error }) => {
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
                agg.buckets.map(bucket => [
                  bucket.key,
                  existingLabels.includes(bucket.key),
                ]),
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
              {aggNames.map(key => this.renderAgg(key, aggs[key]))}
            </LabelsContainer>
          );
        }}
      </QueryComponent>
    );
  }
}
export default SuggestedLabels;
