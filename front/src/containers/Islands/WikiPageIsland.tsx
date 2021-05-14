import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'reducers';
import RichTextEditor, { EditorValue } from 'react-rte';
import { WikiPageQuery } from 'types/WikiPageQuery';
import styled from 'styled-components';
import { Panel, FormControl } from 'react-bootstrap';
import useUrlParams, { queryStringAll } from 'utils/UrlParamsProvider';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import { Switch, Route } from 'react-router';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents/index';
import * as FontAwesome from 'react-fontawesome';
import WikiPageEditor from '../../components/WikiPageEditor/WikiPageEditor';
import WorkFlowAnimation from '../StudyPage/components/StarAnimation';
import { CurrentUserQuery_me } from 'services/user/model/CurrentUserQuery';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import LoginModal from '../../components/LoginModal';
import { wikiPageUpdateContentMutation, fetchWikiPage, fetchHasuraWikiPage, wikiPageUpdateHasuraMutation } from 'services/study/actions';

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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isWikiContent, setIsWikiContent] = useState(false)
  const [isEditing, setIsEditing] = useState(false);

  const user = useSelector((state: RootState) => state.user.current);
  const params = useUrlParams();
  //const user = userData ? userData.me : null;
  // TODO: This query should be pushed up as a fragment to the Page
  const dispatch = useDispatch();
  useEffect(() => {
    //dispatch(fetchWikiPage(nctId));
    dispatch(fetchHasuraWikiPage(nctId));
  }, [dispatch, nctId])
  //const wikiPageData = useSelector((state: RootState) => state.study.wikiPage);

  const wikiPageData = useSelector((state: RootState) => state.study.hasuraWikiPage);
  // if (!wikiPageData || !wikiPageData.wiki_pages[0] || !wikiPageData.wiki_pages[0].text) {
  //  setIsWikiContent(false)
  // }


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
    // history.push(`${trimPath(match.url)}/wiki/edit${queryStringAll(params)}`);
    setIsEditing(true)
  };
  const handleUpdateText = (text) => {
    setRichEditorText(text)

  }
  const handleEditSubmit = () => {
    //@ts-ignore
    let content = getEditorText() || wikiPageData.data.wiki_pages[0].text

    dispatch(wikiPageUpdateHasuraMutation(nctId, content, isWikiContent));
    setIsEditing(false)
    // history.push(`${match.url}${queryStringAll(params)}`);
    setFlashAnimation(true)
  };

  const handleCancelEdit = () => {
    history.push(`${match.url}${queryStringAll(params)}`);
  };

  const renderToolbar = (

    data: WikiPageQuery,
    //@ts-ignore
    user: CurrentUserQuery_me | null | undefined,
    isEditing: boolean
  ) => {
    const isAuthenticated = user !== null;
    if (!isAuthenticated) return false;
    const editorTextState = getEditorText();
    // const editorTextData =
    //   data && data.wiki_pages[0] && data.wiki_pages[0].text // data.study && data.study.wikiPage && data.study.wikiPage.content;

    let editMessage = `Changes not saved. Are you sure you want to leave while editing?`;
    return (
      <Toolbar>
        {isEditing ?
          <div>
            <ThemedButton
              onClick={() => { editMessage = "Save changes?"; handleCancelEdit(); }}
              style={{ marginLeft: '10px', background: 'white', color: '#6BA5D6', border: "1px solid #6BA5D6" }}>
              Cancel <FontAwesome name="X" />
            </ThemedButton>
            <ThemedButton
              onClick={() => { editMessage = "Save changes?"; handleEditSubmit(); }}
              // disabled={editorTextState === editorTextData}
              style={{ marginLeft: '10px' }}>
              Save <FontAwesome name="pencil" />
            </ThemedButton>
          </div> :
          <div>
            <ThemedButton
              type="button"
              onClick={isAuthenticated ? () => handleEdit() : () => setShowLoginModal(true)}
              style={{ marginLeft: '10px' }}>
              Edit <FontAwesome name="edit" />
            </ThemedButton>
          </div>
        }



      </Toolbar>
    );
  };
  const resetHelper = () => {
    setFlashAnimation(false)
    //refetch()
  }
  const handleResetAnimation = () => {
    setTimeout(resetHelper, 6500);

  }

  const renderEditor = (data: any) => {
    if (!data || !data.wiki_pages[0] || !data.wiki_pages[0].text) {
      return "No Wiki Content"; //(!data || !data.study || !data.study.wikiPage) return null;
    }
    const text = getEditorText() || '';
    //console.log("🚀 ~ renderEditor ~ TEXT", text);

    if (text !== data.wiki_pages[0].text || !text) {
      //handlePreview()

      if (data.wiki_pages[0].text) {
        setIsWikiContent(true);
      }

      if (editorState === 'rich') {
        const richEditorText = RichTextEditor.createValueFromString(
          data.wiki_pages[0].text || '',
          'markdown'
        );
        setRichEditorText(richEditorText);
      } else {
        setplainEditorText(text);
      }
    }
    // const readOnly = !location.pathname.includes('/wiki/edit');

    if (editorState === 'rich') {
      //console.log("RICH E TEXZ", richEditorText)
      return (
        <Panel style={{ border: "none", padding: "0px" }}>
          <Panel.Body >
            <StyledRTE
              readOnly={!isEditing}
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

  if (!wikiPageData || !nctId) return <BeatLoader />;

  //console.log("🚀 ~ WikiPageIsland ~ wikiPageData", wikiPageData);

  if (showLoginModal) return <LoginModal
    show={showLoginModal}
    cancel={() => setShowLoginModal(false)}
  />
  return (
    <>
      {flashAnimation == true ?

        <WorkFlowAnimation
          resetAnimation={handleResetAnimation}
          rankColor={theme ? theme.button : 'default'}
        /> : null}
      <div>
        <StyledPanel>
          <div>
            {isEditing ? <WikiPageEditor updateText={handleUpdateText} data={wikiPageData.data} /> : renderEditor(wikiPageData.data)}
            {/* {readOnly ? renderEditor(wikiPageData.data)} : null} */}
            {renderToolbar(wikiPageData.data, user, isEditing)}
          </div>
        </StyledPanel>
      </div>
    </>
  );
}
