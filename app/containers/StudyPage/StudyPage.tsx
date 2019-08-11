import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Nav, NavItem, Row, Col, Button } from 'react-bootstrap';
import { Link, match, Route, Switch, Redirect } from 'react-router-dom';
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
  find,
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
import InterventionsPage from 'containers/InterventionsPage';
import FacilitiesPage from 'containers/FacilitiesPage';
import TagsPage from 'containers/TagsPage';
import WorkflowPage from 'containers/WorkflowPage';
import SiteProvider from 'containers/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';
import SitesPage from 'containers/SitesPage';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { starColor } from 'utils/constants';
import StudyPageCounter from './components/StudyPageCounter';
import GenericStudySectionPage from 'containers/GenericStudySectionPage';
import {PulseLoader, ScaleLoader} from 'react-spinners';

interface StudyPageProps {
  history: History;
  location: Location;
  match: match<{ nctId: string, searchId: string }>;
  prevLink?: string | null;
  nextLink?: string | null;
  firstLink?: string | null;
  lastLink?: string | null;
  isWorkflow?: boolean;
  workflowName: string | null;
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
      reviews {
        ...ReviewsPageFragment
      }
      interventions {
        ...InterventionItemFragment
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
  ${ReviewsPage.fragment}
  ${InterventionsPage.fragment}
  ${FacilitiesPage.fragment}
  ${TagsPage.fragment}
`;

type Section = {
  name: string;
  displayName: string;
  path: string;
  order?: number | null;
  kind: 'basic' | 'extended';
  hidden: boolean;
  component: React.Component;
  metaData:
    | SiteStudyBasicGenericSectionFragment
    | SiteStudyExtendedGenericSectionFragment;
};

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
  width: 90%;
  margin: auto;
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

  getCurrentSectionPath = (view: SiteViewFragment) => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), this.getSections(view)) >= 0) {
        return component;
      }
    }

    return '/';
  };

  getCurrentSectionFullPath = (view: SiteViewFragment) => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`),
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), this.getSections(view)) >= 0) {
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

  getSectionsForRoutes = (view: SiteViewFragment): Section[] => {
    const sections = this.getSections(view);
    const noWikiSections = reject(propEq('name', 'wiki'), sections);
    const wiki = find(propEq('name', 'wiki'), sections);
    // @ts-ignore
    return !wiki || wiki.hidden
      ? noWikiSections
      : ([...noWikiSections, wiki] as Section[]);
  };

  getSections = (view: SiteViewFragment): Section[] => {
    const {
      administrative,
      crowd,
      descriptive,
      facilities,
      interventions,
      recruitment,
      reviews,
      tags,
      tracking,
      wiki,
    } = view.study;
    const basicSections = [
      {
        name: 'workflow',
        path: '/workflow',
        displayName: 'Workflow',
        kind: 'basic',
        component: WorkflowPage,
        hidden: !this.props.isWorkflow,
        metaData: { hide: !this.props.isWorkflow },
      },
      {
        name: 'wiki',
        path: '/',
        displayName: 'Wiki',
        kind: 'basic',
        component: WikiPage,
        hidden: wiki.hide,
        metaData: wiki,
      },
      {
        name: 'crowd',
        path: '/crowd',
        displayName: 'Crowd',
        kind: 'basic',
        component: CrowdPage,
        hidden: crowd.hide,
        metaData: crowd,
      },
      {
        name: 'reviews',
        path: '/reviews',
        displayName: 'Reviews',
        kind: 'basic',
        component: ReviewsPage,
        hidden: reviews.hide,
        metaData: reviews,
      },
      {
        name: 'facilities',
        path: '/sites',
        displayName: 'Sites',
        kind: 'basic',
        component: FacilitiesPage,
        hidden: facilities.hide,
        metaData: facilities,
      },
      {
        name: 'tags',
        path: '/tags',
        displayName: 'Tags',
        kind: 'basic',
        component: TagsPage,
        hidden: tags.hide,
        metaData: tags,
      },
    ];

    const extendedSections = [
      {
        name: 'descriptive',
        path: '/descriptive',
        displayName: descriptive.title,
        kind: 'extended',
        order: descriptive.order,
        component: GenericStudySectionPage,
        hidden: descriptive.hide,
        metaData: descriptive,
      },

      {
        name: 'administrative',
        path: '/administrative',
        displayName: administrative.title,
        kind: 'extended',
        order: administrative.order,
        component: GenericStudySectionPage,
        hidden: administrative.hide,
        metaData: administrative,
      },
      {
        name: 'recruitment',
        path: '/recruitment',
        displayName: recruitment.title,
        kind: 'extended',
        order: recruitment.order,
        component: GenericStudySectionPage,
        hidden: recruitment.hide,
        metaData: recruitment,
      },
      {
        name: 'interventions',
        path: '/interventions',
        displayName: interventions.title,
        kind: 'extended',
        order: interventions.order,
        component: InterventionsPage,
        hidden: interventions.hide,
        metaData: interventions,
      },
      {
        name: 'tracking',
        path: '/tracking',
        displayName: tracking.title,
        kind: 'extended',
        order: tracking.order,
        component: GenericStudySectionPage,
        hidden: tracking.hide,
        metaData: tracking,
      },
    ];
    // @ts-ignore
    const processedExtendedSections = sortBy(
      pipe(
        prop('order'),
        parseInt,
      ),
      extendedSections,
    );
    const res = [...basicSections, ...processedExtendedSections] as Section[];

    return reject(propEq('hidden', true), res) as Section[];
  };

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

  handleNavButtonClick = (link: string, view: SiteViewFragment) => () => {
    this.props.history.push(
      `${trimPath(link)}${this.getCurrentSectionFullPath(view)}`,
    );
  };

  renderNavButton = (
    view: SiteViewFragment,
    name: string,
    link?: string | null,
  ) => {
    if (link === undefined) return null;

    return (
      <Button
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={this.handleNavButtonClick(link!, view)}
        disabled={link === null}
      >
        {name}
      </Button>
    );
  };

  renderBackButton = (
    view: SiteViewFragment,
    name: string,
    link?: string | null,
  ) => {
    if (link === undefined) return null;

    return (
      <Button
        style={{ margin: 'auto', width: '100%' }}
        onClick={this.handleNavButtonClick(link!, view)}
        disabled={link === null}
      >
        {name}
      </Button>
    );
  };

  renderReviewsSummary = (data: StudyPageQuery | undefined) => {
    if (!data || !data.study) {
      return <ReviewsWrapper>
        <div>
          <ReactStars
            count={5}
            color2={starColor}
            edit={false}
            value={0}
          />
          <div>{'0 Reviews'}</div>
        </div>
      </ReviewsWrapper>;
    }

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
      <SiteProvider>
        {site => (
          <WorkflowsViewProvider>
            {workflowsView => {
              const workflow = pipe(
                prop('workflows'),
                find(propEq('name', this.props.workflowName)),
              )(workflowsView) as WorkflowConfigFragment | null;

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
                            {this.renderBackButton(
                              site.siteView,
                              '⤺︎ Back',
                              `/search/${this.props.match.params.searchId}`,
                            )}
                          </BackButtonWrapper>

                          {this.renderReviewsSummary(data)}
                          <WikiToggle
                            value={this.state.wikiToggleValue}
                            onChange={this.handleWikiToggleChange}
                          />
                          <Nav
                            bsStyle="pills"
                            stacked
                            activeKey={this.getCurrentSectionPath(
                              site.siteView,
                            )}
                            onSelect={this.handleSelect}
                          >
                            {this.getSections(site.siteView).map(
                              (section: Section) => (
                                <NavItem
                                  key={section.path}
                                  eventKey={section.path}
                                >
                                  {section.displayName}
                                </NavItem>
                              ),
                            )}
                          </Nav>
                        </SidebarContainer>
                        <MainContainer md={10}>
                          <div className="container">
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, '❮❮ First', this.props.firstLink)}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, '❮ Previous', this.props.prevLink)}
                            </div>
                            <div id="navbuttonsonstudypage"><StudyPageCounter
                              counter = {this.props.counterIndex!}
                              recordsTotal={this.props.recordsTotal!}/>
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, 'Next ❯', this.props.nextLink)}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, 'Last ❯❯', this.props.lastLink)}
                            </div>
                          </div>

                          {data && data.study && (
                            <StudySummary
                              study={data.study}
                              workflow={workflow}
                              workflowsView={workflowsView}
                            />
                          )}
                          <div className="container">
                            <Switch>
                              {this.getSectionsForRoutes(site.siteView).map(
                                section =>
                                  section ? (
                                    <Route
                                      key={section.path}
                                      path={`${this.props.match.path}${
                                        section.path
                                      }`}
                                      render={props => {
                                        const Component = section.component;

                                        return (
                                          // @ts-ignore
                                          <Component
                                            {...props}
                                            workflowName={
                                              this.props.workflowName
                                            }
                                            metaData={section.metaData}
                                            onLoaded={this.handleLoaded}
                                            isWorkflow={this.props.isWorkflow}
                                            nextLink={this.props.nextLink}
                                            workflowsView={workflowsView}
                                          />
                                        );
                                      }}
                                    />
                                  ) : null,
                              )}
                              {!this.props.isWorkflow && (
                                <Redirect
                                  to={`${this.props.match.url}${
                                    this.getSectionsForRoutes(site.siteView)[0]
                                      .path
                                  }`}
                                />
                              )}
                            </Switch>
                          </div>
                          <div className="container">
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, '❮❮ First', this.props.firstLink)}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, '❮ Previous', this.props.prevLink)}
                            </div>
                            <div id="navbuttonsonstudypage"><StudyPageCounter
                              counter = {this.props.counterIndex!}
                              recordsTotal={this.props.recordsTotal!}/>
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, 'Next ❯', this.props.nextLink)}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(site.siteView, 'Last ❯❯', this.props.lastLink)}
                            </div>
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
            }}
          </WorkflowsViewProvider>
        )}
      </SiteProvider>
    );
  }
}

export default StudyPage;
