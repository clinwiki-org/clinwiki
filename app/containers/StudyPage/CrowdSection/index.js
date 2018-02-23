/**
 *
 * CrowdSection
 *
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';
import { Grid, Button, Table } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';
import LoadingPane from 'components/LoadingPane';
import makeSelectStudyPage from '../selectors';
import makeSelectCrowdSection from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import * as wikiActions from '../WikiSection/actions';


export class CrowdSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.rowIsUpdating = this.rowIsUpdating.bind(this);
    this.rowIsRemoved = this.rowIsRemoved.bind(this);
    this.onAnnotationUpdateSubmit = this.onAnnotationUpdateSubmit.bind(this);
    this.onAnnotationDelete = this.onAnnotationDelete.bind(this);
    this.addAnnotation = this.addAnnotation.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.createAnnotation = this.createAnnotation.bind(this);
    this.annotationRefs = {};
    this.state = ({
      updateableRows: {},
    });
    this.updateRowData = {};
    this.removedRows = {};
  }

  onAnnotationUpdateSubmit(key) {
    if (this.props.AuthHeader.user.loggedIn) {
      if (this.rowIsUpdating(key)) {
        this.props.actions.updateAnnotation(this.props.StudyPage.study.nct_id, key, this.updateRowData[key].description);
      }
      this.state.updateableRows[key] = !this.state.updateableRows[key];
      this.forceUpdate();
    } else {
      this.props.onAnonymousClick();
    }
  }

  onAnnotationDelete(key) {
    if (this.props.AuthHeader.user.loggedIn) {
      this.removedRows[key] = true;
      this.props.actions.deleteAnnotation(this.props.StudyPage.study.nct_id, key);
    } else {
      this.props.onAnonymousClick();
    }
  }

  onDescriptionChange(e, key) {
    this.updateRowData[key] = this.updateRowData[key] || {};
    this.updateRowData[key].description = e.target.value;
  }

  addAnnotation() {
    if (this.props.AuthHeader.user.loggedIn) {
      this.isAddingAnnotation = true;
      this.forceUpdate();
    } else {
      this.props.onAnonymousClick();
    }
  }

  createAnnotation() {
    this.props.actions.createAnnotation(
      this.props.StudyPage.study.nct_id, this.newLabel, this.newDescription);
    this.newLabel = '';
    this.newDescription = '';
    this.isAddingAnnotation = false;
  }

  rowIsUpdating(key) {
    return this.state.updateableRows[key];
  }

  rowIsRemoved(key) {
    return this.removedRows && this.removedRows[key];
  }

  render() {
    if (!_.get(this.props, 'StudyPage.wiki.meta')) {
      return (<LoadingPane />);
    }

    return (
      <Grid>
        <Helmet>
          <title>Crowd Annotations</title>
        </Helmet>
        <Table striped>
          <thead>
            <tr>
              <th width="20%">Label</th>
              <th width="60%">Description</th>
              <th width="10%"></th>
              <th width="10%"></th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.StudyPage.wiki.meta).map((key) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{this.rowIsUpdating(key) ?
                  <textarea
                    style={{ width: '100%', border: '1px solid #ccc' }}
                    type="text"
                    defaultValue={this.props.StudyPage.wiki.meta[key]}
                    onChange={(e) => this.onDescriptionChange(e, key)}
                    onKeyDown={(e) => {
                      if (e.keyCode === 27) {
                        this.state.updateableRows[key] = false;
                        this.forceUpdate();
                      }
                    }}
                  />
                  : this.props.StudyPage.wiki.meta[key]}
                </td>
                <td>
                  <Button onClick={() => this.onAnnotationUpdateSubmit(key)}>
                    { this.state.updateableRows[key] ?
                      'Submit' :
                      'Update'
                    }
                  </Button>
                </td>
                <td>
                  <Button onClick={() => this.onAnnotationDelete(key)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {this.isAddingAnnotation ?
              <tr>
                <td>
                  <input
                    style={{ width: '100%', border: '1px solid #ccc' }}
                    placeholder="Add a label..."
                    onChange={(e) => { this.newLabel = e.target.value; }}
                  />
                </td>
                <td>
                  <textarea
                    style={{ width: '100%', border: '1px solid #ccc' }}
                    placeholder="Add a description..."
                    onChange={(e) => { this.newDescription = e.target.value; }}
                  />
                </td>
                <td colSpan={2} className="text-right">
                  <Button onClick={this.createAnnotation}>
                    Submit
                  </Button>
                </td>
              </tr>
              :
              <tr>
                <td colSpan={4} className="text-right">
                  <Button onClick={this.addAnnotation}>
                    Add
                  </Button>
                </td>
              </tr>}
          </tbody>
        </Table>
      </Grid>
    );
  }
}

CrowdSection.propTypes = {
  onAnonymousClick: PropTypes.func,
  actions: PropTypes.object,
  StudyPage: PropTypes.object,
  AuthHeader: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  CrowdSection: makeSelectCrowdSection(),
  StudyPage: makeSelectStudyPage(),
  AuthHeader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    wikiActions: bindActionCreators(wikiActions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'crowdSection', reducer });
const withSaga = injectSaga({ key: 'crowdSection', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(CrowdSection);
