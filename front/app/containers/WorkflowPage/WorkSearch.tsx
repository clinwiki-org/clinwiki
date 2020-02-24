import * as React from 'react';
import * as Similarity from "./nlp_similarity";
import List from './WorkList'
import { Button, Input, Checkbox, Col, Row, Container, ReactTable, ListGroup, Table, FormControl,
    Form,
    FormGroup,
    ButtonGroup,
    ControlLabel} from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as Labels from "./SuggestedLabels";
import styled from 'styled-components';
import './WorkStyle.css'
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
const StyledTable = styled(Table)`
width: 60%;
`
const StyledButton = styled(Button)`

margin: 20px;
`

export interface Props {
    list?: string[],
    // handleSearch: (list: string[]) => void;
    nctid: string
  }
  
  export interface State {
    list: string[],
    test: Similarity.SectionText[]
  }
  
  export class App extends React.Component<Props,State> {
    constructor(props: Props) {
      super(props);
      this.state={
        list: [
        ],
        test: [{text: "", section: "", indices: []}, {text: "", section: "", indices: []}, {text: "", section: "", indices: []}, {text: "", section: "", indices: []}, {text: "", section: "", indices: []}]
      }
      this.removeItem=this.removeItem.bind(this)
    }
    
    addItem(e: any) {
      // Prevent button click from submitting form
      e.preventDefault(); // Let's stop this event.
      e.stopPropagation();
  
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
          list: list,
          test: Similarity.findPhrases( {wordsToFind: list, text: JSON.stringify(this.data)} ),
        });
        // Finally, we need to reset the form
        newItem.classList.remove("is-danger");
        form.reset();
        // this.setState({test: Similarity.findPhrases( {wordsToFind: this.state.list, text: JSON.stringify(this.data)} )})
      } else
      {
        // If the input doesn't have a value, make the border red since it's required
        newItem.classList.add("is-danger");
      }
      
    }
  
    removeItem(item: string) {
      // Put our list into an array
      let list=this.state.list;
      const form=document.getElementById("addItemForm") as HTMLFormElement;
      //const newItem=document.getElementById("addInput") as HTMLInputElement;
      // Check to see if item passed in matches item in array
      list.some((value,index) => {
        if(value===item)
        {
          // If item matches, remove it from array
          list.splice(index,1);
          this.setState({
            list: list,
            
          });
          return true;
        } else
        {
          return false;
        }
      });
      // Set state to list
      this.setState({
        list: list,
        test: Similarity.findPhrases( {wordsToFind: list, text: JSON.stringify(this.data)}),
      });
      // Finally, we need to reset the form
      form.reset();
    //   this.setState({test: Similarity.findPhrases( {wordsToFind: this.state.list, text: JSON.stringify(this.data)} )})
      
    
      
    }
    highlight(text: string, word: string) {
        // var inputText = document.getElementById("inputText");
        // var innerHTML = inputText.innerHTML;
        var index = text.indexOf(word);
        if (index >= 0) { 
         return text.substring(0,index);
         
        }
        else{
            return text;
        }
      }
    highlight2(text: string, word: string){
        var index = text.indexOf(word);
        if (index >= 0) { 
            return text.substring(index + word.length);
            
           }
           else{
               return null;
           }
    }
    data : string;
    
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
                  <button className="button is-info buttonstyle" onClick={(e) => this.addItem(e)}>
                    Add Item
                  </button>
                  
                </form>
                <div>
          <StyledTable striped bordered>
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
            //   this.setState({test: Similarity.findPhrases( {wordsToFind: this.state.list, text: JSON.stringify(data)} )})
              this.data= JSON.stringify(data);
              return (
            //   <tbody>
            //   <tr>{this.state.test[0]}</tr>
            //   <tr>{this.state.test[1]}</tr>
            //   <tr>{this.state.test[2]}</tr>
            //   <tr>{this.state.test[3]}</tr>
            //   <tr>{this.state.test[4]}</tr>
            //   <tr>{this.state.list[0]}</tr>
            //   </tbody>
            null
            
              )
              
  //return Similarity.findPhrases( {wordsToFind: ["Karnofsky"], text: JSON.stringify(data)} );
             }}
</Query>
    <thead>
        <tr>
        <th>Phrase</th>
        <th>Section</th>
        </tr>
    </thead>
    <tbody>
                <tr>
                <td>{this.highlight(this.state.test[0].text, this.state.test[0].indices[0])}<span className="highlight">{this.state.test[0].indices[0]}</span>{this.highlight2(this.state.test[0].text, this.state.test[0].indices[0])}</td>
                  <td>{this.state.test[0].section}</td>
                </tr>
                <tr>
                  <td>{this.highlight(this.state.test[1].text, this.state.test[1].indices[1])}<span className="highlight">{this.state.test[1].indices[1]}</span>{this.highlight2(this.state.test[1].text, this.state.test[1].indices[1])}</td>
                  <td>{this.state.test[1].section}</td>
                </tr>
                <tr>
                  <td>{this.highlight(this.state.test[2].text, this.state.test[2].indices[2])}<span className="highlight">{this.state.test[2].indices[2]}</span>{this.highlight2(this.state.test[2].text, this.state.test[2].indices[2])}</td>
                  <td>{this.state.test[2].section}</td>
                </tr>
                <tr>
                  <td>{this.highlight(this.state.test[3].text, this.state.test[3].indices[3])}<span className="highlight">{this.state.test[3].indices[3]}</span>{this.highlight2(this.state.test[3].text, this.state.test[3].indices[3])}</td>
                  <td>{this.state.test[3].section}</td>
                </tr>
                <tr>
                  <td>{this.highlight(this.state.test[4].text, this.state.test[4].indices[4])}<span className="highlight">{this.state.test[4].indices[4]}</span>{this.highlight2(this.state.test[4].text, this.state.test[4].indices[4])}</td>
                  <td>{this.state.test[4].section}</td>
                </tr>
              </tbody>
        
          </StyledTable>
          
          </div>
          
              </section>
            </div>
          </div>
        </div>
      );
    }
  }
  

  