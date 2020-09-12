import React, { useState } from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';
import { partition, toPairs } from 'ramda';
import { WikiPageQuery } from 'types/WikiPageQuery';
import {
  UPDATE_CONTENT_MUTATION,
} from 'mutations/WikiPageUpdateContentMutation';
import {
  WikiPageUpdateContentMutationVariables,
} from 'types/WikiPageUpdateContentMutation';
import styled from 'styled-components';
import { Panel, FormControl } from 'react-bootstrap';
import QUERY from 'queries/WikiPageQuery';
import { useQuery, useMutation } from 'react-apollo';
import { useSite } from 'containers/SiteProvider/SiteProvider';
import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import useUrlParams, {queryStringAll} from 'utils/UrlParamsProvider';
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import  { Switch, Route } from 'react-router';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import * as FontAwesome from 'react-fontawesome';
import { CurrentUserQuery_me } from 'types/CurrentUserQuery'

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
  const params = useUrlParams()
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<WikiPageQuery>(QUERY, {
    variables: { nctId },
  });
  const [updateContentMutation] = useMutation(UPDATE_CONTENT_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],

  });

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
  const handlePreview = () => {
    if (editorState === 'plain') {
      const text = getEditorText() || '';

      setEditorState('rich')
      setRichEditorText(RichTextEditor.createValueFromString(text, 'markdown'))

    }

    history.push(
      `${match.url}${queryStringAll(params)}`
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

  const handleMarkdownToggle = () => {
    const text = getEditorText() || '';
    const editorStateTemp = editorState === 'rich' ? 'plain' : 'rich';
    // this.setState({
    setEditorState(editorStateTemp)
    setplainEditorText(text)
    setRichEditorText(RichTextEditor.createValueFromString(text, 'markdown'))
    // });
  };

  const handleEdit = () => {
    history.push(
      `${trimPath(
        match.url
      )}/wiki/edit${queryStringAll(params)}`
    );
  };
  const handleHistory = () => {
    history.push(
      `${trimPath(
        match.url
      )}/wiki/history${queryStringAll(params)}`
    );
  };
  const handleView = () => {
    history.push(
      `${trimPath(match.url)}${queryStringAll(params)}`
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
  ) => {
    if (!isAuthenticated) return null;

    return (
      <ThemedButton
        type="button"
        onClick={() => handleEdit()}
        style={{ marginLeft: '10px' }}>
        Edit <FontAwesome name="edit" />
      </ThemedButton>
    );
  };
  const renderToolbar = (
    data: WikiPageQuery,
    user: CurrentUserQuery_me | null | undefined,
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
                  onClick={() => handlePreview()}
                  style={{ marginLeft: '10px' }}>
                  Preview <FontAwesome name="photo" />
                </ThemedButton>
                {renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
          <Route
            render={() => (
              <>
                {renderEditButton(isAuthenticated)}
                {renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
        </Switch>
      </Toolbar>
    );
  };


  const renderEditor = (data: WikiPageQuery) => {
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
            <Route render={() => renderEditor(studyData)} />
          </Switch>
          {renderToolbar(studyData, user, readOnly)}
        </div>
      </StyledPanel>
    </div>
  );
}
