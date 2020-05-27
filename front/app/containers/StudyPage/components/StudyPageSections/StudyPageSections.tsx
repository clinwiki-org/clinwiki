import * as React from 'react';
import StudyPageSection from './StudyPageSection';
import { match } from 'react-router-dom';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { History, Location } from 'history';
import { UserFragment } from 'types/UserFragment';

interface StudyPageSectionsProps {
  nctId: string;
  sections: any;
  isWorkflow?: boolean;
  nextLink?: string | null;
  workflowName?: string | null;
  onLoad?: Function | null;
  workflowsView: WorkflowsViewFragment;
  history: History;
  location: Location;
  match: match<{ nctId: string; searchId: string }>;
  siteView: any;
  refetch?:any;
  user?: UserFragment| null;
}

class StudyPageSections extends React.Component<StudyPageSectionsProps> {
  render() {
    const sectionsComponents = this.props.sections.map(section => {
      return (
        <StudyPageSection
          key={section.name}
          nctId={this.props.nctId}
          section={section}
          isWorkflow={this.props.isWorkflow}
          nextLink={this.props.nextLink}
          workflowName={this.props.workflowName}
          onLoad={this.props.onLoad}
          workflowsView={this.props.workflowsView}
          history={this.props.history}
          location={this.props.location}
          match={this.props.match}
          siteView={this.props.siteView}
          refetch={this.props.refetch}
          user={this.props.user}
        />
      );
    });

    return <div>{sectionsComponents}</div>;
  }
}

export default StudyPageSections;
