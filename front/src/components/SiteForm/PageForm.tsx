import * as React from 'react';
import { FormControl, DropdownButton, MenuItem, Checkbox } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import { PageViewsQuery_site_pageViews } from 'services/study/model/PageViewsQuery';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import ThemedButton from 'components/StyledComponents/index';
import { studyIslands } from 'containers/Islands/CommonIslands'
import { updatePageView, deletePageView  } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import {capitalize} from '../../utils/helpers'
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
  console.log("Paging Dr. ", page)
  const [url, setUrl] = useState(page.url);
  const [title, setTitle] = useState(page.title);
  const [template, setTemplate] = useState(page.template);
  const [isDefault, setDefault] = useState(page.default);
  const [mode, setMode] = useState(page.pageType);
  const theme = useTheme();
  let [nctOrSearchHash, setNctOrSearchHash] = useState(default_nctid);

  const dispatch = useDispatch();
  let input = { id: page.id, title, url, template, pageType: mode as string, default: isDefault };

  const updateMode = mode => {
    setMode(mode);
    if (mode === 'Study'){
      setNctOrSearchHash(default_nctid);
    }
    if (mode === 'Search'){
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
          title="Type: Study"
          key="default"
          disabled
          style={{
            marginBottom: '10px',
            background: theme?.button,
          }}>
          <MenuItem>Study</MenuItem>
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
      <MailMergeFormControl
        template={template}
        onTemplateChanged={setTemplate}
        islands={studyIslands}
        pageType={capitalize(mode)}
        // nctOrSearchHash={nctOrSearchHash}
        // setNctOrSearchHash={setNctOrSearchHash}


      />
      <hr />
      <ThemedButton
        onClick={_ => dispatch(updatePageView(input))}
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
