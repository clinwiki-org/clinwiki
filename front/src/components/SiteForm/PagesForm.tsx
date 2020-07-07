import * as React from 'react';
import { SiteFragment } from 'types/SiteFragment';
import { useQuery, useMutation } from 'react-apollo';
import { FormControl, Row, Col, Nav, Panel, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { useState } from 'react';
import ThemedButton from 'components/StyledComponents/index';
import {
  PAGE_VIEW_QUERY,
  CREATE_PAGE_VIEW_MUTATION,
} from 'queries/PageViewQueries';
import { PageViewsQuery } from 'types/PageViewsQuery';
import { match } from 'react-router-dom';
import { History, Location } from 'history';

interface PageFormProps {
  history: History;
  location: Location;
  // match: match<{}>;
  site: SiteFragment;
}

const SectionForm = styled.div`
  padding: 15px 0 15px 15px;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;

const FormContainer = styled(Panel)`
  padding: 15px;
  min-height: 420px;
`;

function AddPage(props: { siteId: number }) {
  const [pageUrl, setPageUrl] = useState('');
  const [createPageView] = useMutation(CREATE_PAGE_VIEW_MUTATION);
  return (
    <SectionForm>
      <StyledFormControl
        placeholder="New Page URL"
        value={pageUrl}
        onChange={e => setPageUrl(e.target.value)}
      />
      <ThemedButton
        onClick={_ =>
          createPageView({ variables: { url: pageUrl, siteId: props.siteId } })
        }
        enabled>
        Add
      </ThemedButton>
    </SectionForm>
  );
}

export default function PagesForm(props: PageFormProps) {
  const [activeKey, setActive] = useState('');
  const { data, error } = useQuery<PageViewsQuery>(PAGE_VIEW_QUERY, {
    variables: { id: props.site.id },
  });
  if (error) console.log('Error: ', error);

  return (
    <div>
      <Row>
        <Col md={2}>
          <Nav
            bsStyle="pills"
            stacked
            activeKey={activeKey}
            onSelect={setActive}>
            {data?.site?.pageViews?.map(page => (
              <NavItem key={page.url} eventKey={page.id}> page.url </NavItem>
            ))}
          </Nav>
          <AddPage siteId={props.site.id} />
        </Col>
        <Col md={10}>
          <FormContainer>wangs</FormContainer>
        </Col>
      </Row>
    </div>
  );
}
