import * as React from 'react';
import { string } from 'prop-types';
import { length, isNil, isEmpty } from 'ramda';
import { Checkbox, FormControl } from 'react-bootstrap';
import { AggBucket } from '../SearchPage/Types';
import SortKind from './SortKind';
import Sorter from './Sorter';

interface FilterProps {
  agg: string;
  buckets: Array<AggBucket>;
  filter: string;
  desc: boolean;
  sortKind: SortKind;
  selectAll: any;
  checkSelect: any;
  checkboxValue: any;
  removeSelectAll: any;
  setShowLabel: any;
  toggleAlphaSort: any;
  toggleNumericSort: any;
  handleFilterChange: any;
  showLabel: boolean;
}

class Filter extends React.Component<FilterProps> {
  render() {
    const {
      agg,
      buckets = [],
      filter,
      desc,
      sortKind,
      selectAll,
      checkSelect,
      checkboxValue,
      removeSelectAll,
      showLabel,
      setShowLabel,
      handleFilterChange,
      toggleAlphaSort,
      toggleNumericSort,
    } = this.props;
    if (length(buckets) <= 10 && (isNil(filter) || isEmpty(filter))) {
      return null;
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderBottom: 'solid 1px #ddd',
        }}>
        <div style={{ marginTop: '1em' }}>
          <Checkbox
            checked={removeSelectAll ? checkSelect() : checkboxValue}
            onChange={selectAll}
            onMouseEnter={setShowLabel(true)}
            onMouseLeave={setShowLabel(false)}>
            {showLabel ? (
              <span
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  border: '1px solid #ccc',
                  padding: '5px',
                  position: 'absolute',
                  left: '1em',
                  width: '6em',
                  color: 'black',
                  background: 'white',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                }}>
                Select All
              </span>
            ) : null}
          </Checkbox>
        </div>

        <div
          style={{
            flex: 2,
            justifyContent: 'space-around',
            alignItems: 'center',
            display: 'flex',
          }}>
          <Sorter
            type="alpha"
            desc={desc}
            active={sortKind === SortKind.Alpha}
            toggle={toggleAlphaSort}
          />
          <Sorter
            type="number"
            desc={desc}
            active={sortKind === SortKind.Number}
            toggle={toggleNumericSort}
          />
        </div>
        <FormControl
          type="text"
          placeholder="filter..."
          value={filter}
          onChange={handleFilterChange}
          style={{ flex: 4, marginTop: '4px' }}
        />
      </div>
    );
  }
}

export default Filter;
