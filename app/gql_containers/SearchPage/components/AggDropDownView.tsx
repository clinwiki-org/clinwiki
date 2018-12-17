import * as React from 'react';
import * as _ from 'lodash';
import { BeatLoader } from 'react-spinners';
import styled from 'styled-components';
import { DropdownButton, MenuItem, Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import aggToField from 'utils/aggs/aggToField';
import aggKeyToInner from 'utils/aggs/aggKeyToInner';
import { AggBucket, AggCallback } from '../Types'

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

interface AggDropDownViewProps {
  agg: string
  buckets: AggBucket[]
  selectedKeys : Set<string>
  addFilter: AggCallback
  removeFilter: AggCallback
  loading: boolean
  isOpen: boolean
  onLoadMore: (isopen:boolean) => void
}

export class AggDropDownView extends React.PureComponent<AggDropDownViewProps> {
  render() {
    let {
        agg, // name
        buckets,
        selectedKeys, // Set
        addFilter,
        removeFilter,
        loading,
        isOpen,
        onLoadMore,
    } = this.props;

    let menuItems = [];
    if (buckets && isOpen) {
      menuItems = Object.keys(buckets).map((key) => (
        <MenuItem
          key={key}
          onSelect={() => addFilter(agg, buckets[key].key)}>
          {aggKeyToInner(agg, buckets[key].key)}
          {' '}
          ({buckets[key].docCount})
        </MenuItem>
      ));
    }
    if ((!buckets) || loading) {
      menuItems.push(
        <BeatLoader
          key="loader"
          color="#333"
        />
      );
    }
    if (menuItems.length === 0) {
      menuItems = [ 
        <MenuItem key="no_results" disabled>
          <span>
            No results found for
            {' '}
            <i>{aggToField(agg)}</i>
          </span>
        </MenuItem> ];
    }

    // const selectedAggs = []
    // selectedKeys.forEach(k => {
    //     selectedAggs.push(
    //         <li key={k}>
    //             <Label>
    //             {k}
    //             {' '}
    //             <FontAwesome
    //                 className="remove"
    //                 name="remove"
    //                 style={{ cursor: 'pointer', color: '#cc1111' }}
    //                 onClick={() => removeFilter(agg, k)}
    //             />
    //             </Label>
    //         </li>
    //     )}
    // );

    return (
      <DropdownButtonWrapper>
        <DropdownButton
          bsStyle="default"
          bsSize="small"
          title={<b>{aggToField(agg)}</b>}
          id={`agg-${agg.replace(/ /, '-')}`}
          onToggle={onLoadMore}
        >
          {menuItems}
        </DropdownButton>
        {/* <ul className="selected-aggs">
          {selectedAggs}
        </ul> */}
      </DropdownButtonWrapper>
    );
  }
}