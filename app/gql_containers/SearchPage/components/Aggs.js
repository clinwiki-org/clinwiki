
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
  addFilter,
  removeFilter
}) => {
  let crowdAggDropdowns = null;
  if (!_.isEmpty(crowdAggs)) {
    crowdAggDropdowns = (
      <div>
        <h4>Crowd Facets</h4>
        {Object.keys(crowdAggs).map((key) => (
          <AggDropdown
            key={key}
            agg={key}
            data={crowdAggs[key]}
            selectedKeys={aggFilters[`fm_${key}`]}
            onAggRemoved={onCrowdAggRemoved}
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
                selectedKeys={filters[k]||new Set()}
                buckets={aggs[k]}
                addFilter={addFilter}
                removeFilter={removeFilter}
              />) : null)}
          </div>
        {crowdAggDropdowns}
      </div>
    );
  }
  return null;
}

export default Aggs;