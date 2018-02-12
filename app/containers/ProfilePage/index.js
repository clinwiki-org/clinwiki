/**
 *
 * ProfilePage
 *
 */

import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Row, Col, Form, Button, FormGroup, Checkbox, Well } from 'react-bootstrap';
import FieldGroup from 'components/FieldGroup';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';
import makeSelectProfilePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';

const ColumnPickerWrapper = styled.div`
  .checkbox-inline {
    margin-left: 5px;
  }
`;

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
    this.toggleColumnPicker = this.toggleColumnPicker.bind(this);
    this.onCheckboxChanged = this.onCheckboxChanged.bind(this);
    let selectedColumns = {};
    if (_.get(this.props, 'authheader.user.search_result_columns')) {
      _.forEach(_.get(this.props, 'authheader.user.search_result_columns'), (col) => {
        selectedColumns[col] = 1;
      });
    } else {
      selectedColumns = {
        nct_id: 1,
        brief_title: 1,
        average_rating: 1,
        completion_date: 1,
        overall_status: 1,
      };
    }

    this.state = {
      showColumnPicker: false,
      selectedColumns,
    };
  }

  onCheckboxChanged(field) {
    this.setState({
      selectedColumns: {
        ...this.state.selectedColumns,
        [field]: this.state.selectedColumns[field] ? 0 : 1,
      },
    });
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
      search_result_columns: _.pickBy(this.state.selectedColumns, (x) => x === 1),
    });
  }

  toggleColumnPicker() {
    this.setState({ showColumnPicker: !this.state.showColumnPicker });
  }

  renderColumnPicker() {
    if (!this.props.profilepage.fields) {
      return null;
    }
    let columnPicker = null;
    if (this.state.showColumnPicker) {
      const checkboxes = this.props.profilepage.fields.map((field) => (
        <Checkbox
          id={`checkbox-${field}`}
          key={field}
          inline
          onChange={() => this.onCheckboxChanged(field)}
          checked={this.state.selectedColumns[field] === 1}
        >
          {field}
        </Checkbox>
      ));
      columnPicker = (
        <Well id="column-picker">
          <FormGroup>
            {checkboxes}
          </FormGroup>
        </Well>
      );
    }

    return (
      <ColumnPickerWrapper>
        <Button id="toggle-column-picker" type="button" onClick={this.toggleColumnPicker}>Select Search Columns</Button>
        {columnPicker}
      </ColumnPickerWrapper>
    );
  }

  render() {
    if (!_.get(this.props, 'authheader.user.loggedIn')) {
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
              {this.renderColumnPicker()}
              <Button type="submit" id="submit-profile-form">
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
  profilepage: PropTypes.object,
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
