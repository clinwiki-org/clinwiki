import * as React from 'react';
import { match } from 'react-router';
import { History } from 'history';
import { displayFields } from 'utils/siteViewHelpers';
import { omit, prop, without } from 'ramda';
import * as R from 'remeda';
import BulkEditView from './BulkEditView';
import { STRING_MISSING_IDENTIFIER } from 'utils/constants';
import { bulkListUpdate, bulkQueryUpdate, fetchAllWorkFlows, fetchLabels, fetchLabelsBuckets } from 'services/study/actions';
import { connect } from 'react-redux';
import { BeatLoader } from 'react-spinners';
import { fetchSearchParams } from 'services/search/actions';


// escape label
const el = (label: string) => label.replace(/ /g, '').replace('|', '_');
const buildParams = (labels: string[]): string => {
  let newLabels = without(["Key/Values", "Demographics"],labels) //Removes Key/Values to avid parsing error on '/'

  return newLabels.reduce(
    (s, label) => `$${el(label)}Params: SearchInput! ${s}`,
    ''
  );
};
const variablesForLabels = (labels: string[], params: any) => {
  let newLabels = without(["Key/Values", "Demographics"],labels) //Removes Key/Values to avid parsing error on '/'

  return newLabels.reduce(
    (variables, label) => ({
      ...variables,
      [`${el(label)}Params`]: {
        ...params,
        agg: label,
      },
    }),
    {}
  );
};
const bucketsForLabels = (labels: string[]) => {
let newLabels = without(["Key/Values", "Demographics"],labels) //Removes Key/Values to avid parsing error on '/'
console.log("🚀 ~ fils ~ newLabels", newLabels);

  const query = `
  query BucketsForLabelsQuery (${buildParams(newLabels)}) {
    ${newLabels.reduce(
      (s, l) => `
      ${s}
      ${el(l)}Selected: crowdAggBuckets(
        params:   $${el(l)}Params
      ) {
        aggs {
          name
          buckets {
            key
            docCount
          }
        }
      }
      ${el(l)}All: crowdAggBuckets(
        params: { agg: "${l}", q: { key: "*" }, page: 0, pageSize: 1000 }
      ) {
        aggs {
          name
          buckets {
            key
            docCount
          }
        }
      }
    `,
    ''
  )}
  }
  `;
  return query;
};

interface GotAggs {
  aggs:
  | {
    name: string;
    buckets: {
      key: string;
      docCount: number;
    }[];
  }[]
  | null
  | undefined;
}
function extractBucketKeys(arg?: GotAggs) {
  return arg?.aggs?.[0]?.buckets?.map((k) => k.key) || [];
}

const groupBucketsByLabel = ({ wfLabelsBuckets, labels }) =>
  labels.reduce(
    (accum, label) => ({
      ...accum,
      [label]: {
        all: extractBucketKeys(wfLabelsBuckets?.[`${el(label)}All`]),
        selected: extractBucketKeys(wfLabelsBuckets?.[`${el(label)}Selected`]),
      },
    }),
    {}
  );

interface BulkEditProps {
  match: match<{ searchId?: string }>;
  history: History;
  fetchAllWorkFlows: any;
  allWorkflows: any;
  fetchSearchParams: any;
  searchParams: any;
  fetchLabels: any;
  workflowLabels: any;
  fetchLabelsBuckets: any;
  workflowLabelsBuckets: any;
  isBulkQueryUpdating: boolean;
  bulkQueryUpdate: any;
  bulkQueryUpdateResult: any;
  bulkListUpdate: any;
}
interface BulkEditState {
  undoHistory: any[];
}
const getParsedSearchParams = (searchParams) => {
  const { q, aggFilters = [], crowdAggFilters = [] } = searchParams;
  const parsedSearchParams = {
    q: q ? JSON.parse(q) : {},
    aggFilters: aggFilters.map(omit(['__typename'])),
    crowdAggFilters: crowdAggFilters.map(omit(['__typename'])),
    page: 0,
  };
  return parsedSearchParams;
};

class BulkEditPage extends React.PureComponent<BulkEditProps, BulkEditState> {
  state = {
    undoHistory: [],
  };
  renderWorkflow() {
    const workflow = this.props.allWorkflows.data.workflowsView.workflows.filter(
      (w) => w.name.toLowerCase() === 'wf_bulk'
    )?.[0];

    console.log(workflow)
    const allowedSuggestedLabels = !workflow
      ? []
      : displayFields(
        workflow.suggestedLabelsFilter.kind,
        workflow.suggestedLabelsFilter.values,
        workflow.allSuggestedLabels.map((name) => ({ name, rank: null }))
      ).map(prop('name'));


    const searchParams = this.props.searchParams?.data?.searchParams;
    if (!searchParams) return null;

    const parsedSearchParams = getParsedSearchParams(searchParams);
    if (!this.props.workflowLabels) return null;

    const wfLabels = this.props.workflowLabels?.data;
    console.log(wfLabels)

    const recordsTotal = wfLabels.search?.recordsTotal || 0;
    const allKeys = R.uniq([
      ...extractBucketKeys(wfLabels.allCrowdAggs),
      ...extractBucketKeys(wfLabels.myCrowdAggs),
    ]);
    const labels = allKeys
      .filter((x: string) => !FILTERED_LABELS.includes(x))
      .filter(
        (x) => !workflow || allowedSuggestedLabels.includes(x)
      );

    if (!labels.length) return null;
    //Band-aid fix to the -99999999 breaking BucketsForLabelQuery, does not like the name field as -9999999999
    labels.map((label, index) => {
      if (label === STRING_MISSING_IDENTIFIER) {
        labels[index] = '_missing';
      }
    });

    const wfLabelsBuckets = this.props.workflowLabelsBuckets?.data;

    const aggBucketsByLabel = groupBucketsByLabel({
      wfLabelsBuckets,
      labels,
    });
    const handleUndo = async (undoActions, idx) => {
      console.log(undoActions)
      console.log(this.props.bulkQueryUpdateResult)
      await this.props.bulkListUpdate({ 
        input: {
          updates: undoActions.map((a) => ({
            ...omit(['__typename'], a),
            state: a.state.map(
              omit(['__typename'])
            ),
          })),
        },
      });

      // await this.setState((state) => ({
      //   undoHistory: state.undoHistory.filter(
      //     (x, i) => idx !== i
      //   )
      // }));

    };

    const handleCommit = async (toAdd, toRemove, description) => {
      let result = this.props.bulkQueryUpdate({
        input: {
          searchParams: {
            ...parsedSearchParams,
            pageSize: recordsTotal,
          },
          aggState: [
            ...toAdd.map(
              ({ name, value }) => ({
                name,
                value,
                enable: true,
              })
            ),
            ...toRemove.map(
              ({ name, value }) => ({
                name,
                value,
                enable: false,
              })
            ),
          ],
        },
      });
      console.log(result)

      // await this.setState((state) => ({
      //         undoHistory: [
      //           ...state.undoHistory,
      //           {
      //             description,
      //             undoActions:
      //               result,
      //           },
      //         ],
      //       }));

    }
    return (

      <BulkEditView
        labels={labels}
        aggBucketsByLabel={aggBucketsByLabel}
        recordsTotal={recordsTotal}
        loading={this.props.isBulkQueryUpdating}
        undoHistory={this.state.undoHistory}
        handleUndo={handleUndo}
        commit={handleCommit}
      />
    );


  }
  componentDidMount() {
    this.props.fetchAllWorkFlows()

    const hash = new URLSearchParams(this.props.history.location.search)
      .getAll('hash')
      .toString() as string | null;

    this.props.fetchSearchParams(hash)




  }
  componentDidUpdate(prevProps) {
    console.log("!", this.props)
    const searchParams = this.props.searchParams?.data?.searchParams;
    const wfLabels = this.props.workflowLabels?.data;

    if (!prevProps.searchParams && searchParams) {
      console.log(1)
      const parsedSearchParams = getParsedSearchParams(searchParams);
      const hash = new URLSearchParams(this.props.history.location.search)
        .getAll('hash')
        .toString() as string | null;

      this.props.fetchLabels({
        searchHash: hash,
        params: { ...parsedSearchParams, agg: 'front_matter_keys' },
      })
    }
    if (searchParams && wfLabels && !prevProps.workflowLabels) {
      console.log(this.props.allWorkflows)
      const workflow = this.props.allWorkflows.data.workflowsView.workflows.filter(
        (w) => w.name.toLowerCase() === 'wf_bulk'
      )?.[0];

      const allowedSuggestedLabels = !workflow
        ? []
        : displayFields(
          workflow.suggestedLabelsFilter.kind,
          workflow.suggestedLabelsFilter.values,
          workflow.allSuggestedLabels.map((name) => ({ name, rank: null }))
        ).map(prop('name'));


      if (!wfLabels) return null;
      const recordsTotal = wfLabels.search?.recordsTotal || 0;
      const allKeys = R.uniq([
        ...extractBucketKeys(wfLabels.allCrowdAggs),
        ...extractBucketKeys(wfLabels.myCrowdAggs),
      ]);
      const labels = allKeys
        .filter((x: string) => !FILTERED_LABELS.includes(x))
        .filter(
          (x) => !workflow || allowedSuggestedLabels.includes(x)
        );

      if (!labels.length) return null;
      //Band-aid fix to the -99999999 breaking BucketsForLabelQuery, does not like the name field as -9999999999
      labels.map((label, index) => {
        if (label === STRING_MISSING_IDENTIFIER) {
          labels[index] = '_missing';
        }
      });

      const parsedSearchParams = getParsedSearchParams(searchParams);
      labels && this.props.fetchLabelsBuckets(variablesForLabels(labels, parsedSearchParams), bucketsForLabels(labels));
    }
    if (!prevProps.bulkQueryUpdateResult && this.props.bulkQueryUpdateResult) {
      console.log(this.props.bulkQueryUpdateResult)
      this.setState((state) => ({
        undoHistory: [
          ...state.undoHistory,
          {
            description: "Undo last action",
            undoActions:
              this.props.bulkQueryUpdateResult.bulkQueryUpdate.undoAction,
          },
        ],
      }));
    }
  }
  render() {
    if (!this.props.allWorkflows) {
      return <BeatLoader />
    }

    console.log(this.props.allWorkflows)
    return this.renderWorkflow();
  }
}

const FILTERED_LABELS = [
  'browse_condition_mesh_terms',
  'overall_status',
  'phase',
];

const mapStateToProps = (state, ownProps) => ({
  allWorkflows: state.study.allWorkFlows,
  searchParams: state.search.searchResults,
  workflowLabels: state.study.workflowLabels,
  workflowLabelsBuckets: state.study.workflowLabelsBuckets,
  isBulkQueryUpdating: state.study.isBulkQueryUpdating,
  bulkQueryUpdateResult: state.study.bulkQueryUpdate,
})
const mapDispatchToProps = (dispatch) => ({
  fetchAllWorkFlows: () => dispatch(fetchAllWorkFlows()),
  fetchSearchParams: (hash) => dispatch(fetchSearchParams(hash)),
  fetchLabels: (variables) => dispatch(fetchLabels(variables)),
  fetchLabelsBuckets: (variables, QUERY) => dispatch(fetchLabelsBuckets(variables, QUERY)),
  bulkListUpdate: (input) => dispatch(bulkListUpdate(input)),
  bulkQueryUpdate: (input) => dispatch(bulkQueryUpdate(input))
})

export default connect(mapStateToProps, mapDispatchToProps)(BulkEditPage);
