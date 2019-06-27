import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Nav, NavItem, Row, Col, Button } from 'react-bootstrap';
import { Link, match, Route, Switch } from 'react-router-dom';
import { History, Location } from 'history';
import ReactStars from 'react-stars';
import * as FontAwesome from 'react-fontawesome';
import {
  last,
  split,
  pipe,
  findIndex,
  propEq,
  sortBy,
  prop,
  map,
  isEmpty,
  reject,
  drop,
  join,
  equals,
} from 'ramda';
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';
import {
  StudyPagePrefetchQuery,
  StudyPagePrefetchQueryVariables,
} from 'types/StudyPagePrefetchQuery';

import WikiPage from 'containers/WikiPage';
import CrowdPage from 'containers/CrowdPage';
import StudySummary from 'components/StudySummary';
import WikiToggle from 'components/WikiToggle';
import { Query } from 'react-apollo';
import { trimPath } from 'utils/helpers';
import ReviewsPage from 'containers/ReviewsPage';
import DescriptivePage from 'containers/DescriptivePage';
import AdministrativePage from 'containers/AdministrativePage';
import RecruitmentPage from 'containers/RecruitmentPage';
import InterventionsPage from 'containers/InterventionsPage';
import TrackingPage from 'containers/TrackingPage';
import FacilitiesPage from 'containers/FacilitiesPage';
import TagsPage from 'containers/TagsPage';
import WorkflowPage from 'containers/WorkflowPage';
import StudyPageCounter from './components/StudyPageCounter';
import { starColor } from 'utils/constants';
interface StudyPageProps {
  history: History;
  location: Location;
  match: match<{ nctId: string }>;
  prevLink?: string | null;
  nextLink?: string | null;
  firstLink?: string | null;
  lastLink?: string | null;
  isWorkflow?: boolean;
  recordsTotal?: number;
  counterIndex?: number;
}

interface StudyPageState {
  // trigger prefetch for all study sections
  triggerPrefetch: boolean;
  wikiToggleValue: boolean;
}

const QUERY = gql`
  query StudyPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      nctId
    }
  }

  ${StudySummary.fragment}
`;

// Prefetch all sections for study
const PREFETCH_QUERY = gql`
  query StudyPagePrefetchQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...WikiPageFragment
        ...CrowdPageFragment
        ...TagsPageFragment
      }
      descriptiveInfo {
        ...DescriptiveInfoFragment
      }
      administrativeInfo {
        ...AdministrativeInfoFragment
      }
      recruitmentInfo {
        ...RecruitmentInfoFragment
      }
      reviews {
        ...ReviewsPageFragment
      }
      interventions {
        ...InterventionItemFragment
      }
      trackingInfo {
        ...TrackingInfoFragment
      }
      facilities {
        ...FacilityFragment
      }
      nctId
    }
    me {
      id
      email
      firstName
      lastName
      defaultQueryString
    }
  }

  ${StudySummary.fragment}
  ${WikiPage.fragment}
  ${CrowdPage.fragment}
  ${DescriptivePage.fragment}
  ${ReviewsPage.fragment}
  ${AdministrativePage.fragment}
  ${RecruitmentPage.fragment}
  ${InterventionsPage.fragment}
  ${TrackingPage.fragment}
  ${FacilitiesPage.fragment}
  ${TagsPage.fragment}
`;

type Section = {
  name: string;
  path: string;
  order: number;
  component: React.Component;
};

const sections = [
  { name: 'Crowd', path: '/crowd', component: CrowdPage, order: 2 },
  { name: 'Workflow', path: '/workflow', component: WorkflowPage, order: 0 },
  { name: 'Reviews', path: '/reviews', component: ReviewsPage, order: 3 },
  {
    name: 'Descriptive',
    path: '/descriptive',
    component: DescriptivePage,
    order: 4,
  },
  {
    name: 'Administative',
    path: '/administrative',
    component: AdministrativePage,
    order: 5,
  },
  {
    name: 'Recruitment',
    path: '/recruitment',
    component: RecruitmentPage,
    order: 6,
  },
  {
    name: 'Interventions',
    path: '/interventions',
    component: InterventionsPage,
    order: 7,
  },
  { name: 'Tracking', path: '/tracking', component: TrackingPage, order: 8 },
  { name: 'Sites', path: '/sites', component: FacilitiesPage, order: 9 },
  { name: 'Tags', path: '/tags', component: TagsPage, order: 10 },
  { name: 'Wiki', path: '/', component: WikiPage, order: 1 },
];

const StudyWrapper = styled.div``;
const ReviewsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
`;

const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;

  .panel-heading {
    background: #8bb7a4;
    color: #fff;
    padding: 15px;
  }
`;

const SidebarContainer = styled(Col)`
  padding-right: 0px;
  color: rgba(255, 255, 255, 0.5);
  padding-top: 10px !important;

  li {
    a {
      font-size: 16px;
      color: #bac5d0;
      border-bottom: 1px solid #4c545e;
      text-align: left;
    }

    a:hover {
      background: #394149;
      border-radius: 0px;
      color: #fff;
    }
  }
`;

const BackButtonWrapper = styled.div`
  width:90%;
  margin:auto;
  padding: 5px;
  padding-bottom: 10px;
`;
class QueryComponent extends Query<StudyPageQuery, StudyPageQueryVariables> {}
class PrefetchQueryComponent extends Query<
  StudyPagePrefetchQuery,
  StudyPagePrefetchQueryVariables
> {}

class StudyPage extends React.Component<StudyPageProps, StudyPageState> {
  state: StudyPageState = {
    triggerPrefetch: false,
    wikiToggleValue: true,
  };

  getCurrentSectionPath = () => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), sections) >= 0) {
        return component;
      }
    }

    return '/';
  };

  getCurrentSectionFullPath = () => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), sections) >= 0) {
        const idx = findIndex(equals(component), pathComponents);
        return pipe(
          drop(idx),
          // @ts-ignore
          join(''),
        )(pathComponents);
      }
    }

    return '/';
  };

  getSections = (): Section[] =>
    pipe(
      reject(
        (section: Section) =>
          section.path === '/workflow' && !this.props.isWorkflow,
      ),
      // @ts-ignore
      sortBy(prop('order')),
      // @ts-ignore
    )(sections);

  handleSelect = (key: string) => {
    this.props.history.push(`${trimPath(this.props.match.url)}${key}`);
  };

  handleLoaded = () => {
    if (!this.state.triggerPrefetch) {
      this.setState({ triggerPrefetch: true });
    }
  };

  handleWikiToggleChange = () => {
    this.setState({ wikiToggleValue: !this.state.wikiToggleValue });
  };

  handleNavButtonClick = (link: string) => () => {
    this.props.history.push(
      `${trimPath(link)}${this.getCurrentSectionFullPath()}`,
    );
  };

  renderNavButton = (name: string, link?: string | null) => {
    if (link === undefined) return null;
    return (
      <Button
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={this.handleNavButtonClick(link!)}
        disabled={link === null}
      >{name}
      </Button>
    );
  };

  renderBackButton = (name: string, link?: string | null) => {
    if (link === undefined) return null;

    return (
      <Button
        style={{ margin: 'auto', width: '100%' }}
        onClick={this.handleNavButtonClick(link!)}
        disabled={link === null}
      >
        {name}
      </Button>
    );
  };

  renderReviewsSummary = (data: StudyPageQuery | undefined) => {
    if (!data || !data.study) return null;
    return (
      <ReviewsWrapper>
        <div>
          <ReactStars
            count={5}
            color2={starColor}
            edit={false}
            value={data.study.averageRating}
          />
          <div>{`${data.study.reviewsCount} Reviews`}</div>
        </div>
      </ReviewsWrapper>
    );
  };

  render() {
    return (
      <QueryComponent
        query={QUERY}
        variables={{ nctId: this.props.match.params.nctId }}
        fetchPolicy="cache-only"
      >
        {({ data, loading, error }) => (
          <StudyWrapper>
            <Row>

              <SidebarContainer md={2}>
                <BackButtonWrapper>
                {this.renderBackButton('⤺︎ Back', '/search')}
                </BackButtonWrapper>

                {this.renderReviewsSummary(data)}
                <WikiToggle
                  value={this.state.wikiToggleValue}
                  onChange={this.handleWikiToggleChange}
                />
                <Nav
                  bsStyle="pills"
                  stacked
                  activeKey={this.getCurrentSectionPath()}
                  onSelect={this.handleSelect}
                >
                  {this.getSections().map((section: Section) => (
                    <NavItem key={section.path} eventKey={section.path}>
                      {section.name}
                    </NavItem>
                  ))}
                </Nav>
              </SidebarContainer>
              <MainContainer md={10}>
                <div className="container">
                  <div id="navbuttonsonstudypage">{this.renderNavButton('❮❮ First', this.props.firstLink)}</div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('❮ Previous', this.props.prevLink)}</div>
                  <div id="navbuttonsonstudypage"><StudyPageCounter
                    counter = {this.props.counterIndex!}
                    recordsTotal={this.props.recordsTotal!}/></div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('Next ❯', this.props.nextLink)}</div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('Last ❯❯', this.props.lastLink)}</div>
                </div>

                {data && data.study && <StudySummary study={data.study} />}
                <div className="container">
                  <Switch>
                    {sections.map(section => (
                      <Route
                        key={section.path}
                        path={`${this.props.match.path}${section.path}`}
                        render={props => {
                          const Component = section.component;
                          return (
                            <Component
                              {...props}
                              onLoaded={this.handleLoaded}
                              isWorkflow={this.props.isWorkflow}
                              nextLink={this.props.nextLink}
                            />
                          );
                        }}
                      />
                    ))}
                  </Switch>
                </div>
                <div className="container">
                  <div id="navbuttonsonstudypage">{this.renderNavButton('❮❮ First', this.props.firstLink)}</div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('❮ Previous', this.props.prevLink)}</div>
                  <div id="navbuttonsonstudypage"><StudyPageCounter
                    counter = {this.props.counterIndex!}
                    recordsTotal={this.props.recordsTotal!}/></div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('Next ❯', this.props.nextLink)}</div>
                  <div id="navbuttonsonstudypage">{this.renderNavButton('Last ❯❯', this.props.lastLink)}</div>
                </div>
              </MainContainer>
            </Row>
            {this.state.triggerPrefetch && (
              <PrefetchQueryComponent
                query={PREFETCH_QUERY}
                variables={{ nctId: this.props.match.params.nctId }}
              >
                {() => null}
              </PrefetchQueryComponent>
            )}
          </StudyWrapper>
        )}
      </QueryComponent>
    );
  }
}

export default StudyPage;
