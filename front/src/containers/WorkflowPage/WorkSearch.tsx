import * as React from 'react';
import * as Similarity from './nlp_similarity';
import * as Distance from './distance';
import List from './SearchTermList';
import {
  Button,
  Input,
  Checkbox,
  Col,
  Row,
  Container,
  ReactTable,
  ListGroup,
  Table,
  FormControl,
  Form,
  FormGroup,
  ButtonGroup,
  ControlLabel,
} from 'react-bootstrap';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import * as Labels from './SuggestedLabels';
import styled from 'styled-components';
import './WorkStyle.css';
import { runInThisContext } from 'vm';
const SEARCH_QUERY = gql`
  query AllQuery($nctId: String!) {
    study(nctId: $nctId) {
      nctId
      briefSummary
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
`;
const StyledButton = styled(Button)`
  margin: 20px;
`;

export interface Props {
  list?: string[];
  nctid: string;
}

export interface State {
  value: string;
  list: string[];
  similarityResult: Similarity.SectionText[];
}

export class WorkSearch extends React.Component<Props, State> {
  data: string | undefined;

  public renderQuery() {
    return (
      <Query
        query={SEARCH_QUERY}
        variables={{
          nctId: this.props.nctid,
        }}>
        {arg => {
          const { loading, error, data } = arg;
          if (loading) return <>'Loading...'</>;
          if (error) return <>`Error! ${error.message}`</>;

          this.data = JSON.stringify(data);
          console.log('Running Query');
          return <div id="whatever">{this.data}</div>;
        }}
      </Query>
    );
  }

  constructor(props: Props) {
    super(props);
    if (typeof this.props.list !== 'undefined') {
      this.state = {
        value: '',
        list: this.props.list,
        similarityResult: [
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
        ],
      };
    } else {
      this.state = {
        value: '',
        list: [],
        similarityResult: [
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
          { text: '', section: '', keyWord: '' },
        ],
      };
    }
    this.removeItem = this.removeItem.bind(this);
  }

  initRun(e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof this.props.list !== 'undefined') {
      for (var i = 0; i < this.state.list.length; i++) {
        if (this.props.list.indexOf(this.state.list[i]) < 0) {
          this.state.list.splice(i, 1);
        }
      }
      this.setState({
        similarityResult: Similarity.findPhrases({
          wordsToFind: this.state.list,
          text: JSON.stringify(this.data),
        }),
      });
    } else {
      this.state.list.splice(0, this.state.list.length);
    }
  }

  addItem(e: any) {
    // Prevent button click from submitting form
    e.preventDefault(); // Let's stop this event.
    e.stopPropagation();

    const form = document.getElementsByClassName('form') as HTMLCollectionOf<
      HTMLFormElement
    >;

    // If our input has a value
    if (this.state.value != '') {
      // Add the new item to the end of our list
      this.state.list.push(this.state.value);
      // Then we use that to set the state for similarityResult
      this.setState({
        similarityResult: Similarity.findPhrases({
          wordsToFind: this.state.list,
          text: JSON.stringify(this.data),
        }),
      });

      // Finally, we need to reset the form
      Array.from(form).forEach(function(element) {
        element.reset();
      });
    }
  }

  removeItem(item: string) {
    // Check to see if item passed in matches item in array
    this.state.list.some((value, index) => {
      if (value === item) {
        // If item matches, remove it from array
        this.state.list.splice(index, 1);
      }
    });
    Similarity.findPhrases({ wordsToFind: [''], text: this.data || '' });
    this.setState({
      similarityResult: Similarity.findPhrases({
        wordsToFind: this.state.list,
        text: JSON.stringify(this.data),
      }),
    });
  }

  getPhraseBeforeKeyword(text: string, word: string) {
    if (text.indexOf(word) >= 0) {
      return text.substring(0, text.indexOf(word));
    } else {
      return text;
    }
  }

  getPhraseAfterKeyword(text: string, word: string) {
    if (text.indexOf(word) >= 0) {
      return text.substring(text.indexOf(word) + word.length);
    } else {
      return '';
    }
  }

  firstRender: boolean = true;

  public render() {
    return (
      <div className="App">
        <div className="content">
          <div className="container">
            <section className="section">
              <List
                items={this.state.list}
                nctid={this.props.nctid}
                delete={this.removeItem}
              />
            </section>
            <hr />
            <section className="section">
              <form className="form">
                <input
                  type="text"
                  onChange={e => this.setState({ value: e.target.value })}
                  className="input"
                />
                <button
                  className="button is-info buttonstyle"
                  onClick={e => this.addItem(e)}>
                  Add Item
                </button>
                <button
                  className="button is-info buttonstyle"
                  onClick={e => this.initRun(e)}>
                  Reset
                </button>
              </form>
              <div>
                <StyledTable striped bordered>
                  <Query
                    query={SEARCH_QUERY}
                    variables={{
                      nctId: this.props.nctid,
                    }}>
                    {arg => {
                      const { loading, error, data } = arg;
                      if (loading) return <>'Loading...'</>;
                      if (error) return <>`Error! ${error.message}`</>;
                      this.data = JSON.stringify(data);
                      return <div></div>;
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
                      <td>
                        {this.getPhraseBeforeKeyword(
                          this.state.similarityResult[0].text,
                          this.state.similarityResult[0].keyWord
                        )}
                        <span className="highlight">
                          {this.state.similarityResult[0].keyWord}
                        </span>
                        {this.getPhraseAfterKeyword(
                          this.state.similarityResult[0].text,
                          this.state.similarityResult[0].keyWord
                        )}
                      </td>
                      <td>{this.state.similarityResult[0].section}</td>
                    </tr>
                    <tr>
                      <td>
                        {this.getPhraseBeforeKeyword(
                          this.state.similarityResult[1].text,
                          this.state.similarityResult[1].keyWord
                        )}
                        <span className="highlight">
                          {this.state.similarityResult[1].keyWord}
                        </span>
                        {this.getPhraseAfterKeyword(
                          this.state.similarityResult[1].text,
                          this.state.similarityResult[1].keyWord
                        )}
                      </td>
                      <td>{this.state.similarityResult[1].section}</td>
                    </tr>
                    <tr>
                      <td>
                        {this.getPhraseBeforeKeyword(
                          this.state.similarityResult[2].text,
                          this.state.similarityResult[2].keyWord
                        )}
                        <span className="highlight">
                          {this.state.similarityResult[2].keyWord}
                        </span>
                        {this.getPhraseAfterKeyword(
                          this.state.similarityResult[2].text,
                          this.state.similarityResult[2].keyWord
                        )}
                      </td>
                      <td>{this.state.similarityResult[2].section}</td>
                    </tr>
                    <tr>
                      <td>
                        {this.getPhraseBeforeKeyword(
                          this.state.similarityResult[3].text,
                          this.state.similarityResult[3].keyWord
                        )}
                        <span className="highlight">
                          {this.state.similarityResult[3].keyWord}
                        </span>
                        {this.getPhraseAfterKeyword(
                          this.state.similarityResult[3].text,
                          this.state.similarityResult[3].keyWord
                        )}
                      </td>
                      <td>{this.state.similarityResult[3].section}</td>
                    </tr>
                    <tr>
                      <td>
                        {this.getPhraseBeforeKeyword(
                          this.state.similarityResult[4].text,
                          this.state.similarityResult[4].keyWord
                        )}
                        <span className="highlight">
                          {this.state.similarityResult[4].keyWord}
                        </span>
                        {this.getPhraseAfterKeyword(
                          this.state.similarityResult[4].text,
                          this.state.similarityResult[4].keyWord
                        )}
                      </td>
                      <td>{this.state.similarityResult[4].section}</td>
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
