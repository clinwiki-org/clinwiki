import * as React from 'react';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import * as FontAwesome from 'react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import withTheme, { Theme } from 'containers/ThemeProvider/ThemeProvider';

interface StudyPageSectionProps {
  nctId: string;
  section: any;
  isWorkflow?: boolean;
  nextLink?: string | null;
  workflowName?: string | null;
  onLoad?: Function | null;
  workflowsView: WorkflowsViewFragment;
  history: History;
  location: Location;
  match: match<{ nctId: string; searchId: string }>;
  theme: Theme;
  siteView?: any;
}

interface StudyPageSectionsState {
  visible: boolean;
}

interface StyleWrapperProps {
  dropdown: boolean;
}

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

const StyleWrapper = styled.div`
  .panel-heading {
    cursor: pointer;
    ${(props: StyleWrapperProps) => (props.dropdown ? '' : '')}
  }
  .panel-toggle {
    margin-top: 2px;
  }
`;

const StyledPanelBody = styled.div`
  transition: all 0.2s ease-in;
  overflow: hidden;
  max-height: 0;
  &.transition-enter {
    max-height: 0;
  }
  &.transition-enter-active {
    max-height: 400px;
  }
  &.transition-enter-done {
    max-height: none;
  }
  &.transition-exit {
    max-height: 400px;
  }
  &.transition-exit-active {
    max-height: 0;
  }
  &.transition-exit-done {
    max-height: 0;
  }
`;

class StudyPageSection extends React.Component<
  StudyPageSectionProps,
  StudyPageSectionsState
> {
  constructor(props) {
    super(props);

    this.state = { visible: !(window.innerWidth <= 500) };
  }

  changeTab = () => {
    this.setState({ visible: !this.state.visible });
  };

  render() {
    return (
      <StyleWrapper dropdown={this.state.visible}>
        <Panel
          key={this.props.section.name}
          style={{
            background: 'none',
            border: 'none',
            borderRadius: '0',
            boxShadow: 'none',
          }}>
          <Panel.Heading
            style={{
              cursor: 'pointer',
              background: 'none',
              color: 'black',
              borderBottom: '2px solid',
              borderColor: this.props.theme.studyPage.sectionBorderColor,
            }}
            onClick={() => this.changeTab()}>
            <FontAwesome
              name={this.state.visible ? 'chevron-up' : 'chevron-down'}
              className="panel-toggle"
              style={{ float: 'left', paddingRight: '5px' }}
            />
            <Panel.Title componentClass="h3" style={{ fontSize: '18px' }}>
              {this.props.section.displayName}
            </Panel.Title>
          </Panel.Heading>
          <CSSTransition
            in={this.state.visible}
            timeout={200}
            appear
            classNames="transition">
            {() => {
              const Component = this.props.section.component;

              return (
                <StyledPanelBody>
                  <Panel.Body>
                    <Component
                      nctId={this.props.nctId}
                      workflowName={this.props.workflowName}
                      metaData={this.props.section.metaData}
                      onLoaded={this.props.onLoad}
                      isWorkflow={this.props.isWorkflow}
                      history={this.props.history}
                      match={this.props.match}
                      location={this.props.location}
                      theme={this.props.theme}
                      siteView={this.props?.siteView}
                    />
                  </Panel.Body>
                </StyledPanelBody>
              );
            }}
          </CSSTransition>
        </Panel>
      </StyleWrapper>
    );
  }
}

export default withTheme(StudyPageSection);
