import React from 'react';
import PropTypes from 'prop-types';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DropdownButton, MenuItem, Label } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';

const DropdownButtonWrapper = styled.div`
  .selected-aggs {
    margin: 0;
    padding-left: 10px;

    li {
      list-style-type: none;
    }
  }

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
      this.props.onAggViewed(this.props.agg);
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
          onSelect={() => this.props.onAggSelected(this.props.agg, buckets[key].key)}
        >
          {aggKeyToInner(this.props.agg, buckets[key].key)}
          {' '}
          ({buckets[key].doc_count})
        </MenuItem>
      ));
    }
    if ((!buckets) || this.props.data.loading) {
      menuItems.push(
        <BeatLoader
          key="loader"
          color="#333"
          className="text-center"
        />
      );
    }
    if (menuItems.length === 0) {
      menuItems = (
        <MenuItem disabled>
          <span>
            No results found for
            {' '}
            <i>{aggToField(this.props.agg)}</i>
          </span>
        </MenuItem>
      );
    }

    const selectedAggs = this.props.selectedKeys.map((k) => (
      <li key={k}>
        <Label>
          {k}
          {' '}
          <FontAwesome
            className="remove"
            name="remove"
            style={{ cursor: 'pointer', color: '#cc1111' }}
            onClick={() => this.props.onAggRemoved(this.props.agg, k)}
          />
        </Label>
      </li>
    ));

    return (
      <DropdownButtonWrapper>
        <DropdownButton
          bsStyle="default"
          bsSize="small"
          title={<b>{aggToField(this.props.agg)}</b>}
          id={`agg-${this.props.agg.replace(/ /, '-')}`}
          onToggle={this.onToggle}
        >
          {menuItems}
        </DropdownButton>
        <ul className="selected-aggs">
          {selectedAggs}
        </ul>
      </DropdownButtonWrapper>
    );
  }
}

AggDropdown.propTypes = {
  agg: PropTypes.string,
  data: PropTypes.object,
  onAggRemoved: PropTypes.func,
  onAggViewed: PropTypes.func,
  onAggSelected: PropTypes.func,
  selectedKeys: PropTypes.array,
};

AggDropdown.defaultProps = {
  selectedKeys: [],
};

export default AggDropdown;
