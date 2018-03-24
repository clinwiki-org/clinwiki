/**
*
* Aggs
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import AggDropdown from 'components/AggDropdown';

const aggsOrdered = [
  'average_rating',
  'tags', 'overall_status', 'study_type', 'sponsors',
  'facility_names', 'facility_states', 'facility_cities',
  'browse_condition_mesh_terms', 'browse_interventions_mesh_terms', 'phase',
];

class Aggs extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onAggViewed = this.onAggViewed.bind(this);
    this.onAggSelected = this.onAggSelected.bind(this);
    this.onAggRemoved = this.onAggRemoved.bind(this);
  }

  onAggViewed(k) {
    this.props.onAggViewed(k);
  }

  onAggSelected(k, v) {
    this.props.onAggSelected(k, v);
  }

  onAggRemoved(k, v) {
    this.props.onAggRemoved(k, v);
  }

  render() {
    if (this.props.aggs) {
      return (
        <div>
          {aggsOrdered.map((k) => this.props.aggs[k] ?
            (<AggDropdown
              key={k}
              agg={k}
              selectedKeys={this.props.aggFilters[k]}
              data={this.props.aggs[k]}
              onAggViewed={this.onAggViewed}
              onAggRemoved={this.onAggRemoved}
              onAggSelected={this.onAggSelected}
            />) : null)}
        </div>
      );
    }
    return null;
  }
}

Aggs.propTypes = {
  aggFilters: PropTypes.object,
  aggs: PropTypes.object,
  onAggViewed: PropTypes.func,
  onAggSelected: PropTypes.func,
  onAggRemoved: PropTypes.func,
};

export default Aggs;
