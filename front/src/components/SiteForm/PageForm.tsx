import React, { useEffect } from 'react';
import { FormControl, DropdownButton, MenuItem, Checkbox } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import { PageViewsQuery_site_pageViews } from 'services/study/model/PageViewsQuery';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import ThemedButton from 'components/StyledComponents/index';
import { studyIslands } from 'containers/Islands/CommonIslands'
import { updatePageView, deletePageView, updatePageViewHasura } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import { capitalize, camelCase } from '../../utils/helpers'
import Toast from 'components/Toast';
import HasuraMailMergeFormControl from 'components/MailMerge/HasuraMailMergeFormControl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from 'reducers';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;


// const ToastContainer = styled.div`
//   position: absolute;
//   bottom: 0;
//   left: 0;
//   width: 100%;
//   padding: 20px;
// `;

type Mode = "Study" | "Search";

interface Props {
  siteId: number;
  page: any;
}

function formControl(
  label: string,
  value: string,
  setValue: (s: string) => void
) {
  return (
    <StyledFormControl
      placeholder={label}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}
function checkboxHelper(
  isDefault: boolean,
  setValue: (b: boolean) => void
) {
  setValue(!isDefault)
}
export default function PageForm(props: Props) {
  const page = props.page;
  const default_nctid = 'NCT00004074';
  const default_hash = 'gELcp_Fb'

  const intToStringPageType = (pageType: number) => {
    switch (pageType) {
      case 1:
        return 'hasuraStudy';
      case 2:
        return 'search';
      default:
        return 'hasuraStudy';
    }

  }


  const [url, setUrl] = useState(page.url);
  const [title, setTitle] = useState(page.title);
  const [pageType, setPageType] = useState(intToStringPageType(page.page_type))
  const [template, setTemplate] = useState(page.template);
  const [isDefault, setDefault] = useState(page.default);
  const [mode, setMode] = useState(intToStringPageType(page.page_type));
  const theme = useTheme();
  let [nctOrSearchHash, setNctOrSearchHash] = useState(default_nctid);
  const pageViewSaveSuccessMessage = useSelector((state: RootState) => state.study.updatePageViewSuccessMessage);

  const stringToIntPageType = (pageType: any) => {
    if (pageType === 'hasuraStudy' || 1) return 1
    if (pageType === 'search' || 2) return 2
    else return 0
  }

  const dispatch = useDispatch();
  let input = { id: page.id, title, url, template, default: isDefault, pageType: stringToIntPageType(pageType) };

  const handleSavePageView = () => {
    dispatch(updatePageViewHasura(props.siteId, input))
  }

  useEffect(() => {
    if (pageViewSaveSuccessMessage) {
      toast(pageViewSaveSuccessMessage);
    }
  }, [pageViewSaveSuccessMessage]);
  const selectedMailMergeType =
    pageType === 'hasuraStudy' ?
      <HasuraMailMergeFormControl
        template={template}
        onTemplateChanged={setTemplate}
        islands={studyIslands}
      /> :

      <MailMergeFormControl
        template={template}
        onTemplateChanged={setTemplate}
        islands={studyIslands}
        pageType={capitalize(mode)}
      />
    ;

  const updateMode = mode => {
    setMode(mode);
    if (mode === 'Study') {
      setNctOrSearchHash(default_nctid);
    }
    if (mode === 'Search') {
      setNctOrSearchHash(default_hash);
    }
    if (mode === 'Hasura Study') {
      setNctOrSearchHash(default_hash);
    }

  };

  return (
    <div style={{ padding: '10px' }}>

      <ToastContainer />
      <label>Url</label>
      {formControl('Url', url, setUrl)}
      <label>Default?</label>
      <Checkbox
        checked={isDefault}
        onChange={() => checkboxHelper(isDefault, setDefault)}
      />
      <label>Page Type</label>
      <div>
        {/* 
        <DropdownButton
          bsStyle="default"
          title={dropDownTitle(pageType)}
          key="default"
          style={{
            marginBottom: '10px',
            background: theme?.button,
          }}>
          <MenuItem onClick={() => updatePageType('Hasura Study')}>Hasura Study</MenuItem>
          <MenuItem onClick={() => updatePageType('Study')}>Study</MenuItem>
        </DropdownButton>
        */}
        <DropdownButton
          bsStyle="default"
          title={`Type: ${capitalize(mode)}`}
          key={mode}
          style={{
            marginBottom: '10px',
            background: theme?.button,
          }}>
          {/* <MenuItem onClick={_ => updateMode("Study")}>Study</MenuItem> */}
          <MenuItem onClick={() => updateMode("Search")}>Search</MenuItem>
          <MenuItem onClick={() => updateMode("Hasura Study")}>Hasura Study</MenuItem>
        </DropdownButton>
        <FormControl
          placeholder="Select an nctid"
          value={nctOrSearchHash}
          onChange={e => setNctOrSearchHash(e.target.value || default_nctid)}
        />
      </div>

      <label>Title</label>
      {formControl('Title', title, setTitle)}
      <label>Content Template</label>

      {selectedMailMergeType}
      <hr />
      <ThemedButton
        onClick={_ => handleSavePageView()}
        style={{ margin: '10px' }}>
        Save '{url}'
      </ThemedButton>
      <ThemedButton
        onClick={_ => dispatch(deletePageView(page.id))}
        style={{ background: theme?.buttonDanger }}>
        Delete
      </ThemedButton>
    </div>
  );
}
