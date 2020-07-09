import * as React from 'react';
import { FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import { PageViewsQuery_site_pageViews } from 'types/PageViewsQuery';
import { useUpdatePageView, useDeletePageView } from 'queries/PageViewQueries';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import ThemedButton from 'components/StyledComponents/index';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

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

export default function PageForm(props: Props) {
  const page = props.page;
  const [url, setUrl] = useState(page.url);
  const [title, setTitle] = useState(page.title);
  const [template, setTemplate] = useState(page.template);
  const savePage = useUpdatePageView(props.siteId);
  const deletePage = useDeletePageView(props.siteId);
  const theme = useTheme();

  return (
    <div style={{ padding: '10px' }}>
      <label>Url</label>
      {formControl('Url', url, setUrl)}
      <label>Page Type</label>
      <div>
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
      </div>
      <label>Title</label>
      {formControl('Title', title, setTitle)}
      <label>Content Template</label>
      <MailMergeFormControl
        template={template}
        onTemplateChanged={setTemplate}
      />
      <hr />
      <ThemedButton
        onClick={_ => savePage({ id: page.id, title, url, template })}
        style={{ margin: '10px' }}>
        Save '{url}'
      </ThemedButton>
      <ThemedButton
        onClick={_ => deletePage(page.id)}
        style={{ background: theme?.buttonDanger }}>
        Delete
      </ThemedButton>
    </div>
  );
}
