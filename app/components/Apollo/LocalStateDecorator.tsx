import * as React from 'react';
import { Query } from 'react-apollo';
import g from 'graphql-tag';

const LOCAL_QUERY = g`{ searchQuery @client }`;

export interface ClientState {
  searchQuery : string[];
}

export function withClientState(Wrappedcomponent) {
  return class ClientDecorator extends React.PureComponent<any> {
    render() {
      return <Query query={LOCAL_QUERY}>{this.renderChild}</Query>;
    }
    renderChild = ({ loading, data, client }) => {
      return <Wrappedcomponent {... this.props}
        loading={loading}
        apolloClient={client}
        clientState={data}
        updateClientState={x => client.writeData({ data: x })}
      />;
    }
  };
}
