import * as React from 'react';
import { SiteFragment } from 'services/site/model/SiteFragment';
import { FormControl, Row, Col, Nav, Panel, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import ThemedButton from 'components/StyledComponents/index';
import { PageViewsQuery_site_pageViews } from 'services/study/model/PageViewsQuery';
import { History, Location } from 'history';
import PageForm from './PageForm';
import { fetchPageViews, createPageView,  } from 'services/study/actions';
import { useDispatch, useSelector } from 'react-redux';
import {RootState} from 'reducers';
import { BeatLoader } from 'react-spinners';

const SectionForm = styled.div`
  padding: 15px 0 15px 15px;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 15px;
`;


interface AddPageProps {
  siteId: number;
  pageViews: PageViewsQuery_site_pageViews[];
}
function AddPage(props: AddPageProps) {
  const [pageUrl, setPageUrl] = useState('');

  const dispatch = useDispatch();

  const handleAdd = () => { 
    dispatch(createPageView(pageUrl, props.siteId))
    setPageUrl("")
  }

  const isDisabled = () => pageUrl === '' || pageUrl.indexOf('/') != -1;
  return (
    <SectionForm onSubmit={ _ => console.log("Add form submit")}>
      <StyledFormControl
        placeholder="New Page URL"
        value={pageUrl}
        onChange={e => setPageUrl(e.target.value)}
      />
      <ThemedButton
        onClick={_ => handleAdd()}
        disabled={isDisabled()}>
        Add
      </ThemedButton>
    </SectionForm>
  );
}

interface PageFormProps {
  history: History;
  location: Location;
  site: SiteFragment;
}
export default function PagesForm(props: PageFormProps) {
  let [activeKey, setActive] = useState(-1);

  const dispatch = useDispatch();
  const pageViewsData = useSelector((state:RootState) => state.study.pageViews);

  useEffect(()=>{
    dispatch(fetchPageViews(props.site?.id));
  },[dispatch]);

    if(!pageViewsData){
      return <BeatLoader />
    } 

  const pageViews =
    pageViewsData?.data?.site?.pageViews?.slice().sort((a, b) => a.url.localeCompare(b.url)) || [];
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
                /p/{page.url}
              </NavItem>
            ))}
          </Nav>
          <AddPage siteId={props.site.id} pageViews={pageViews} />
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
