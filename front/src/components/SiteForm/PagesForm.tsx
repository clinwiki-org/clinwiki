import * as React from 'react';
import { SiteFragment } from 'types/SiteFragment';
import { useQuery } from 'react-apollo';
import { FormControl, Row, Col, Nav, Panel, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import ThemedButton from 'components/StyledComponents/index';
import { PAGE_VIEW_QUERY, useCreatePageView } from 'queries/PageViewQueries';
import { PageViewsQuery } from 'types/PageViewsQuery';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import PageForm from './PageForm';

const SectionForm = styled.div`
  padding: 15px 0 15px 15px;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

interface AddPageProps {
  siteId: number;
}
function AddPage(props: AddPageProps) {
  const [pageUrl, setPageUrl] = useState('');
  const createPageView = useCreatePageView(props.siteId);
  return (
    <SectionForm onSubmit={_ => createPageView(pageUrl)}>
      <StyledFormControl
        placeholder="New Page URL"
        value={pageUrl}
        onChange={e => setPageUrl(e.target.value)}
      />
      <ThemedButton onClick={_ => createPageView(pageUrl)} enabled>
        Add
      </ThemedButton>
    </SectionForm>
  );
}

interface PageFormProps {
  history: History;
  location: Location;
  // match: match<{}>;
  site: SiteFragment;
}
export default function PagesForm(props: PageFormProps) {
  let [activeKey, setActive] = useState(-1);
  const { data, error } = useQuery<PageViewsQuery>(PAGE_VIEW_QUERY, {
    variables: { id: props.site.id },
  });
  if (error) console.log('Error: ', error);

  const pageViews =
    data?.site?.pageViews?.sort((a, b) => a.url.localeCompare(b.url)) || [];
  if (pageViews.length > 0 && activeKey == -1) {
    activeKey = pageViews[0].id;
  }
  const currentPageView = pageViews.filter(pv => pv.id === activeKey)?.[0];

  return (
    <div>
      <Row>
        <Col md={2}>
          <Nav
            bsStyle="pills"
            stacked
            activeKey={activeKey}
            onSelect={setActive}>
            {pageViews?.map(page => (
              <NavItem id={page.id} key={page.url} eventKey={page.id}>
                /{page.url}
              </NavItem>
            ))}
          </Nav>
          <AddPage siteId={props.site.id} />
        </Col>
        <Col md={10}>
          <Panel>
            {currentPageView ? (
              <PageForm
                key={currentPageView.id}
                page={currentPageView}
                siteId={props.site.id}
              />
            ) : null}
          </Panel>
        </Col>
      </Row>
    </div>
  );
}
