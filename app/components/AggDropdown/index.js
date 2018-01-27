import React from 'react';
import Halogen from 'halogen';
import { DropdownButton, NavItem, MenuItem } from 'react-bootstrap';

class AggDropdown extends React.Component {

  render() {
    let menuItems = '';
    const buckets = this.props.data.buckets;

    if (buckets) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() => ({})}
        >
          {buckets[key].key}
          {' '}
          ({buckets[key].doc_count})
        </MenuItem>
      ));

      if (!this.data || this.data.loading) {
        menuItems.push(
          <Halogen.BeatLoader
            key="loader"
            color="#333"
            className="text-center"
          />
        );
      }
    }

    return (
      <NavItem>
        <DropdownButton
          bsStyle="default"
          bsSize="small"
          style={{ maxHeight: '200px' }}
          title={<b>{this.props.agg}</b>}
          id={`agg-${this.props.agg.replace(/ /, '-')}`}
        >
          {menuItems}
        </DropdownButton>
      </NavItem>
    );
  }
}

AggDropdown.propTypes = {
  agg: React.PropTypes.string,
  data: React.PropTypes.object,
};

export default AggDropdown;
