import React, { useState } from 'react';
import RichTextEditor, { EditorValue } from 'react-rte';
import { WikiPageQuery } from 'types/WikiPageQuery';
import { UPDATE_CONTENT_MUTATION } from 'mutations/WikiPageUpdateContentMutation';
import { WikiPageUpdateContentMutationVariables } from 'types/WikiPageUpdateContentMutation';
import styled from 'styled-components';
import { Panel, FormControl } from 'react-bootstrap';
import QUERY from 'queries/WikiPageQuery';
import { useQuery, useMutation } from 'react-apollo';
import CurrentUser, { useCurrentUser, QUERY as UserQuery } from 'containers/CurrentUser/CurrentUser';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { useHistory, useLocation, useRouteMatch, Prompt } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Switch, Route } from 'react-router';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import * as FontAwesome from 'react-fontawesome';
import WikiPageEditor from '../../components/WikiPageEditor/WikiPageEditor';
import WorkFlowAnimation from '../StudyPage/components/StarAnimation';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';

interface Props {
  nctId: string;
}

const StyledPanel = styled(Panel)`
  /* padding: 16px;
  border: none !important */
`;

const StyledRTE = styled(RichTextEditor)`
  border: none !important;
`
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
  const theme = useTheme();

  const [editorState, setEditorState] = useState('rich');
  const [plainEditorText, setplainEditorText] = useState('');
  const [richEditorText, setRichEditorText] = useState('');
  const [flashAnimation, setFlashAnimation] = useState(false);
  // const user = useCurrentUser()?.data?.me;
  const {data:user, refetch }= useQuery<CurrentUserQuery>(UserQuery)
  const params = useUrlParams();
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<WikiPageQuery>(QUERY, {
    variables: { nctId },
  });
  const [updateContentMutation] = useMutation(UPDATE_CONTENT_MUTATION, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  });

   const readOnly = !location.pathname.includes('/wiki/edit');
  const editPath = `${trimPath(match.path)}/wiki/edit`;

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

  const handlePreview = () => {
    if (editorState === 'plain') {
      const text = getEditorText() || '';
      setEditorState('rich');
      setRichEditorText(RichTextEditor.createValueFromString(text, 'markdown'));
    }

    history.push(`${match.url}${queryStringAll(params)}`);
  };

  const handleRichEditorChange = (richEditorText: EditorValue) => {
    setRichEditorText(richEditorText);
  };

  const handlePlainEditorChange = (e: any) => {
    setplainEditorText(e.currentTarget.value);
  };


  const handleEdit = () => {
    history.push(`${trimPath(match.url)}/wiki/edit${queryStringAll(params)}`);
  };
  const handleUpdateText =(text)=>{
    setRichEditorText(text)

  }
  const handleEditSubmit = (
    updateWikiContent: (vars: {
      variables: WikiPageUpdateContentMutationVariables;
    }) => void
  ) => {
    updateWikiContent({
      variables: {
        nctId: nctId,
        content: getEditorText() || '',
      },
    });
    history.push(`${match.url}${queryStringAll(params)}`);
    setFlashAnimation(true)
  };

  const renderSubmitButton = (
    data: WikiPageQuery,
    isAuthenticated: boolean,
    readOnly: boolean
  ) => {
    if (!isAuthenticated) return false;
    if (readOnly) return false;
    const editorTextState = getEditorText();
    const editorTextData =
      data.study && data.study.wikiPage && data.study.wikiPage.content;

    let editMessage = `Changes not saved. Are you sure you want to leave while editing?` ;

    return (
    <div>
      <Prompt
      when={!readOnly}
      message={location => editMessage}
      />
      <ThemedButton
        onClick={() => {editMessage = "Save changes?";  handleEditSubmit(updateContentMutation);}}
        disabled={editorTextState === editorTextData}
        style={{ marginLeft: '10px' }}>
        Save <FontAwesome name="pencil" />
      </ThemedButton>
    </div>
    );
  };

  const renderEditButton = (isAuthenticated: boolean) => {
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
    user: CurrentUserQuery | null | undefined,
    readOnly: boolean
  ) => {
    const isAuthenticated = user !== null;

    return (
      <Toolbar>
        <Switch>
          <Route
            path={editPath}
            render={() => (
              <>
                {renderSubmitButton(data, isAuthenticated, readOnly)}
              </>
            )}
          />
          <Route render={() => <>{renderEditButton(isAuthenticated)}</>} />
        </Switch>
      </Toolbar>
    );
  };
  const resetHelper = ()=>{
    setFlashAnimation(false)
    refetch()
  }
  const handleResetAnimation=()=>{
    setTimeout(  resetHelper, 6500);

  }
  const renderEditor = (data: WikiPageQuery) => {
    if (!data || !data.study || !data.study.wikiPage) return null;
    const text = getEditorText() || '';
    if (text !== data.study.wikiPage.content && !text) {
      if (editorState === 'rich') {
        const richEditorText = RichTextEditor.createValueFromString(
          data.study.wikiPage.content || '',
          'markdown'
        );
        setRichEditorText(richEditorText);
      } else {
        setplainEditorText(text);
      }
    }

    const readOnly = !location.pathname.includes('/wiki/edit');

    if (editorState === 'rich') {
      return (
        <Panel style={{border:"none", padding:"0px"}}>
          <Panel.Body >
            <StyledRTE
              readOnly={readOnly}
              onChange={handleRichEditorChange}
              value={richEditorText || RichTextEditor.createEmptyValue()}
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

  if (!studyData || !nctId || !user) return <BeatLoader />;

  return (
    <>
      {flashAnimation == true? 
      <WorkFlowAnimation
        resetAnimation={handleResetAnimation}
        rankColor={theme? theme.button: 'default'}
      /> :null}
    <div>
      <StyledPanel>
        <div>
        <Route exact path = {editPath} render={props=><WikiPageEditor updateText={handleUpdateText} data={studyData}/>}/>
        {readOnly? <Route render={ () => renderEditor(studyData)} />: null} 
          {renderToolbar(studyData, user, readOnly)}
        </div>
      </StyledPanel>
    </div>
    </>
  );
}
