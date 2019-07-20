import * as React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'; // ES2015


class AutoSuggester extends React.Component {

	render() {
		const defaultOptions = ['John', 'Miles', 'Charles', 'Herbie'];
		return <Typeahead {...this.props} options={defaultOptions}/>
	}
}

export default AutoSuggester;