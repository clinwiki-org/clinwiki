import * as React from 'react';
import { FormControl, DropdownButton, MenuItem, Checkbox } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import { PageViewsQuery_site_pageViews } from 'services/study/model/PageViewsQuery';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import ThemedButton from 'components/StyledComponents/index';
import { studyIslands } from 'containers/Islands/CommonIslands'
import { updatePageView, deletePageView } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import {capitalize} from '../../utils/helpers'
import HasuraMailMergeFormControl from 'components/MailMerge/HasuraMailMergeFormControl';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;
type Mode = "Study" | "Search";
interface Props {
  siteId: number;
  page: PageViewsQuery_site_pageViews;
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
  const default_hash ='gELcp_Fb'

  const [url, setUrl] = useState(page.url);
  const [title, setTitle] = useState(page.title);
  const [pageType, setPageType] = useState(page.pageType)
  const [template, setTemplate] = useState(page.template);
  const [isDefault, setDefault] = useState(page.default);
  const [mode, setMode] = useState(page.pageType);
  const theme = useTheme();
  let [nctOrSearchHash, setNctOrSearchHash] = useState(default_nctid);

  const dispatch = useDispatch();
  let input = { id: page.id, title, url, template, default: isDefault, pageType };


  const updatePageType = type => {
    if (type === 'Study') setPageType("study");
    if (type === 'Hasura Study') setPageType("hasuraStudy");
  };

  const dropDownTitle = type => {
    let title = ""
    if (type === 'study') { title = "Study" }
    if (type === 'hasuraStudy') { title = "Hasura Study" }
    return title;
  };

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
    if (mode === 'Study'){
      setPageType('study');
      setNctOrSearchHash(default_nctid);
    }
    if (mode === 'Search'){
      setPageType('search');
      setNctOrSearchHash(default_hash);
    }
    if (mode === 'Hasura Study'){
      setPageType('hasuraStudy');
      setNctOrSearchHash(default_hash);
    }

  };

  return (
    <div style={{ padding: '10px' }}>
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
          style={{ marginBottom: '10px',
          background: theme?.button,
        }}>
          <MenuItem onClick={_ => updateMode("Study")}>Study</MenuItem>
          <MenuItem onClick={_ => updateMode("Search")}>Search</MenuItem>
          <MenuItem onClick={_ => updateMode("Hasura Study")}>Hasura Study</MenuItem>
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
        onClick={_ => dispatch(updatePageView(props.siteId, input))}
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
