/**
*
* Aggs
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import AggDropdown from 'components/AggDropdown';

const aggsOrdered = [
  'average_rating',
  'tags', 'overall_status', 'study_type', 'sponsors',
  'facility_names', 'facility_states', 'facility_cities',
  'browse_condition_mesh_terms', 'browse_interventions_mesh_terms', 'phase',
];

class Aggs extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    const { crowdAggs, aggs, aggFilters, onAggViewed, onAggSelected, onAggRemoved, onCrowdAggViewed } = this.props;
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
              selectedKeys={aggFilters[key]}
              onAggViewed={onCrowdAggViewed}
              onAggRemoved={onAggRemoved}
              onAggSelected={onAggSelected}
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
                selectedKeys={aggFilters[k]}
                data={aggs[k]}
                onAggViewed={onAggViewed}
                onAggRemoved={onAggRemoved}
                onAggSelected={onAggSelected}
              />) : null)}
          </div>
          {crowdAggDropdowns}
        </div>
      );
    }
    return null;
  }
}

Aggs.propTypes = {
  aggFilters: PropTypes.object,
  aggs: PropTypes.object,
  crowdAggs: PropTypes.object,
  onAggViewed: PropTypes.func,
  onAggSelected: PropTypes.func,
  onAggRemoved: PropTypes.func,
  onCrowdAggViewed: PropTypes.func,
};

export default Aggs;
