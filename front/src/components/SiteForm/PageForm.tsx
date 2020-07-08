import * as React from 'react';
import { FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import { PageViewsQuery_site_pageViews } from 'types/PageViewsQuery';
import { useUpdatePageView, useDeletePageView } from 'queries/PageViewQueries';
import MailMergeFormControl from 'components/MailMerge/MailMergeFormControl';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

interface Props {
  siteId: number;
  page: PageViewsQuery_site_pageViews;
}

export default function PageForm(props: Props) {
  const page = props.page;
  const [url, setUrl] = useState(page.url);
  const [] = useState(page.title);
  const [template, setTemplate] = useState(page.template);

  return (
    <div>
      <label>Url</label>
      <StyledFormControl
        placeholder="Url"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <MailMergeFormControl
        template={template}
        onTemplateChanged={setTemplate}
      />
    </div>
  );
}
