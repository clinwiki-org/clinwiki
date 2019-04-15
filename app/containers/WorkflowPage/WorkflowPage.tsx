import * as React from 'react';
import styled from 'styled-components';
import { match } from 'react-router';
import ReviewForm from 'containers/ReviewForm';
import { History } from 'history';
import CrowdPage from 'containers/CrowdPage';
import SuggestedLabels from './SuggestedLabels';

interface WorkflowPageProps {
  match: match<{ nctId: string; searchId?: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

interface WorkflowPageState {
  value: string | null;
}

class WorkflowPage extends React.Component<
  WorkflowPageProps,
  WorkflowPageState
> {
  state: WorkflowPageState = { value: null };

  handleSelect = (value: string) => {
    this.setState({ value });
  };

  render() {
    return (
      <div>
        <h3>Add Review</h3>
        <ReviewForm {...this.props} />
        <h3>Suggested Crowd Labels</h3>
        <SuggestedLabels
          searchHash={this.props.match.params.searchId || null}
          onSelect={this.handleSelect}
        />
        <h3>All Crowd Labels</h3>
        <CrowdPage
          {...this.props}
          forceAddKey={this.state.value || undefined}
        />
      </div>
    );
  }
}

export default WorkflowPage;
