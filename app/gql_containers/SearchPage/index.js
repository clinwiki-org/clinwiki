
import React from 'react';
import _ from 'lodash';
import LoadingPane from 'components/LoadingPane';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from 'react-helmet';
import { Grid, Row, Col } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';


const SearchWrapper = styled.div`
  .rt-tr {
    cursor: pointer;
  }
  #search-sidebar{
    padding-right: 0;
  }
  #search-main {
    padding-left: 0;
    padding-top: 6px;
  }
`;

export class GqlSearchPage extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    render() {
        // We don't need to be logged in so why check the session?
        if (!this.props.AuthHeader.sessionChecked) {
            return <LoadingPane />
        }
        console.log(this.props.AuthHeader)
        return <SearchWrapper>
        <Helmet>
          <title>Search</title>
          <meta name="description" content="Description of SearchPage" />
        </Helmet>
        <Row>
          what's up dudes
          <Col md={2} id="search-sidebar">
          </Col>
          <Col md={10} id="search-main">
            <Grid>
              <Row>
                <Col md={12}>
                </Col>
              </Row>
            </Grid>
          </Col>
        </Row>
        </SearchWrapper>
    }
}

// export default (props) => <div>function search page</div>

const mapStateToProps = createStructuredSelector({
  AuthHeader: makeSelectAuthHeader(),
});
const withConnect = connect(mapStateToProps);

export default compose(
  withConnect
  (GqlSearchPage))