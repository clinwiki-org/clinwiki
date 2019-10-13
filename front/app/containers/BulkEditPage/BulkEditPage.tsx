import * as React from 'react';
import { match } from 'react-router';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { displayFields } from 'utils/siteViewHelpers';
import { gql } from 'apollo-boost';
import {
  path,
  drop,
  addIndex,
  map,
  pipe,
  isNil,
  find,
  propEq,
  lensPath,
  set,
  keys,
  reject,
  filter,
  equals,
  isEmpty,
  prop,
} from 'ramda';
import SiteProvider from 'containers/SiteProvider';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';
import BulkEditView from './BulkEditView'
import {
  SearchPageParamsQuery,
  SearchPageParamsQueryVariables,
  SearchPageParamsQuery_searchParams,
} from 'types/SearchPageParamsQuery';

// Queries
// 0 fetch the query params from the hash
// - import PARAMS_QUERY from SearchPage.tsx
// Note: it would be convenient to just pass the searchHash to the aggBuckets query but it doesn't work right now
// query for the parameters -or- fix the back end to support searchHash

// 1 fetch list of all crowd labels and labels valid for this query
//   - also get the total number of records for display
const LABELS_QUERY = gql`
query BulkLabelsQuery($searchHash: String!) {
  myCrowdAggs: 
  	aggBuckets(
    		searchHash: $searchHash,
    		params: {page: 0, q: {key: "oxytocin"}, agg:"front_matter_keys"}) {
    aggs {
      name
      buckets {
        key
        docCount
      }
    }
  }
  allCrowdAggs: 
  	aggBuckets(
    		searchHash: $searchHash,
    		params: {page: 0, q: {key: "*"}, agg:"front_matter_keys"}) {
    aggs {
      name
      buckets {
        key
        docCount
      }
    }
  } 
  search(searchHash: $searchHash) {
    recordsTotal
  }
`;

// 2 fetch list of all crowd label values and crowd label values for this query
const bucketsForLabels = (labels:string[]) => {
  // example data: labels = ["Color"]
  // Get the list of values that apply for this query (selectedAggX) and the list of all values (allAggX)
  // map each label name to the following query
  const query = gql`
  selectedAgg1: 
  	crowdAggBuckets(
      params: {
      agg:"Color",
      q: {key: "oxytocin"}, 
      page: 0
      pageSize: 25
      }) {
    aggs {
      name
      buckets {
        key
        docCount
      }
    }
  }
  allAgg1: 
  	crowdAggBuckets(
      params: {
      agg:"Color",
      q: {key: "*"}, 
      page: 0
      pageSize: 25
      }) {
    aggs {
      name
      buckets {
        key
        docCount
      }
    }
  }  
  `;
}

interface BulkEditProps {
  match: match<{ searchId?: string }>;
}
class BulkEditPage extends React.PureComponent<BulkEditProps> {
  renderWorkflow(workflow:WorkflowConfigFragment) {
    const allowedSuggestedLabels = displayFields(
      workflow.suggestedLabelsFilter.kind,
      workflow.suggestedLabelsFilter.values,
      workflow.allSuggestedLabels.map(name => ({ name, rank: null })),
    ).map(prop('name'));

    // return (
    //   <Query query={PARAMS_QUERY}>
    //     { queryParams =>
    //       <Query query={LABELS_QUERY}>
    //         { ({data,loading,error}) =>
    //           const labels=...
    //           <Query query={bucketsForLabels(labels)}>
    //             { ({data,loading,error}) => (
    //               <BulkMutation>
    //                 { mutation => <BulkEditView labels= /> }
    //               </BulkMutation>
    //             ) }
    //           </Query>
    //         }
    //       </Query>
    //     }
    //   </Query>
    return <div>!</div>
  }
  render() {
      return (
        <WorkflowsViewProvider>
          {workflowsView => {
            const workflow = pipe(
              prop('workflows'),
              find(propEq('name', "wf_bulk")),
            )(workflowsView) as WorkflowConfigFragment | null;
            return workflow ? this.renderWorkflow(workflow) : null;
          }}
        </WorkflowsViewProvider>
      )
  }
}

export default BulkEditPage;