
import * as React from 'react';
import * as _ from 'lodash';
import AggDropDown from './AggDropDown';
import { AggBucketMap, AggCallback, SearchParams } from '../Types'

const aggsOrdered = [
  'average_rating',
  'tags', 'overall_status', 'study_type', 'sponsors',
  'facility_names', 'facility_states', 'facility_cities',
  'browse_condition_mesh_terms', 'browse_interventions_mesh_terms', 'phase',
];

interface AggsProps {
  aggs : AggBucketMap
  crowdAggs : AggBucketMap
  // selected
  filters : Set<string>,
  crowdFilters : Set<string>
  addFilter : AggCallback,
  removeFilter : AggCallback,
  searchParams : SearchParams
}

const Aggs = (props : AggsProps) => {
  const {
    aggs,
    crowdAggs,
    filters,
    crowdFilters,
    addFilter,
    removeFilter,
    searchParams
  } = props;
  let crowdAggDropdowns = null;
  let emptySet = new Set()
  if (!_.isEmpty(crowdAggs)) {
    crowdAggDropdowns = (
      <div>
        <h4>Crowd Facets</h4>
        {Object.keys(crowdAggs).map((k) => (
          <AggDropDown
            key={k}
            agg={k}
            selectedKeys={crowdFilters[k]||emptySet}
            buckets={crowdAggs[k]}
            isCrowdAgg={true}
            addFilter={(agg,item) => addFilter(agg,item,true)}
            removeFilter={(agg,item) => removeFilter(agg,item,true)}
            searchParams={searchParams}
          />
        ))}
      </div>
    );
  }
  if (!_.isEmpty(aggs)) {
    return (
      <div>
          <div>
            {aggsOrdered.map((k) => aggs[k] ?
              (<AggDropDown
                key={k}
                agg={k}
                selectedKeys={filters[k]||emptySet}
                buckets={aggs[k]}
                isCrowdAgg={false}
                addFilter={addFilter}
                removeFilter={removeFilter}
                searchParams={searchParams}
              />) : null)}
          </div>
        {crowdAggDropdowns}
      </div>
    );
  }
  return null;
}

export default Aggs;