import * as React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { SuggestionsQuery } from 'types/SuggestionsQuery';
import { path, pathOr, test, is, map } from 'ramda';

const QUERY = gql`
  query SuggestionsQuery {
    autosuggest {
      word
      frequency
    }
  }
`;

class SuggestionsQueryComponent extends Query<
  SuggestionsQuery
  > {}

class AutoSuggester extends React.Component {
  eachPath = arrayData => path(['word'], arrayData);

  render() {
    // const defaultOptions = ['Jick', 'Miles', 'Charles', 'Herbie'];
    return (
      <SuggestionsQueryComponent query={QUERY}>
        {({ data, loading, error }) => {
          if (error) {
            return null;
          }
          if (loading) {
            return 'Loading ...';
          }
          let wordList: [] | null | undefined | any = null;
          if (data && !loading) {
            const autoSuggestData: any = path(['autosuggest'], data);
            // wordList = map(this.eachPath, path(['autosuggest'], data));
            wordList = map(this.eachPath, autoSuggestData);
          }
          return (
            <Typeahead {...this.props} options={wordList} minLength={1} maxResults={5} />
          );
        }}
      </SuggestionsQueryComponent>
    );
  }
}

export default AutoSuggester;
