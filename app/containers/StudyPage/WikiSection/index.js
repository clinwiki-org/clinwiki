/**
 *
 * WikiSection
 *
 */
import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import TextEditor from 'components/TextEditor'
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Grid, Button, Row, Col, Table, FormGroup, FormControl } from 'react-bootstrap';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectAuthHeader from 'containers/AuthHeader/selectors';
import LoadingPane from 'components/LoadingPane';
import makeSelectWikiSection from './selectors';
import makeSelectStudyPage from '../selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';


const CREATE_WIKI = `
# No wiki exists for this study.
**Create one now!**`;

// these are the styles provided by diffy, btw
const DiffWrapper = styled.div`
.diff{overflow:auto;}
.diff ul{background:#fff;overflow:auto;font-size:13px;list-style:none;margin:0;padding:0;display:table;width:100%;}
.diff del, .diff ins{display:block;text-decoration:none;}
.diff li{padding:0; display:table-row;margin: 0;height:1em;}
.diff li.ins{background:#dfd; color:#080}
.diff li.del{background:#fee; color:#b00}
.diff li:hover{background:#ffc}
/* try 'whitespace:pre;' if you don't want lines to wrap */
.diff del, .diff ins, .diff span{white-space:pre-wrap;font-family:courier;}
.diff del strong{font-weight:normal;background:#fcc;}
.diff ins strong{font-weight:normal;background:#9f9;}
.diff li.diff-comment { display: none; }
.diff li.diff-block-info { background: none repeat scroll 0 0 gray; }
`;

class WikiSection extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeMarkdown = this.onChangeMarkdown.bind(this);
    this.onWikiSubmit = this.onWikiSubmit.bind(this);
    this.toggleEditable = this.toggleEditable.bind(this);
    this.toggleHistory = this.toggleHistory.bind(this);
    this.toggleMarkdown = this.toggleMarkdown.bind(this);
  }

  state = {
    markdown: false,
    editable: false,
    changed: false,
    history: false,
    value: TextEditor.createValueFromString(CREATE_WIKI, 'markdown'),
    markdownValue: CREATE_WIKI,
  }

  componentWillMount() {
    if (this.props.WikiSection.wiki && this.props.WikiSection.wiki.text) {
      this.setState({
        value: TextEditor.createValueFromString(this.props.WikiSection.wiki.text, 'markdown'),
      });
    }
  }

  componentDidMount() {
    this.props.actions.wikiViewed(this.props.StudyPage.study.nct_id);
  }

  componentWillReceiveProps(nextProps) {
    if (_.get(nextProps, 'WikiSection.wiki.exists') && _.get(this.props, 'WikiSection.wiki.text') !== _.get(nextProps, 'WikiSection.wiki.text')) {
      this.setState({
        value: TextEditor.createValueFromString(nextProps.WikiSection.wiki.text, 'markdown'),
      });
    }
  }

  onChange(value) {
    this.setState({ value, changed: true });
  }

  onChangeMarkdown(e) {
    e.persist();
    this.setState({
      markdownValue: e.target.value,
      changed: true,
    });
  }

  onWikiSubmit(e) {
    e.preventDefault();
    if (!this.props.AuthHeader.user.loggedIn) {
      return this.props.actions.onAnonymousClick();
    }
    if (this.state.markdown) {
      this.props.actions.submitWiki(this.props.StudyPage.study.nct_id, this.state.markdownValue);
    } else {
      this.props.actions.submitWiki(this.props.StudyPage.study.nct_id, this.state.value.toString('markdown'));
    }
    return this.toggleEditable();
  }

  // this was copypasted from reviews -- we should refactor into a component maybe?
  getName(user) {
    if (!user) {
      return 'anonymous';
    }
    if (user.first_name) {
      return `${user.first_name} ${user.last_name[0]}`;
    }
    return user.email;
  }

  toggleEditable() {
    if (!this.props.AuthHeader.user.loggedIn) {
      return this.props.actions.onAnonymousClick();
    }

    if (this.state.editable && this.state.markdown) {
      // cache markdown changes into rte
      return this.setState({
        value: TextEditor.createValueFromString(this.state.markdownValue, 'markdown'),
        editable: false,
        history: false,
        markdown: false,
      });
    }
    return this.setState({ editable: !this.state.editable, history: false });
  }

  toggleMarkdown() {
    if (this.state.markdown) {
      // switch markdown to rte
      this.setState({
        markdown: false,
        value: TextEditor.createValueFromString(this.state.markdownValue, 'markdown'),
      });
    }
    // switch rte to markdown
    return this.setState({
      markdown: true,
      markdownValue: this.state.value.toString('markdown'),
    });
  }

  toggleHistory() {
    return this.setState({ history: !this.state.history, editable: false });
  }

  renderSubmitButton() {
    return (
      <Button
        type="submit"
        onClick={this.onWikiSubmit}
        disabled={!this.state.changed}
        style={{ marginLeft: '10px' }}
      >
        Submit <FontAwesome name="pencil" />
      </Button>
    );
  }

  renderHistoryButton() {
    if (!this.props.WikiSection.wiki.history) {
      return null;
    }
    return (
      <Button
        type="button"
        onClick={this.toggleHistory}
      >
        History <FontAwesome name="history" />
      </Button>
    );
  }

  renderMarkdownButton() {
    if (this.state.markdown) {
      return (
        <Button type="button" onClick={this.toggleMarkdown}>
          Editor <FontAwesome name="newspaper-o" />
        </Button>
      );
    }
    return (
      <Button type="button" onClick={this.toggleMarkdown}>
        Markdown <FontAwesome name="code" />
      </Button>
    );
  }

  renderEditor() {
    if (this.state.markdown) {
      return (
        <FormGroup controlId="formControlsTextarea">
          <FormControl
            style={{ minHeight: '200px' }}
            componentClass="textarea"
            defaultValue={this.state.value.toString('markdown')}
            onChange={this.onChangeMarkdown}
          />
        </FormGroup>
      );
    }
    return (
      <TextEditor
        onChange={this.onChange}
        value={this.state.value}
      />
    );
  }

  renderHistoryView() {
    return (
      <DiffWrapper>
        <Table striped>
          <tbody>
            { this.props.WikiSection.wiki.history.map((h) => (
              <tr key={h.id} style={{ padding: '10px' }}>
                <td>
                  <Row style={{ marginBottom: '10px', padding: '10px' }}>
                    <Col md={6}>
                      <b>{this.getName(h.user)}</b>
                      <br />
                    </Col>
                    <Col md={4}>
                      {h.comment}
                    </Col>
                    <Col md={2} className="text-right">
                      <small>
                        {new Date(h.created_at).toLocaleDateString('en-US')}
                      </small>
                    </Col>
                  </Row>
                  <Row style={{ padding: '10px', marginBottom: '10px' }}>
                    <Col md={12}>
                      <div
                        /* eslint-disable react/no-danger */
                        dangerouslySetInnerHTML={{ __html: h.diff_html }}
                      />
                    </Col>
                  </Row>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Row>
          <Col md={12} className="text-right">
            <Button type="button" onClick={this.toggleHistory}>
              View <FontAwesome name="photo" />
            </Button>
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
              Edit <FontAwesome name="edit" />
            </Button>
          </Col>
        </Row>
      </DiffWrapper>
    );
  }

  renderPageView() {
    return (
      <div>
        <Row>
          <Col md={12}>
            <div
              id="wikiPage"
              style={{
                background: 'rgba(255, 255, 255, 1.0)',
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: '5px',
                paddingRight: '5px',
              }}
              /* eslint-disable react/no-danger */
              dangerouslySetInnerHTML={{
                __html: (!this.state.changed && this.props.WikiSection.wiki.text_html)
                ? this.props.WikiSection.wiki.text_html
                : this.state.value.toString('html'),
              }}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            {this.renderHistoryButton()}
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
              Edit <FontAwesome name="edit" />
            </Button>
            {this.renderSubmitButton()}
          </Col>
        </Row>
      </div>
    );
  }

  renderEditView() {
    return (
      <form>
        <Row>
          <Col md={12}>
            {this.renderEditor()}
          </Col>
        </Row>
        <Row style={{ paddingTop: '10px' }}>
          <Col md={12} className="text-right">
            {this.renderMarkdownButton()}
            <Button type="button" onClick={this.toggleEditable} style={{ marginLeft: '10px' }}>
              Preview <FontAwesome name="photo" />
            </Button>
            {this.renderSubmitButton()}
          </Col>
        </Row>
      </form>
    );
  }

  render() {
    let inner;
    if (this.props.WikiSection.wiki) {
      inner = this.renderPageView();
      if (this.state.editable) {
        inner = this.renderEditView();
      }
      if (this.state.history) {
        inner = this.renderHistoryView();
      }
    } else {
      inner = (<LoadingPane />);
    }

    return (
      <Grid>
        <Helmet>
          <title>WikiSection</title>
        </Helmet>
        {inner}
      </Grid>
    );
  }
}

WikiSection.propTypes = {
  WikiSection: PropTypes.object,
  StudyPage: PropTypes.object,
  AuthHeader: PropTypes.object,
  onAnonymousClick: PropTypes.func,
  actions: PropTypes.object,
};

WikiSection.defaultProps = {
  wiki: { exists: false },
};

const mapStateToProps = createStructuredSelector({
  WikiSection: makeSelectWikiSection(),
  StudyPage: makeSelectStudyPage(),
  AuthHeader: makeSelectAuthHeader(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'wikiSection', reducer });
const withSaga = injectSaga({ key: 'wikiSection', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(WikiSection);
