import React, { useState, useEffect, useContext } from 'react';
import RichTextEditor, { EditorValue } from 'react-rte-yt';
import { partition, toPairs } from 'ramda';
import { useWorkflowsView } from 'containers/WorkflowsViewProvider/WorkflowsViewProvider';
import { WikiPageQuery, WikiPageQueryVariables } from 'types/WikiPageQuery';
import {
  UPDATE_CONTENT_MUTATION,
  UpdateContentMutationFn,
} from 'mutations/WikiPageUpdateContentMutation';
import {
  WikiPageUpdateContentMutation,
  WikiPageUpdateContentMutationVariables,
} from 'types/WikiPageUpdateContentMutation';
import styled from 'styled-components';
import { Panel, FormControl } from 'react-bootstrap';
import QUERY from 'queries/WikiPageQuery';
import { useQuery, useMutation } from 'react-apollo';
import { useSite } from 'containers/SiteProvider/SiteProvider';
import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import useUrlParams from 'utils/UrlParamsProvider';
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import CrowdPage from 'containers/CrowdPage';
import { BeatLoader } from 'react-spinners';
import  { Switch, Route } from 'react-router';
import { UserFragment } from 'types/UserFragment';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import * as FontAwesome from 'react-fontawesome';
import ExpansionContext from '../WikiPage/ExpansionContext';
import Edits, { WikiPageEditFragment } from 'components/Edits';

interface Props {
  nctId: string;

}

const StyledPanel = styled(Panel)`
  padding: 16px;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;



export default function WikiPageIsland(props: Props) {
  const { nctId } = props;
  let history = useHistory();
  let location = useLocation();
  let match = useRouteMatch();
  const [historyExpanded, setHistoryExpanded] = useState({})
  const [editorState, setEditorState] = useState('rich')
  const [plainEditorText, setplainEditorText] = useState('')
  const [richEditorText, setRichEditorText] = useState('')

  const { currentSiteView } = useSite();
  const user = useCurrentUser()?.data?.me;

  console.log("Props", props)
  const hash = new URLSearchParams(history.location.search)
    .getAll('hash')
    .toString();
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<WikiPageQuery>(QUERY, {
    variables: { nctId },
  });
  const [updateContentMutation] = useMutation(UPDATE_CONTENT_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],

  });
  const siteViewUrl = new URLSearchParams(history.location.search)
    .getAll('sv')
    .toString();
  const readOnly = !location.pathname.includes('/wiki/edit');



  const editPath = () => `${trimPath(match.path)}/wiki/edit`;

  const historyPath = () => `${trimPath(match.path)}/wiki/history`;


  const getEditorText = () => {
    if (editorState === 'rich') {
      return (
        richEditorText &&
        //@ts-ignore
        richEditorText.toString('markdown')
      );
    }
    return plainEditorText;
  };
  const toggleEditVisibility = (editId: string) => value => {

    historyExpanded[editId] = value;
    setHistoryExpanded(historyExpanded);
  };
  const handlePreview = (hash: string, siteViewUrl: string) => {
    if (editorState === 'plain') {
      const text = getEditorText() || '';

      setEditorState('rich')
      setRichEditorText(RichTextEditor.createValueFromString(text, 'markdown'))

    }

    history.push(
      `${match.url}?hash=${hash}&sv=${siteViewUrl}`
    );
  };


  const handleRichEditorChange = (richEditorText: EditorValue) => {
    setRichEditorText(richEditorText);
  };
  const handlePlainEditorChange = (e: any) => {
    setplainEditorText(e.currentTarget.value);
  };

  const expandAllEdits = () => {
    Object.keys(historyExpanded).forEach(key => {
      historyExpanded[key] = true;
    });
    setHistoryExpanded(historyExpanded)
  };
  const minimizeAllEdits = () => {
    Object.keys(historyExpanded).forEach(key => {
      historyExpanded[key] = false;
    });
    setHistoryExpanded(historyExpanded)
  };
  const renderMarkdownButton = () => {
    if (editorState === 'plain') {
      return (
        <ThemedButton type="button" onClick={() => handleMarkdownToggle()}>
          Editor <FontAwesome name="newspaper-o" />
        </ThemedButton>
      );
    }
    return (
      <ThemedButton type="button" onClick={() => handleMarkdownToggle()}>
        Markdown <FontAwesome name="code" />
      </ThemedButton>
    );
  };
  console.log("Cehck 3")

  const handleMarkdownToggle = () => {
    const text = getEditorText() || '';
    const editorStateTemp = editorState === 'rich' ? 'plain' : 'rich';
    // this.setState({
    setEditorState(editorStateTemp)
    setplainEditorText(text)
    setRichEditorText(RichTextEditor.createValueFromString(text, 'markdown'))
    // });
  };

  const handleEdit = (hash: string, siteViewUrl: string) => {
    history.push(
      `${trimPath(
        match.url
      )}/wiki/edit?hash=${hash}&sv=${siteViewUrl}`
    );
  };
  const handleHistory = (hash: string, siteViewUrl: string) => {
    history.push(
      `${trimPath(
        match.url
      )}/wiki/history?hash=${hash}&sv=${siteViewUrl}`
    );
  };
  const handleView = (hash: string, siteViewUrl: string) => {
    history.push(
      `${trimPath(match.url)}?hash=${hash}&sv=${siteViewUrl}`
    );
  };
  const handleEditSubmit = (
    updateWikiContent: (vars: {
      variables: WikiPageUpdateContentMutationVariables;
    }) => void
  ) => {
    // this.props.showAnimation()
    updateWikiContent({
      variables: {
        nctId: nctId,
        content: getEditorText() || '',
      },
    });
  };
  console.log("Cehck 4")

  const renderSubmitButton = (data: WikiPageQuery, isAuthenticated: boolean, readOnly: boolean) => {
    if (!isAuthenticated) return false;
    if (readOnly) return false;
    const editorTextState = getEditorText();
    const editorTextData =
      data.study && data.study.wikiPage && data.study.wikiPage.content;

    return (

      <ThemedButton
        onClick={() => handleEditSubmit(updateContentMutation)}
        disabled={editorTextState === editorTextData}
        style={{ marginLeft: '10px' }}>
        Submit <FontAwesome name="pencil" />
      </ThemedButton>

    );
  };
  const renderEditButton = (
    isAuthenticated: boolean,
    hash: string,
    siteViewUrl: string
  ) => {
    if (!isAuthenticated) return null;

    return (
      <ThemedButton
        type="button"
        onClick={() => handleEdit(hash, siteViewUrl)}
        style={{ marginLeft: '10px' }}>
        Edit <FontAwesome name="edit" />
      </ThemedButton>
    );
  };
  const renderToolbar = (
    data: WikiPageQuery,
    //Type please
    user: any,
    hash: string,
    siteViewUrl: string,
    readOnly: boolean
  ) => {
    const isAuthenticated = user !== null;
    const [maximized, minimized] = partition(
      ([k, v]) => v,
      toPairs(historyExpanded)
    );

    return (
      <Toolbar>
        <Switch>
          <Route
            path={editPath()}
            render={() => (
              <>
                {renderMarkdownButton()}{' '}
                <ThemedButton
                  type="button"
                  onClick={() => handlePreview(hash, siteViewUrl)}
                  style={{ marginLeft: '10px' }}>
                  Preview <FontAwesome name="photo" />
                </ThemedButton>
                {renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
          {/* <Route
            path={historyPath()}
            render={() => (
              <>
                {minimized.length > 0 && (
                  <ThemedButton
                    type="button"
                    onClick={expandAllEdits}
                    style={{ marginLeft: '10px' }}>
                    Expand History <FontAwesome name="expand" />
                  </ThemedButton>
                )}
                {maximized.length > 0 && (
                  <ThemedButton
                    type="button"
                    onClick={minimizeAllEdits}
                    style={{ marginLeft: '10px' }}>
                    Minimize History <FontAwesome name="compress" />
                  </ThemedButton>
                )}
                {renderEditButton(isAuthenticated, hash, siteViewUrl)}{' '}
                <ThemedButton
                  type="button"
                  onClick={() => handleView(hash, siteViewUrl)}
                  style={{ marginLeft: '10px' }}>
                  View <FontAwesome name="photo" />
                </ThemedButton>
              </>
            )}
          /> */}

          <Route
            render={() => (
              <>
                {/* <ThemedButton
                  type="button"
                  onClick={() => handleHistory(hash, siteViewUrl)}>
                  History <FontAwesome name="history" />
                </ThemedButton> */}
                {renderEditButton(isAuthenticated, hash, siteViewUrl)}
                {renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
        </Switch>
      </Toolbar>
    );
  };


  const renderEditor = (data: WikiPageQuery) => {
    console.log("3Oh3", data)
    if (!data || !data.study || !data.study.wikiPage) return null;
    const text = getEditorText() || '';
    if (text !== data.study.wikiPage.content && !text) {
      if (editorState === 'rich') {
        const richEditorText = RichTextEditor.createValueFromString(
          data.study.wikiPage.content || '',
          'markdown'
        );
        setRichEditorText(richEditorText)
      } else {
        setplainEditorText(text)
      }
    }

    const readOnly = !location.pathname.includes('/wiki/edit');

    if (editorState === 'rich') {
      return (
        <Panel>
          <Panel.Body>
            <RichTextEditor
              readOnly={readOnly}
              onChange={handleRichEditorChange}
              value={
                richEditorText || RichTextEditor.createEmptyValue()
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
            defaultValue={plainEditorText || ''}
            onChange={handlePlainEditorChange}
          />
        </Panel.Body>
      </Panel>
    );
  };



  if (!studyData || !nctId) return <BeatLoader />;

  return (
    <div>
      <StyledPanel>
        <div>
          <Switch>
            {/* <Route
              path={historyPath()}
              render={() => (
                // <ExpansionContext.Provider
                //   value={{
                //     historyExpanded,
                //     toggleEditVisibility: toggleEditVisibility,
                //   }}>
                  <Edits
                    edits={
                      (studyData &&
                        studyData.study &&
                        //@ts-ignore
                        studyData.study.edits) ||
                      []
                    }
                  />
                // </ExpansionContext.Provider>
              )}
            /> */}
            <Route render={() => renderEditor(studyData)} />
          </Switch>
          {renderToolbar(studyData, user, hash, siteViewUrl, readOnly)}
        </div>
      </StyledPanel>
    </div>
  );
}
