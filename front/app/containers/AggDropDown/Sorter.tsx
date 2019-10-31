import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';


interface SorterProps {
  type: string;
  isActive: boolean;
  asc: boolean;
  toggle: any;
}

class Sorter extends React.PureComponent<SorterProps> {

  iconSelector = () => {
    const { type, asc } = this.props;
    if(asc) {
      if(type === 'number') {
        return 'sort-numeric-asc';
      } if(type === 'alpha') {
        return 'sort-alpha-asc';
      }
    } else {
      if(type === 'number') {
        return 'sort-numeric-desc';
      } if(type === 'alpha') {
        return 'sort-alpha-desc';
      }
    }
  }

  render() {
    const { isActive, toggle } = this.props;
    console.log('sorter', isActive)
    return(
      <div onClick={toggle}>
        <FontAwesome name={this.iconSelector()} style={isActive ? {color: 'green', fontSize: '26px'} : {color:'white', fontSize: '26px'}} /> 
      </div>
    )
  }
}

export default Sorter;