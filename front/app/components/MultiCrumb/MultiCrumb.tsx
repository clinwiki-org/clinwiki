import * as React from 'react';
import { Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { render } from 'react-dom';
interface MultiCrumbProps{
  category?: string;
  values: string[];
  labels?: string[];
  onClick: (s: string) => void;
}
interface MultiCrumbState{
  showValue: boolean;
}
class MultiCrumb extends React.Component<MultiCrumbProps, MultiCrumbState>{

state: MultiCrumbState={
  showValue: false
};

// (props: {
//   category?: string;
//   values: string[];
//   labels?: string[];
//   onClick: (s: string) => void;
// }) => {
toggleShowValue=()=>{
  const {showValue} = this.state

  this.setState({showValue: !showValue})
}
render(){  return (
    <Label className="btn">
      {this.props.category && <i>{this.props.category}:</i>}

      { this.props.values.length > 4 ?(

  <b  onClick={()=>this.toggleShowValue()}>
   ({this.props.values.length})
  </b>

      ):(

      this.props.values.map((v, i) => {
        const label = this.props.labels ? this.props.labels[i] : v;
        return (
          <b key={v}>
            {label}
            <FontAwesome
              className="remove"
              name="remove"
              style={{
                cursor: 'pointer',
                color: '#cc1111',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.props.onClick(v)}
            />
          </b>
        );
      }))}
  
{this.state.showValue==true ?
(  this.props.values.map((v, i) => {
        const label = this.props.labels ? this.props.labels[i] : v;
        return (
          <b key={v}>
            {label}
            <FontAwesome
              className="remove"
              name="remove"
              style={{
                cursor: 'pointer',
                color: '#cc1111',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.props.onClick(v)}
            />
          </b>
        );
      })):(null)}

  </Label>
  )}
};

export default MultiCrumb;
