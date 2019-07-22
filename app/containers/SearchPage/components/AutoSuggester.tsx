import * as React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015
import {gql} from 'apollo-boost';
import { Query } from 'react-apollo';
import {SuggestionsQuery} from 'types/SuggestionsQuery';
import {path, pathOr, test, is, map} from 'ramda';

const QUERY = gql`
  query SuggestionsQuery {
    autosuggest {
      word
      frequency
    }
  }
`;

class AutoSuggester extends React.Component {
	eachPath = (array_data) => {
		return path(['word'], array_data);
	};

	render() {
		const defaultOptions = ['Jick', 'Miles', 'Charles', 'Herbie'];
		return (
      <Query query={QUERY}>
        {({ data, loading, error }) => {
        	if (error) {
				return null;
			}
			if (loading) {
				return "Loading ..."
			}
			let wordList: [] | null | undefined | any = null;
			if (data && !loading) {
				let autoSuggestData: any = path(['autosuggest'], data);
				//wordList = map(this.eachPath, path(['autosuggest'], data));
				wordList = map(this.eachPath, autoSuggestData);

			}
			return (
			<Typeahead {...this.props} options={wordList} minLength={1} maxResults={5}/>
				);
		}}
      </Query>
    );
		
	}
}

export default AutoSuggester;