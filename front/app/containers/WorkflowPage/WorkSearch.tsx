import * as React from 'react';
import * as Similarity from "./nlp_similarity";
import List from './WorkList'
import { Button, Checkbox, Col, Row, Container, ReactTable, ListGroup, Table, FormControl,
    Form,
    FormGroup,
    ButtonGroup,
    ControlLabel} from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as Labels from "./SuggestedLabels";
const SEARCH_QUERY = gql`
query AllQuery($nctId: String!) {
  study(nctId: $nctId) {
    nctId
    detailedDescription
    eligibilityCriteria
    conditions
    briefTitle
    overallStatus
    createdAt
    updatedAt
    facilities {
      id
      city
      state
      country
      zip
    }
    interventions {
      id
      name
      description
    }
  }
}
`;

export interface Props {
    list?: string[],
    // handleSearch: (list: string[]) => void;
    nctid: string
  }
  
  export interface State {
    list: string[]
  }
  
  export class App extends React.Component<Props,State> {
    constructor(props: Props) {
      super(props);
      this.state={
        list: [
          
        ]
      }
      this.removeItem=this.removeItem.bind(this)
    }
    test : string[] = [];
    addItem(e: any) {
      // Prevent button click from submitting form
      e.preventDefault();
  
      // Create variables for our list, the item to add, and our form
      let list=this.state.list;
      
  
      const newItem=document.getElementById("addInput") as HTMLInputElement;
      const form=document.getElementById("addItemForm") as HTMLFormElement;
  
      // If our input has a value
      if(newItem.value!="")
      {
        // Add the new item to the end of our list array
        list.push(newItem.value);
        // Then we use that to set the state for list
        this.setState({
          list: list
        });
        // Finally, we need to reset the form
        newItem.classList.remove("is-danger");
        form.reset();
      } else
      {
        // If the input doesn't have a value, make the border red since it's required
        newItem.classList.add("is-danger");
      }
    }
  
    removeItem(item: string) {
      // Put our list into an array
      const list=this.state.list.slice();
      // Check to see if item passed in matches item in array
      list.some((value,index) => {
        if(value===item)
        {
          // If item matches, remove it from array
          list.splice(index,1);
          return true;
        } else
        {
          return false;
        }
      });
      // Set state to list
      this.setState({
        list: list
      });
    }
    handleSearch(event: any){
        event.preventDefault();
        return this.state.list;

    }
    // id = document.getElementsByClassName("nctid");
    // idchild = this.id[0] as HTMLDivElement;
    // idstring = this.idchild.id;
    
    public render() {
      return (
        <div className="App">
          <div className="content">
            <div className="container">
              <section className="section">
                <List items={this.state.list} delete={this.removeItem} />
              </section>
              <hr />
              <section className="section">
                <form className="form" id="addItemForm">
                  <input type="text" className="input" id="addInput" placeholder="Something that needs to be done..." />
                  <button className="button is-info" onClick={(e) => this.addItem(e)}>
                    Add Item
                  </button>
                  
                </form>
                <div>
          <Table xs striped>
            {/* <tbody> */}
            <Query
          query={SEARCH_QUERY}
          variables={{
          nctId: this.props.nctid, 
            }}
            >{({ loading, error, data }) => {
              if (loading) return 'Loading...';
              if (error) return `Error! ${error.message}`;
              
              let here=``;
              this.test=Similarity.findPhrases( {wordsToFind: this.state.list, text: JSON.stringify(data)} )
              
              return (
              <tbody>
              <tr>{this.test[0]}</tr>
              <tr>{this.test[1]}</tr>
              <tr>{this.test[2]}</tr>
              <tr>{this.test[3]}</tr>
              <tr>{this.test[4]}</tr>
              </tbody>
              )
              
  //return Similarity.findPhrases( {wordsToFind: ["Karnofsky"], text: JSON.stringify(data)} );
             }}
</Query>
              {/* <tr>{this.test[0]}</tr>
              <tr>{this.test[1]}</tr>
              <tr>{this.test[2]}</tr>
              <tr>{this.test[3]}</tr>
              <tr>{this.test[4]}</tr> */}

            
              {/* </tbody> */}
            

            

          </Table>
          </div>
              </section>
            </div>
          </div>
        </div>
      );
    }
  }
  

  