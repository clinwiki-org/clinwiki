import React from 'react';
import PropTypes from 'prop-types';
import Halogen from 'halogen';
import styled from 'styled-components';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';

const DropdownButtonWrapper = styled.div`
  .dropdown {
    margin-top: 5px;
    width: 100%;
    button {
      width: 100%;
    }
    ul {
      min-width: 100%;
    }
  }
`;

class AggDropdown extends React.Component {

  constructor(props) {
    super(props);
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(isOpen) {
    if (isOpen) {
      this.props.aggViewed(this.props.agg);
    }
  }

  render() {
    // todo, don't get the first ten items for some reason

    let menuItems = [];
    const buckets = this.props.data.buckets;
    if (buckets) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() => ({})}
        >
          {aggKeyToInner(this.props.agg, buckets[key].key)}
          {' '}
          ({buckets[key].doc_count})
        </MenuItem>
      ));
    }
    if ((!buckets) || this.props.data.loading) {
      menuItems.push(
        <Halogen.BeatLoader
          key="loader"
          color="#333"
          className="text-center"
        />
      );
    }

    return (
      <DropdownButtonWrapper>
        <DropdownButton
          bsStyle="default"
          bsSize="small"
          title={<b>{aggToField[this.props.agg]}</b>}
          id={`agg-${this.props.agg.replace(/ /, '-')}`}
          onToggle={this.onToggle}
        >
          {menuItems}
        </DropdownButton>
      </DropdownButtonWrapper>
    );
  }
}

AggDropdown.propTypes = {
  agg: PropTypes.string,
  data: PropTypes.object,
  aggViewed: PropTypes.func,
};

export default AggDropdown;
