import * as React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
// import {SuggestionsQuery} from 'types/SuggestionsQuery'
import { path, pathOr, test } from 'ramda';

const QUERY = gql`
  query SuggestionsQuery() {
    autosuggest() {
      word
      frequency
    }
  }
`;

interface SuggestionsProps {

}

class Suggestions extends React.PureComponent<SuggestionsProps> {
  render() {
    const options = ['aids', 'alzheimers', 'cancer', 'diabetes', 'heart', 'lung', 'pancreas', 'respiratory', 'stroke'];
    // const options = loadFile()
    return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
          if (error) {
            return null;
          }
          let wordList: [] | null | undefined = null;
          if (data && !loading) {
            wordList = path(['autosuggest', 'word'], data);
          }
          return (
            <datalist id="medical">
              {options.map(option => <option key={options.indexOf(option)}> {option} </option>)}
            </datalist>
          );
        }}
      </Query>
    );
  }
}

export default Suggestions;
