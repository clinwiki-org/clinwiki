/**
 *
 * ProfilePage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Col, Form, FormGroup, Button,
  ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';


import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';
import makeSelectProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

FieldGroup.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
};


export class ProfilePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.firstName = this.props.authheader.user.first_name;
    this.lastName = this.props.authheader.user.last_name;
    this.defaultQueryString = this.props.authheader.user.default_query_string;
    this.currentPassword = null;
    this.onProfileSubmit = this.onProfileSubmit.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeDefaultQueryString = this.onChangeDefaultQueryString.bind(this);
  }

  onChangeFirstName(e) {
    this.firstName = e.target.value;
  }

  onChangeLastName(e) {
    this.lastName = e.target.value;
  }

  onChangeDefaultQueryString(e) {
    this.defaultQueryString = e.target.value;
  }

  onProfileSubmit(e) {
    e.persist();
    e.preventDefault();
    this.props.actions.submitProfile({
      id: this.props.authheader.user.id,
      first_name: this.firstName,
      last_name: this.lastName,
      default_query_string: this.defaultQueryString,
    });
  }
  render() {
    if (!(this.props.authheader && this.props.authheader.user.loggedIn)) {
      return <h1>Not logged in!</h1>;
    }
    return (
      <div>
        <Helmet
          title="Profile"
          meta={[
            { name: 'description', content: 'Profile Page' },
          ]}
        />
        <Row>
          <Col md={6} mdOffset={4}>
            <Form onSubmit={this.onProfileSubmit}>
              <FieldGroup
                id="first_name"
                type="text"
                label="First Name"
                placeholder="Enter Your First Name"
                defaultValue={this.props.authheader.user.first_name}
                onChange={this.onChangeFirstName}
              />
              <FieldGroup
                id="last_name"
                type="text"
                label="Last Name"
                placeholder="Enter Your Last Name"
                defaultValue={this.props.authheader.user.last_name}
                onChange={this.onChangeLastName}
              />
              <FieldGroup
                id="default_query_string"
                type="text"
                label="Default Query"
                defaultValue={this.props.authheader.user.default_query_string}
                onChange={this.onChangeDefaultQueryString}
                placeholder="Enter A Default Query"
              />
              <Button type="submit">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

ProfilePage.propTypes = {
  authheader: PropTypes.object,
  actions: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  profilepage: makeSelectProfilePage(),
  authheader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'profilePage', reducer });
const withSaga = injectSaga({ key: 'profilePage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(ProfilePage);
