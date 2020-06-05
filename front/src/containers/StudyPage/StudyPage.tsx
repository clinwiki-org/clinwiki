import * as React from 'react';
import { gql } from 'apollo-boost';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  split,
  pipe,
  findIndex,
  propEq,
  sortBy,
  prop,
  map,
  isEmpty,
  reject,
  find,
} from 'ramda';
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';
import {
  StudyPagePrefetchQuery,
  StudyPagePrefetchQueryVariables,
} from 'types/StudyPagePrefetchQuery';
import StudyPageSections from './components/StudyPageSections';
import * as FontAwesome from 'react-fontawesome';
import WikiPage from 'containers/WikiPage';
import CrowdPage from 'containers/CrowdPage';
import StudySummary from 'components/StudySummary';
import { Query, QueryComponentOptions } from 'react-apollo';
import { trimPath } from 'utils/helpers';
import ReviewsPage from 'containers/ReviewsPage';
import InterventionsPage from 'containers/InterventionsPage';
import FacilitiesPage from 'containers/FacilitiesPage';
import TagsPage from 'containers/TagsPage';
import WorkflowPage from 'containers/WorkflowPage';
import SiteProvider from 'containers/SiteProvider';
import { SiteViewFragment } from 'types/SiteViewFragment';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import StudyPageCounter from './components/StudyPageCounter';
import withTheme from 'containers/ThemeProvider';
import GenericStudySectionPage from 'containers/GenericStudySectionPage';
import ThemedButton from 'components/StyledComponents';
import {
  WorkflowsViewFragment_workflows,
} from 'types/WorkflowsViewFragment';
import { UserFragment } from 'types/UserFragment';
import StudyPageHeader from './components/StudyPageHeader'

interface StudyPageProps {
  history: History;
  location: Location;
  match: match<{ nctId: string; searchId: string }>;
  prevLink?: string | null;
  nextLink?: string | null;
  firstLink?: string | null;
  lastLink?: string | null;
  isWorkflow?: boolean;
  workflowName: string | null;
  recordsTotal?: number;
  counterIndex?: number;
  theme?: any;
  refetch?:any;
  user?: UserFragment | null;
}

interface StudyPageState {
  // trigger prefetch for all study sections
  triggerPrefetch: boolean;
  flashAnimation:boolean;
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



const MainContainer = styled(Col)`
  background-color: #eaedf4;
  min-height: 100vh;
  padding-top: 20px;
  padding-bottom: 20px;

  .panel-heading {
    background: ${props => props.theme.studyPage.panelHeading};
    color: #fff;
    padding: 15px;
  }
`;

const StudyHeader = styled.div`
  display: flex;
  flex-direction: row;
  height: 90px;
  justify-content: center;
`;


const ThemedMainContainer = withTheme(MainContainer);


const StudySummaryContainer = styled.div`
  .container {
    div {
      .panel-default {
        background: none;
        border: none;
        borderradius: 0;
        boxshadow: none;

        .panel-heading {
          cursor: pointer;
          background: none;
          color: black;
          border-bottom: 2px solid;
          border-color: ${props => props.theme.studyPage.sectionBorderColor};
        }
      }
    }
  }
`;

const ThemedStudySummaryContainer = withTheme(StudySummaryContainer);



const QueryComponent = (
  props: QueryComponentOptions<StudyPageQuery, StudyPageQueryVariables>
) => Query(props);
const PrefetchQueryComponent = (
  props: QueryComponentOptions<
    StudyPagePrefetchQuery,
    StudyPagePrefetchQueryVariables
  >
) => Query(props);

class StudyPage extends React.Component<StudyPageProps, StudyPageState> {
  state: StudyPageState = {
    triggerPrefetch: false,
    flashAnimation:false,
    wikiToggleValue: true,
  };

  getCurrentSectionPath = (view: SiteViewFragment) => {
    const pathComponents = pipe(
      split('/'),
      reject(isEmpty),
      map(x => `/${x}`)
    )(trimPath(this.props.location.pathname)) as string[];

    for (const component of pathComponents) {
      if (findIndex(propEq('path', component), this.getSections(view)) >= 0) {
        return component;
      }
    }

    return '/';
  };
  //I believe this may be deprecated now that we are using URLSearchParams
  // getCurrentSectionFullPath = (view: SiteViewFragment) => {
  //   const pathComponents = pipe(
  //     split('/'),
  //     reject(isEmpty),
  //     map(x => `/${x}`)
  //   )(trimPath(this.props.location.pathname)) as string[];

  //   for (const component of pathComponents) {
  //     if (findIndex(propEq('path', component), this.getSections(view)) >= 0) {
  //       const idx = findIndex(equals(component), pathComponents);
  //       return pipe(
  //         drop(idx),
  //         // @ts-ignore
  //         join('')
  //       )(pathComponents);
  //     }
  //   }

  //   return '/';
  // };

  getSectionsForRoutes = (view: SiteViewFragment): Section[] => {
    const sections = this.getSections(view);
    const noWikiSections = reject(propEq('name', 'wiki'), sections);
    const wiki = find(propEq('name', 'wiki'), sections) as Section;

    const retVar =
      !wiki || wiki.hidden
        ? noWikiSections
        : ([...noWikiSections, wiki] as Section[]);

    console.log('getSectionsForRoutes: ');
    console.log(retVar);

    return retVar as Section[];
  };

  getComponent = (name: string): any => {
    switch (name) {
      case 'wiki':
        return WikiPage;
      case 'crowd':
        return CrowdPage;
      case 'reviews':
        return ReviewsPage;
      case 'facilities':
        return FacilitiesPage;
      case 'tags':
        return TagsPage;
      case 'interventions':
        return InterventionsPage;
      default:
        return GenericStudySectionPage;
    }
  };

  getSections = (view: SiteViewFragment): Section[] => {
    const {
      basicSections: basicSectionsRaw,
      extendedSections: extendedSectionsRaw,
    } = view.study;
    console.log('STUDY', view.study);
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
      // {
      //   name: 'intervention',
      //   path: '/intervention?sv=intervention',
      //   displayName: 'Intervention',
      //   kind: 'basic',
      //   component: InterventionPage,
      //   hidden: !this.props.isWorkflow,
      //   metaData: { hide: !this.props.isWorkflow },
      // },
      ...basicSectionsRaw.map(section => ({
        name: section.title.toLowerCase(),
        path:
          section.title.toLowerCase() === 'wiki'
            ? '/'
            : `/${section.title.toLowerCase()}`,
        displayName: section.title,
        kind: 'basic',
        component: this.getComponent(section.title.toLowerCase()),
        hidden: section.hide,
        metaData: section,
      })),
    ];

    const extendedSections = extendedSectionsRaw.map(section => {
      return {
        name: section.title.toLowerCase(),
        path: `/${section.title.toLowerCase()}`,
        displayName: section.title,
        kind: 'extended',
        order: section.order,
        component: this.getComponent(section.title.toLowerCase()),
        hidden: section.hide,
        metaData: section,
      };
    });

    const processedExtendedSections = sortBy(
      pipe(prop('order'), parseInt),
      extendedSections
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

  handleNavButtonClick = (link: string) => () => {
    this.props.history.push(`${trimPath(link)}`);
  };
  resetHelperFunction = () => {
    this.setState({ flashAnimation: false })
    this.props.refetch()
  }
  handleShowAnimation=()=>{
    this.setState({flashAnimation: true})
  }
  handleResetAnimation = () => {
    setTimeout(this.resetHelperFunction, 6500)
  }
  renderNavButton = (name: string, link?: string | null) => {
    if (link === undefined) return null;

    return (
      <ThemedButton
        style={{ marginRight: 10, marginBottom: 10 }}
        onClick={this.handleNavButtonClick(link!)}
        disabled={link === null}>
        {name}
      </ThemedButton>
    );
  };




  render() {

    return (
      <SiteProvider>
        {(site, currentSiteView) => (
          <WorkflowsViewProvider>
            {workflowsView => {
              const workflow = pipe(
                find<WorkflowsViewFragment_workflows>(
                  propEq('name', this.props.workflowName)
                )
              )(workflowsView.workflows) as WorkflowConfigFragment | null;

              return (
                <QueryComponent
                  query={QUERY}
                  variables={{ nctId: this.props.match.params.nctId }}
                  fetchPolicy="cache-only">
                  {({ data, loading, error }) => (
                    <div>
                      <StudyHeader
                        style={{
                          background: this.props.theme.studyPage
                            .studyPageHeader,
                        }}>
                          <StudyPageHeader
                          navButtonClick={this.handleNavButtonClick}
                          history={this.props.history}
                          user={this.props.user}
                          data={data?.study}
                          theme={this.props.theme}
                          nctId={this.props.match.params.nctId}
                          />
                      </StudyHeader>

                      <Row>
                        <ThemedMainContainer md={12}>
                          <div className="container">
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                '❮❮ First',
                                this.props.firstLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                '❮ Previous',
                                this.props.prevLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              <StudyPageCounter
                                counter={this.props.counterIndex!}
                                recordsTotal={this.props.recordsTotal!}
                              />
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                'Next ❯',
                                this.props.nextLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                'Last ❯❯',
                                this.props.lastLink
                              )}
                            </div>
                          </div>

                          {data && data.study && (
                            <ThemedStudySummaryContainer>
                              <StudySummary
                                study={data.study}
                                workflow={workflow}
                                workflowsView={workflowsView}
                              />
                            </ThemedStudySummaryContainer>
                          )}

                          <div className="container">
                            <StudyPageSections
                              history={this.props.history}
                              location={this.props.location}
                              nctId={this.props.match.params.nctId}
                              sections={this.getSections(site.siteView)}
                              isWorkflow={this.props.isWorkflow}
                              nextLink={this.props.nextLink}
                              workflowName={this.props.workflowName}
                              onLoad={this.handleLoaded}
                              workflowsView={workflowsView}
                              match={this.props.match}
                              siteView={currentSiteView}
                              showAnimation={this.handleShowAnimation}
                            />
                          </div>

                          <div className="container">
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                '❮❮ First',
                                this.props.firstLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                '❮ Previous',
                                this.props.prevLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              <StudyPageCounter
                                counter={this.props.counterIndex!}
                                recordsTotal={this.props.recordsTotal!}
                              />
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                'Next ❯',
                                this.props.nextLink
                              )}
                            </div>
                            <div id="navbuttonsonstudypage">
                              {this.renderNavButton(
                                'Last ❯❯',
                                this.props.lastLink
                              )}
                            </div>
                          </div>
                        </ThemedMainContainer>
                      </Row>
                      {this.state.triggerPrefetch && (
                        <PrefetchQueryComponent
                          query={PREFETCH_QUERY}
                          variables={{ nctId: this.props.match.params.nctId }}>
                          {() => null}
                        </PrefetchQueryComponent>
                      )}
                    </div>
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

export default withTheme(StudyPage);
