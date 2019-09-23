import * as React from 'react';
import { Typeahead, AsyncTypeahead, } from 'react-bootstrap-typeahead'; // ES2015
import {gql, ApolloClient} from "apollo-boost";
import { Query, ApolloConsumer } from 'react-apollo';
import { SuggestionsQuery } from 'types/SuggestionsQuery';
import { path, pathOr, test, is, map } from 'ramda';

const QUERY = gql`
  query SuggestionsQuery($params: String) {
    typeahead(params: $params)
  }
`;

class SuggestionsQueryComponent extends Query<
  SuggestionsQuery
  > {}

interface SuggestionsProps {
  params: String;
}
interface SuggestionsState {
  isLoading: boolean;
  options: [String] | null;
}

class AutoSuggester extends React.Component<SuggestionsProps, SuggestionsState> {
  constructor(props) {
    super(props);
    this.state = {
      options: [''],
      isLoading: false,
    }
  }
  render() {
    return (<ApolloConsumer>
      {client => this.renderMain(client)}
    </ApolloConsumer>);
  }

  onSearch = async (query: string, client:ApolloClient<any>) => {

    const { data }: any = await client.query({
      query: QUERY,
      variables: {
        params: query,
      },
    });
    this.setState({
      options: data.typeahead,
    });
  };

  renderMain(client:ApolloClient<any>) {

    return (
      <AsyncTypeahead {...this.props}
      options={this.state.options}
      isLoading={this.state.isLoading}
      onSearch = {e => this.onSearch(e, client)}
      minLength={1}
      maxResults={10}
      highlightOnlyResult={true}
      />
    );
  }

}

export default AutoSuggester;
