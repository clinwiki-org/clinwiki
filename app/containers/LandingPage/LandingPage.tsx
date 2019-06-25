import * as React from 'react';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { Row, Col, Form, FormControl } from 'react-bootstrap';
import { gql, ApolloClient } from 'apollo-boost';
import { ApolloConsumer }  from 'react-apollo';
import { History } from 'history';

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 50px;
  padding-bottom: 00px;

  .center {
    text-align: center
  }
  #query {
    box-shadow: 0px 2px 25px rgba(0, 0, 0, .25);
    border: none;
    font-size: 12pt;
    max-width: 120em;
  }
`;

const HASH_QUERY = gql`
  query SearchPageHashQuery( $q: SearchQueryInput!) {
    searchHash(
      params: {
        q: $q,
        page: 0,
        pageSize: 25
      }
    )
  }
`;

interface LandingPageProps {
  history : History;
}
interface LandingPageState {
  searchTerm: string;
}

class LandingPage extends React.PureComponent<LandingPageProps, LandingPageState> {
  render() {
    return <ApolloConsumer>
      {client => this.renderMain(client)}
    </ApolloConsumer>;
  }
  onSubmit = async (e,client:ApolloClient<any>) => {
    e.preventDefault();
    const params = { q: { key: "AND", children: [ { key: this.state.searchTerm }] } };
    const { data } = await client.query({ query: HASH_QUERY, variables: params });
    this.props.history.push(`/search/${data.searchHash}`);
  }
  searchChanged = e => {
    this.setState({ searchTerm: e.target.value });
  }
  renderMain = (client:ApolloClient<any>) => (<MainContainer>
    <Heading> </Heading>
    <div className="container">
      <Row className="justify-content-md-center">
        <Col md={3} />
        <Col md={6}>
          <Form className="center" onSubmit={e => this.onSubmit(e,client)}>
            <FormControl
              id="query"
              onChange={this.searchChanged}
              placeholder="Enter a Search: ex) 'Glioblastoma or Musella Foundation'" />
          </Form>
        </Col>
      </Row>
    </div>
  </MainContainer>)
}

export default LandingPage;
