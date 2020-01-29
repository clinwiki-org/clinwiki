import * as React from 'react';
import { Label, ListGroupItem } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import styled from "styled-components";

import { render } from 'react-dom';
interface MultiCrumbProps {
  category?: string;
  values: string[];
  labels?: string[];
  onClick: (s: string) => void;
}
interface MultiCrumbState {
  showValue: boolean;
}
class MultiCrumb extends React.Component<MultiCrumbProps, MultiCrumbState> {
  state: MultiCrumbState = {
    showValue: false
  };

  toggleShowValue = () => {
    const { showValue } = this.state;

    this.setState({ showValue: !showValue });
  };
  render() {


const MultiCrumb = styled.div`
.filter-values{
  background-color: transparent;
  border: none;
}

`
    if(this.props.values.length>4 && this.state.showValue==false){
       let addVals = this.props.values.length - 4
      // let originalVals =this.props.values
      // let shortVals=originalVals
      // shortVals.splice(4, addVals, `...${addVals} others`)
      // console.log(addVals, originalVals, shortVals)

      console.log("Length >4")
      return (
        <MultiCrumb>
        <ListGroupItem className="filter-values">
          {this.props.category && <i>{this.props.category}:</i>}
          {
      this.props.values.slice(0,4).map((v,i)=>{
        const label = this.props.labels ? this.props.labels[i] : v;
      
        return (
          <b key={v}>
            <span style={{
                      // border: "1px solid rgb(127, 0, 0)",
                      border: "3px solid rgba(255, 255, 255, .75)",
                      borderRadius: "10px",
                      padding: "0 5px 0 5px",
                      color: "#55B88D"

            }}>
            {label}
            <FontAwesome
              className="remove"
              name="remove"
              style={{
                cursor: 'pointer',
                color: '#55B88D',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.props.onClick(v)}
            />
            </span>
          </b>
      
        );
      })
      }
      <b>
      <span style={{
                      // border: "1px solid rgb(127, 0, 0)",
                      border: "3px solid rgba(255, 255, 255, .75)",
                      borderRadius: "10px",
                      padding: "0 5px 0 5px",
                      color: "#55B88D"

            }}>
        {`...${addVals} others`}
        <FontAwesome
              className="chevron-right"
              name="chevron-right"
              style={{
                cursor: 'pointer',
                color: '#55B88D',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.toggleShowValue()}
            />
        </span>
      </b>
      
      </ListGroupItem>
      </MultiCrumb>
      )
     
  
    }else  if(this.props.values.length>4 && this.state.showValue==true ){

return (
  <MultiCrumb>
  <ListGroupItem className="filter-values">
    {this.props.category && <i>{this.props.category}:</i>}
  {  
    this.props.values.map((v, i) => {
            const label = this.props.labels ? this.props.labels[i] : v;
            return (
              <b key={v}>
                            <span style={{
                      // border: "1px solid rgb(127, 0, 0)",
                      border: "3px solid rgba(255, 255, 255, .75)",
                      borderRadius: "10px",
                      padding: "0 5px 0 5px",
                      color: "#55B88D"

            }}>
                {label}
                <FontAwesome
                  className='remove'
                  name='remove'
                  style={{
                    cursor: 'pointer',
                    color: '#55B88D',
                    margin: '0 0 0 3px'
                  }}
                  onClick={() => this.props.onClick(v)}
                />
                </span>
              </b>
            );
          })
        }

<b>
        <FontAwesome
              className="chevron-left"
              name="chevron-left"
              style={{
                cursor: 'pointer',
                color: '#55B88D',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.toggleShowValue()}
            />
      </b>
</ListGroupItem>
</MultiCrumb>
      )
    }else{

      return(
      <MultiCrumb>
      <ListGroupItem className="filter-values">
      {this.props.category && <i>{this.props.category}:</i>}
    {  
      this.props.values.map((v, i) => {
              const label = this.props.labels ? this.props.labels[i] : v;
              return (
                <b key={v}>
                              <span style={{
                      // border: "1px solid rgb(127, 0, 0)",
                      //border: "3px solid rgba(255, 255, 255, .75)",
                    //  borderRadius: "10px",
                      padding: "0 5px 0 5px",
                      color: "#55B88D"
            }}>
                  {label}
                  <FontAwesome
                    className='remove'
                    name='remove'
                    style={{
                      cursor: 'pointer',
                      color: '#55B88D',
                      margin: '0 0 0 3px'
                    }}
                    onClick={() => this.props.onClick(v)}
                  />
                  </span>
                </b>
              );
            })
          }
  </ListGroupItem>
  </MultiCrumb>);
    }


  
          

        // {this.state.showValue == true
        //   ? this.props.values.map((v, i) => {
        //       const label = this.props.labels ? this.props.labels[i] : v;
        //       return (
        //         <b key={v}>
        //           {label}
        //           <FontAwesome
        //             className='remove'
        //             name='remove'
        //             style={{
        //               cursor: 'pointer',
        //               color: '#cc1111',
        //               margin: '0 0 0 3px'
        //             }}
        //             onClick={() => this.props.onClick(v)}
        //           />
        //         </b>
        //       );
        //     })
        //   : null}
    
  }
}

export default MultiCrumb;
