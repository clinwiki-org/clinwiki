/**
*
* Aggs
*
*/

import React from 'react';
import AggDropdown from 'components/AggDropdown';


class Aggs extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        {Object.keys(this.props.aggs).map((k) =>
          (<AggDropdown agg={k} data={this.props.aggs[k]} />))}
      </div>
    );
  }
}

Aggs.propTypes = {
  aggs: React.PropTypes.object,
};

export default Aggs;
