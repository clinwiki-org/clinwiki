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
    this.appendAnnotation = this.appendAnnotation.bind(this);
    this.appendAnnotationSubmit = this.appendAnnotationSubmit.bind(this);
    this.annotationRefs = {};
    this.state = ({
      updateableRows: {},
      appendingRows: {},
      appendingDescriptions: {},
    });
    this.updateRowData = {};
    this.removedRows = {};
  }

  onAnnotationUpdateSubmit(key, oldValue) {
    if (this.props.AuthHeader.user.loggedIn) {
      const keyValue = `${key}-${oldValue}`;
      if (this.rowIsUpdating(keyValue)) {
        let newValue = this.updateRowData[keyValue].description;
        if (_.includes(this.props.StudyPage.wiki.meta[key], '|')) {
          const filteredValues = _.map(this.props.StudyPage.wiki.meta[key].split('|'), (x) => {
            if (x === oldValue) {
              return newValue;
            }
            return x;
          });
          newValue = filteredValues.join('|');
        }
        this.props.actions.updateAnnotation(this.props.StudyPage.study.nct_id, key, newValue);
      }
      this.state.updateableRows[keyValue] = !this.state.updateableRows[keyValue];
      this.forceUpdate();
    } else {
      this.props.onAnonymousClick();
    }
  }

  onAnnotationDelete(key, value) {
    if (this.props.AuthHeader.user.loggedIn) {
      this.removedRows[`${key}-${value}`] = true;
      if (value === this.props.StudyPage.wiki.meta[key]) {
        this.props.actions.deleteAnnotation(this.props.StudyPage.study.nct_id, key);
      } else {
        const filteredValues = _.filter(this.props.StudyPage.wiki.meta[key].split('|'), (x) => x !== value);
        this.props.actions.updateAnnotation(this.props.StudyPage.study.nct_id, key, filteredValues.join('|'));
      }
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

  appendAnnotation(key) {
    if (this.props.AuthHeader.user.loggedIn) {
      this.setState({
        ...this.state,
        appendingRows: {
          ...this.state.appendingRows,
          [key]: true,
        },
      });
    } else {
      this.props.onAnonymousClick();
    }
  }

  appendAnnotationSubmit(key) {
    const newValue = `${this.props.StudyPage.wiki.meta[key]}|${this.state.appendingDescriptions[key]}`;
    this.props.actions.updateAnnotation(this.props.StudyPage.study.nct_id, key, newValue);
    this.setState({
      ...this.state,
      appendingRows: _.omit(this.state.appendingRows, key),
      appendingDescriptions: _.omit(this.state.appendingDescriptions, key),
    });
  }

  rowIsUpdating(key) {
    return this.state.updateableRows[key];
  }

  rowIsRemoved(key, value) {
    return this.removedRows && this.removedRows[`${key}-${value}`];
  }

  render() {
    if (!_.get(this.props, 'StudyPage.wiki.meta')) {
      return (<LoadingPane />);
    }
    const rows = [];
    _.forOwn(this.props.StudyPage.wiki.meta, (values, key) => {
      _.forEach(values.split('|'),
        (value) => rows.push(
          <tr key={`${key}-${value}`}>
            <td>{key}</td>
            <td>{this.rowIsUpdating(`${key}-${value}`) ?
              <textarea
                style={{ width: '100%', border: '1px solid #ccc' }}
                type="text"
                defaultValue={value}
                onChange={(e) => this.onDescriptionChange(e, `${key}-${value}`)}
                onKeyDown={(e) => {
                  if (e.keyCode === 27) {
                    this.state.updateableRows[`${key}-${value}`] = false;
                    this.forceUpdate();
                  }
                }}
              />
              : value}
            </td>
            <td>
              <Button onClick={() => this.appendAnnotation(key)}>
                Add
              </Button>
            </td>
            <td>
              <Button onClick={() => this.onAnnotationUpdateSubmit(key, value)}>
                { this.state.updateableRows[`${key}-${value}`] ?
                  'Submit' :
                  'Update'
                }
              </Button>
            </td>
            <td>
              <Button onClick={() => this.onAnnotationDelete(key, value)}>
                Delete
              </Button>
            </td>
          </tr>
        ));
      if (this.state.appendingRows[key]) {
        rows.push(
          <tr key={`${key}-appending`}>
            <td>
              {key}
            </td>
            <td>
              <textarea
                style={{ width: '100%', border: '1px solid #ccc' }}
                placeholder="Add a description..."
                onChange={(e) => this.setState({
                  ...this.state,
                  appendingDescriptions: {
                    ...this.state.appendingDescriptions,
                    [key]: e.target.value,
                  },
                })}
              />
            </td>
            <td colSpan={3} className="text-right">
              <Button onClick={() => this.appendAnnotationSubmit(key)}>
                Submit
              </Button>
            </td>
          </tr>
        );
      }
    });

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
            {rows}
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
                <td colSpan={3} className="text-right">
                  <Button onClick={this.createAnnotation}>
                    Submit
                  </Button>
                </td>
              </tr>
              :
              <tr>
                <td colSpan={5} className="text-right">
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
