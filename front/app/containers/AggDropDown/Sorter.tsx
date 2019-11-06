import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import {SortKind, ActiveSort} from './AggDropDown';

interface SorterProps {
  type: string;
  sortKind: SortKind;
  desc: boolean;
  toggle: any;
  active: ActiveSort;
}

class Sorter extends React.PureComponent<SorterProps> {

  iconSelector = () => {
    const { type, desc } = this.props;
    if(type === 'number') {
      return `sort-numeric-${desc ? 'asc' : 'desc' }`
    }
    if(type === 'alpha') {
      return `sort-alpha-${desc ? 'asc' : 'desc' }`
    }
  }

  render() {
    const { toggle, active, type } = this.props;

    let activeSort = false;
    
    if(type === 'number' && active === ActiveSort.Number) {
      activeSort = true;
    }
    if(type === 'alpha' && active === ActiveSort.Alpha) {
      activeSort = true;
    }


    return(
      <div onClick={toggle}>
        <FontAwesome name={this.iconSelector()} style={activeSort ? {color: '#55b88d', fontSize: '26px'} : {color:'#c0c3c5', fontSize: '26px'}} /> 
      </div>
    )
  }
}

export default Sorter;