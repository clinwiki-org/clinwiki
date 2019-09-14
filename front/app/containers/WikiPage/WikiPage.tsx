import * as React from 'react';
import styled from 'styled-components';
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

import LoadingPane from 'components/LoadingPane';
import Error from 'components/Error';
import Edits from 'components/Edits';
import { trimPath } from 'utils/helpers';
import CurrentUser from 'containers/CurrentUser';
import { UserFragment } from 'types/UserFragment';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';

interface WikiPageProps {
  match: match<{ nctId: string }>;
  history: History;
  location: Location;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
}

interface WikiPageState {
  editorState: 'rich' | 'plain';
  richEditorText: EditorValue | null;
  plainEditorText: string | null;
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

  ${Edits.fragment}
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

  handleHistory = () => {
    this.props.history.push(`${trimPath(this.props.match.url)}/wiki/history`);
  };

  handleEdit = () => {
    this.props.history.push(`${trimPath(this.props.match.url)}/wiki/edit`);
  };

  handleView = () => {
    this.props.history.push(trimPath(this.props.match.url));
  };

  handlePreview = () => {
    if (this.state.editorState === 'plain') {
      const text = this.getEditorText() || '';
      this.setState({
                      editorState: 'rich',
                      richEditorText: RichTextEditor.createValueFromString(text, 'markdown'),
                    });
    }

    this.props.history.push(this.props.match.url);
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
    }) => void,
  ) => {
    updateWikiContent({
                        variables: {
                          nctId: this.props.match.params.nctId,
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
    this.setState({
                    plainEditorText: text,
                    richEditorText: RichTextEditor.createValueFromString(text, 'markdown'),
                  });
  };

  renderMarkdownButton = () => {
    if (this.state.editorState === 'plain') {
      return (
        <Button type="button" onClick={this.handleMarkdownToggle}>
          Editor <FontAwesome name="newspaper-o" />
        </Button>
      );
    }
    return (
      <Button type="button" onClick={this.handleMarkdownToggle}>
        Markdown <FontAwesome name="code" />
      </Button>
    );
  };

  renderEditButton = (isAuthenticated: boolean) => {
    if (!isAuthenticated) return null;

    return (
      <Button
        type="button"
        onClick={this.handleEdit}
        style={{ marginLeft: '10px' }}
      >
        Edit <FontAwesome name="edit" />
      </Button>
    );
  };

  renderSubmitButton = (data: WikiPageQuery, isAuthenticated: boolean) => {
    if (!isAuthenticated) return false;

    const editorTextState = this.getEditorText();
    const editorTextData =
      data.study && data.study.wikiPage && data.study.wikiPage.content;
    return (
      <UpdateContentMutation mutation={UPDATE_CONTENT_MUTATION}>
        {updateWikiContent => (
          <Button
            onClick={() => this.handleEditSubmit(updateWikiContent)}
            disabled={editorTextState === editorTextData}
            style={{ marginLeft: '10px' }}
          >
            Submit <FontAwesome name="pencil" />
          </Button>
        )}
      </UpdateContentMutation>
    );
  };

  renderToolbar = (data: WikiPageQuery, user: UserFragment | null) => {
    const isAuthenticated = user !== null;
    return (
      <Toolbar>
        <Switch>
          <Route
            path={this.editPath()}
            render={() => (
              <>
                {this.renderMarkdownButton()}{' '}
                <Button
                  type="button"
                  onClick={this.handlePreview}
                  style={{ marginLeft: '10px' }}
                >
                  Preview <FontAwesome name="photo" />
                </Button>
                {this.renderSubmitButton(data, isAuthenticated)}
              </>
            )}
          />
          <Route
            path={this.historyPath()}
            render={() => (
              <>
                {this.renderEditButton(isAuthenticated)}{' '}
                <Button
                  type="button"
                  onClick={this.handleView}
                  style={{ marginLeft: '10px' }}
                >
                  View <FontAwesome name="photo" />
                </Button>
              </>
            )}
          />

          <Route
            render={() => (
              <>
                <Button type="button" onClick={this.handleHistory}>
                  History <FontAwesome name="history" />
                </Button>
                {this.renderEditButton(isAuthenticated)}
                {this.renderSubmitButton(data, isAuthenticated)}
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
          'markdown',
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
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
        onCompleted={this.handleQueryCompleted}
      >
        {({ data, loading, error }) => {
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
                        <Edits
                          edits={
                            (data.study &&
                              data.study.wikiPage &&
                              data.study.wikiPage.edits) ||
                            []
                          }
                        />
                      )}
                    />
                    <Route render={() => this.renderEditor(data)} />
                  </Switch>
                  {this.renderToolbar(data, user)}
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
