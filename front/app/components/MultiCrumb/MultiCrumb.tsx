import * as React from 'react';
import { Label } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
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



    if(this.props.values.length>4 && this.state.showValue==false){
       let addVals = this.props.values.length - 4
      // let originalVals =this.props.values
      // let shortVals=originalVals
      // shortVals.splice(4, addVals, `...${addVals} others`)
      // console.log(addVals, originalVals, shortVals)

      console.log("Length >4")
      return (
        <Label className='btn'>
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
                      padding: "0 5px 0 5px"
            }}>
            {label}
            <FontAwesome
              className="remove"
              name="remove"
              style={{
                cursor: 'pointer',
                color: '#fff',
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
                      padding: "0 5px 0 5px"
            }}>
        {`...${addVals} others`}
        <FontAwesome
              className="chevron-right"
              name="chevron-right"
              style={{
                cursor: 'pointer',
                color: '#fff',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.toggleShowValue()}
            />
        </span>
      </b>
      
      </Label>)
     
  
    }else  if(this.props.values.length>4 && this.state.showValue==true ){

return (
  <Label className='btn'>
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
                      padding: "0 5px 0 5px"
            }}>
                {label}
                <FontAwesome
                  className='remove'
                  name='remove'
                  style={{
                    cursor: 'pointer',
                    color: '#fff',
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
                color: '#fff',
                margin: '0 0 0 3px',
              }}
              onClick={() => this.toggleShowValue()}
            />
      </b>
</Label>
      )
    }else{

      return(
      <Label className='btn '>
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
                      padding: "0 5px 0 5px"
            }}>
                  {label}
                  <FontAwesome
                    className='remove'
                    name='remove'
                    style={{
                      cursor: 'pointer',
                      color: '#cc1111',
                      margin: '0 0 0 3px'
                    }}
                    onClick={() => this.props.onClick(v)}
                  />
                  </span>
                </b>
              );
            })
          }
  </Label>);
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
