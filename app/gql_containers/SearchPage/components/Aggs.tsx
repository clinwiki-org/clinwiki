
import React from 'react';
import _ from 'lodash';
import AggDropdown from './AggDropdown';

const aggsOrdered = [
  'average_rating',
  'tags', 'overall_status', 'study_type', 'sponsors',
  'facility_names', 'facility_states', 'facility_cities',
  'browse_condition_mesh_terms', 'browse_interventions_mesh_terms', 'phase',
];

const Aggs = ({
  aggs,
  crowdAggs,
  filters,
  crowdFilters,
  addFilter,
  removeFilter,
  searchParams
}) => {
  let crowdAggDropdowns = null;
  let emptySet = new Set()
  if (!_.isEmpty(crowdAggs)) {
    crowdAggDropdowns = (
      <div>
        <h4>Crowd Facets</h4>
        {Object.keys(crowdAggs).map((k) => (
          <AggDropdown
            key={k}
            agg={k}
            selectedKeys={crowdFilters[k]||emptySet}
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
              (<AggDropdown
                key={k}
                agg={k}
                selectedKeys={filters[k]||emptySet}
                buckets={aggs[k]}
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