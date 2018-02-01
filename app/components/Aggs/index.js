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
  'browse_condition_mesh_terms', 'phase',
];

class Aggs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    if (this.props.aggs) {
      return (
        <div>
          {aggsOrdered.map((k) => this.props.aggs[k] ?
            (<AggDropdown
              key={k}
              agg={k}
              data={this.props.aggs[k]}
              aggViewed={this.props.aggViewed}
            />) : null)}
        </div>
      );
    }
    return null;
  }
}

Aggs.propTypes = {
  aggs: PropTypes.object,
  aggViewed: PropTypes.func,
};

export default Aggs;
