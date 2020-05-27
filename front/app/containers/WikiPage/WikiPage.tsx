import * as React from 'react';
import styled from 'styled-components';
import { partition, toPairs } from 'ramda';
import RichTextEditor, { EditorValue } from 'react-rte-yt';
import { gql } from 'apollo-boost';
import StudySummary from 'components/StudySummary';
import { match, Switch, Route } from 'react-router';
import { History, Location } from 'history';
import { WikiPageQuery, WikiPageQueryVariables } from 'types/WikiPageQuery';
import {
  WikiPageUpdateContentMutation,
  WikiPageUpdateContentMutationVariables,
} from 'types/WikiPageUpdateContentMutation';
import { Panel, Button, FormControl } from 'react-bootstrap';
import { Query, Mutation } from 'react-apollo';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoadingPane from 'components/LoadingPane';
import Error from 'components/Error';
import Edits, { WikiPageEditFragment } from 'components/Edits';
import { trimPath } from 'utils/helpers';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'types/UserFragment';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import ExpansionContext from './ExpansionContext';
import SubmitAnimation from './components/SubmitAnimation'
import { getStarColor } from '../../utils/auth'
interface WikiPageProps {
  nctId: string;
  match: match<{ nctId: string }>;
  history: History;
  location: Location;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
  refetch?: any;
  user: UserFragment | null;
}

interface WikiPageState {
  editorState: 'rich' | 'plain';
  richEditorText: EditorValue | null;
  plainEditorText: string | null;
  historyExpanded: any;
  flashAnimation: boolean;
}

const FRAGMENT = gql`
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
  }

  ${WikiPageEditFragment}
`;

const QUERY = gql`
  query WikiPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...WikiPageFragment
      }
      nctId
    }
    me {
      id
    }
  }

  ${StudySummary.fragment}
  ${FRAGMENT}
`;

const UPDATE_CONTENT_MUTATION = gql`
  mutation WikiPageUpdateContentMutation($nctId: String!, $content: String!) {
    updateWikiContent(input: { nctId: $nctId, content: $content }) {
      wikiPage {
        ...WikiPageFragment
      }
      errors
    }
  }
  ${FRAGMENT}
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

class QueryComponent extends Query<WikiPageQuery, WikiPageQueryVariables> {}
class UpdateContentMutation extends Mutation<
  WikiPageUpdateContentMutation,
  WikiPageUpdateContentMutationVariables
  > {}

class WikiPage extends React.Component<WikiPageProps, WikiPageState> {
  state: WikiPageState = {
    editorState: 'rich',
    richEditorText: null,
    plainEditorText: null,
    historyExpanded: {},
    flashAnimation: false
  };

  static fragment = FRAGMENT;
  editPath = () => `${trimPath(this.props.match.path)}/wiki/edit`;
  historyPath = () => `${trimPath(this.props.match.path)}/wiki/history`;
  getEditorText = () => {
    if (this.state.editorState === 'rich') {
      return (
        this.state.richEditorText &&
        this.state.richEditorText.toString('markdown')
      );
    }
    return this.state.plainEditorText;
  };

  handleLoaded = () => {
    this.props.onLoaded && this.props.onLoaded();
  };

  handleHistory = (hash: string, siteViewUrl: string) => {
    this.props.history.push(
      `${trimPath(
        this.props.match.url
      )}/wiki/history?hash=${hash}&sv=${siteViewUrl}`
    );
  };

  handleEdit = (hash: string, siteViewUrl: string) => {
    this.props.history.push(
      `${trimPath(
        this.props.match.url
      )}/wiki/edit?hash=${hash}&sv=${siteViewUrl}`
    );
  };

  handleView = (hash: string, siteViewUrl: string) => {
    this.props.history.push(
      `${trimPath(this.props.match.url)}?hash=${hash}&sv=${siteViewUrl}`
    );
  };

  handlePreview = (hash: string, siteViewUrl: string) => {
    if (this.state.editorState === 'plain') {
      const text = this.getEditorText() || '';
      this.setState({
        editorState: 'rich',
        richEditorText: RichTextEditor.createValueFromString(text, 'markdown'),
      });
    }

    this.props.history.push(
      `${this.props.match.url}?hash=${hash}&sv=${siteViewUrl}`
    );
  };

  handleMarkdownToggle = () => {
    const text = this.getEditorText() || '';
    const editorState = this.state.editorState === 'rich' ? 'plain' : 'rich';
    this.setState({
      editorState,
      plainEditorText: text,
      richEditorText: RichTextEditor.createValueFromString(text, 'markdown'),
    });
  };

  handleEditSubmit = (
    updateWikiContent: (vars: {
      variables: WikiPageUpdateContentMutationVariables;
    }) => void
  ) => {
    this.setState({ flashAnimation: true })
    updateWikiContent({
      variables: {
        nctId: this.props.nctId,
        content: this.getEditorText() || '',
      },
    });
  };

  handleRichEditorChange = (richEditorText: EditorValue) => {
    this.setState({ richEditorText });
  };

  handlePlainEditorChange = (e: any) => {
    this.setState({ plainEditorText: e.currentTarget.value });
  };

  handleQueryCompleted = (data: WikiPageQuery) => {
    const text =
      data && data.study && data.study.wikiPage && data.study.wikiPage.content;
    if (!text || text === this.state.plainEditorText) return;
    const historyExpanded = {};
    data?.study?.wikiPage?.edits.forEach(edit => {
      historyExpanded[edit.id] = false;
    });
    this.setState({
      plainEditorText: text,
      richEditorText: RichTextEditor.createValueFromString(text, 'markdown'),
      historyExpanded,
    });
  };
  resetHelperFunction = () => {
    this.setState({ flashAnimation: false })
  }
  handleResetAnimation = () => {
    this.props.refetch()
    setTimeout(this.resetHelperFunction, 3000)
  }
  expandAllEdits = () => {
    const { historyExpanded } = this.state;
    Object.keys(historyExpanded).forEach(key => {
      historyExpanded[key] = true;
    });
    this.setState({ ...this.state, historyExpanded });
  };

  minimizeAllEdits = () => {
    const { historyExpanded } = this.state;
    Object.keys(historyExpanded).forEach(key => {
      historyExpanded[key] = false;
    });
    this.setState({ ...this.state, historyExpanded });
  };

  toggleEditVisibility = (editId: string) => value => {
    const { historyExpanded } = this.state;
    historyExpanded[editId] = value;
    this.setState({ ...this.state, historyExpanded });
  };

  renderMarkdownButton = () => {
    if (this.state.editorState === 'plain') {
      return (
        <ThemedButton type="button" onClick={this.handleMarkdownToggle}>
          Editor <FontAwesome name="newspaper-o" />
        </ThemedButton>
      );
    }
    return (
      <ThemedButton type="button" onClick={this.handleMarkdownToggle}>
        Markdown <FontAwesome name="code" />
      </ThemedButton>
    );
  };

  renderEditButton = (
    isAuthenticated: boolean,
    hash: string,
    siteViewUrl: string
  ) => {
    if (!isAuthenticated) return null;

    return (
      <ThemedButton
        type="button"
        onClick={() => this.handleEdit(hash, siteViewUrl)}
        style={{ marginLeft: '10px' }}>
        Edit <FontAwesome name="edit" />
      </ThemedButton>
    );
  };

  renderSubmitButton = (data: WikiPageQuery, isAuthenticated: boolean, readOnly: boolean) => {
    if (!isAuthenticated) return false;
    if (readOnly) return false;
    const editorTextState = this.getEditorText();
    const editorTextData =
      data.study && data.study.wikiPage && data.study.wikiPage.content;
    const userRank = this.props.user ? this.props.user.rank : 'default'
    let rankColor = getStarColor(userRank)

    return (
      <UpdateContentMutation mutation={UPDATE_CONTENT_MUTATION}>
        {updateWikiContent => (
          this.state.flashAnimation == true ? <SubmitAnimation
            resetAnimation={this.handleResetAnimation}
            rankColor={rankColor}
          /> :
            <ThemedButton
              onClick={() => this.handleEditSubmit(updateWikiContent)}
              disabled={editorTextState === editorTextData}
              style={{ marginLeft: '10px' }}>
              Submit <FontAwesome name="pencil" />
            </ThemedButton>
        )}
      </UpdateContentMutation>
    );
  };

  renderToolbar = (
    data: WikiPageQuery,
    user: UserFragment | null,
    hash: string,
    siteViewUrl: string,
    readOnly: boolean
  ) => {
    const { historyExpanded } = this.state;
    const isAuthenticated = user !== null;
    const [maximized, minimized] = partition(
      ([k, v]) => v,
      toPairs(historyExpanded)
    );

    return (
      <Toolbar>
        <Switch>
          <Route
            path={this.editPath()}
            render={() => (
              <>
                {this.renderMarkdownButton()}{' '}
                <ThemedButton
                  type="button"
                  onClick={() => this.handlePreview(hash, siteViewUrl)}
                  style={{ marginLeft: '10px' }}>
                  Preview <FontAwesome name="photo" />
                </ThemedButton>
                {this.renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
          <Route
            path={this.historyPath()}
            render={() => (
              <>
                {minimized.length > 0 && (
                  <ThemedButton
                    type="button"
                    onClick={this.expandAllEdits}
                    style={{ marginLeft: '10px' }}>
                    Expand History <FontAwesome name="expand" />
                  </ThemedButton>
                )}
                {maximized.length > 0 && (
                  <ThemedButton
                    type="button"
                    onClick={this.minimizeAllEdits}
                    style={{ marginLeft: '10px' }}>
                    Minimize History <FontAwesome name="compress" />
                  </ThemedButton>
                )}
                {this.renderEditButton(isAuthenticated, hash, siteViewUrl)}{' '}
                <ThemedButton
                  type="button"
                  onClick={() => this.handleView(hash, siteViewUrl)}
                  style={{ marginLeft: '10px' }}>
                  View <FontAwesome name="photo" />
                </ThemedButton>
              </>
            )}
          />

          <Route
            render={() => (
              <>
                <ThemedButton
                  type="button"
                  onClick={() => this.handleHistory(hash, siteViewUrl)}>
                  History <FontAwesome name="history" />
                </ThemedButton>
                {this.renderEditButton(isAuthenticated, hash, siteViewUrl)}
                {this.renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
        </Switch>
      </Toolbar>
    );
  };

  renderEditor = (data: WikiPageQuery) => {
    if (!data || !data.study || !data.study.wikiPage) return null;
    const text = this.getEditorText();
    if (text !== data.study.wikiPage.content && !text) {
      if (this.state.editorState === 'rich') {
        const richEditorText = RichTextEditor.createValueFromString(
          data.study.wikiPage.content || '',
          'markdown'
        );
        this.setState({ richEditorText });
      } else {
        this.setState({ plainEditorText: text });
      }
    }

    const readOnly = !this.props.location.pathname.includes('/wiki/edit');

    if (this.state.editorState === 'rich') {
      return (
        <Panel>
          <Panel.Body>
            <RichTextEditor
              readOnly={readOnly}
              onChange={this.handleRichEditorChange}
              value={
                this.state.richEditorText || RichTextEditor.createEmptyValue()
              }
            />
          </Panel.Body>
        </Panel>
      );
    }

    return (
      <Panel>
        <Panel.Body>
          <FormControl
            style={{ minHeight: '200px' }}
            componentClass="textarea"
            defaultValue={this.state.plainEditorText || ''}
            onChange={this.handlePlainEditorChange}
          />
        </Panel.Body>
      </Panel>
    );
  };

  renderHistory = (data: WikiPageQuery) => {
    return null;
  };

  render() {
    const readOnly = !this.props.location.pathname.includes('/wiki/edit');

    const { historyExpanded } = this.state;
    const hash = new URLSearchParams(this.props.history.location.search)
      .getAll('hash')
      .toString();
    const siteViewUrl = new URLSearchParams(this.props.history.location.search)
      .getAll('sv')
      .toString();
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.nctId }}
        onCompleted={this.handleQueryCompleted}>
        {({ data, loading, error }) => {
          // console.log('wikidata', data);
          if (loading) {
            return <LoadingPane />;
          }
          if (error) {
            return <Error message={error.message} />;
          }
          this.handleLoaded();
          if (!data || !data.study) return null;

          return (
            <CurrentUser>
              {user => (
                <div>
                  <Switch>
                    <Route
                      path={this.historyPath()}
                      render={() => (
                        <ExpansionContext.Provider
                          value={{
                            historyExpanded,
                            toggleEditVisibility: this.toggleEditVisibility,
                          }}>
                          <Edits
                            edits={
                              (data.study &&
                                data.study.wikiPage &&
                                data.study.wikiPage.edits) ||
                              []
                            }
                          />
                        </ExpansionContext.Provider>
                      )}
                    />
                    <Route render={() => this.renderEditor(data)} />
                  </Switch>
                  {this.renderToolbar(data, user, hash, siteViewUrl, readOnly)}
                </div>
              )}
            </CurrentUser>
          );
        }}
      </QueryComponent>
    );
  }
}

export default WikiPage;
