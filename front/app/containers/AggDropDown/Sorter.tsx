import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';

interface SorterProps {
  type: string;
  desc: boolean;
  toggle: any;
  active: boolean;
}

interface SorterState {
  icon: string;
}

class Sorter extends React.PureComponent<SorterProps, SorterState> {

  state = {
    icon: ''
  }

  componentDidMount = () => {
    const { type } = this.props;
    let iconStr
    if(type ==='number') {
      iconStr = 'sort-numeric-desc'
    }
    if(type === 'alpha') {
      iconStr = 'sort-alpha-desc'
    }
    this.setState({
      icon : iconStr,
    })
  }

  componentDidUpdate = () => {
    const { type, desc, active} = this.props;
    if(type === 'number' && active) {
      this.setState({
        icon: `sort-numeric-${desc ? 'asc' : 'desc' }`
      })
    }
    if(type === 'alpha' && active) {
      this.setState({
        icon: `sort-alpha-${desc ? 'asc' : 'desc' }`
      })
    } else {
      this.setState((prevState) => {
        icon: prevState.icon
      })
    }
  }

  render() {
    const { toggle, active } = this.props;
    const { icon } = this.state;
 
    return(
      <div onClick={toggle}>
        <FontAwesome name={icon} style={active ? {color: '#55b88d', fontSize: '26px'} : {color:'#c0c3c5', fontSize: '26px'}} /> 
      </div>
    )
  }
}

export default Sorter;