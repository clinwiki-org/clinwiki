import * as React from 'react';
import styled from 'styled-components';
import { Button, Panel } from 'react-bootstrap';
import RichTextEditor, { EditorValue } from 'react-rte-yt';
import { match } from 'react-router';
import ReviewForm from 'containers/ReviewForm';
import { History } from 'history';
import CrowdPage, {
  UpsertMutationComponent,
  UPSERT_LABEL_MUTATION,
  UpsertMutationFn,
  DeleteMutationComponent,
  DELETE_LABEL_MUTATION,
  DeleteMutationFn,
} from 'containers/CrowdPage';
import SuggestedLabels from './SuggestedLabels';
import { ReviewFragment } from 'types/ReviewFragment';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  WorkflowPageQuery,
  WorkflowPageQueryVariables,
} from 'types/WorkflowPageQuery';
import { SiteViewFragment } from 'types/SiteViewFragment';
import SiteProvider from 'containers/SiteProvider';

const QUERY = gql`
  query WorkflowPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        nctId
        meta
      }
      nctId
    }
  }
`;

const WORKFLOW_PAGE_QUERY = gql`
  query WorkflowPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        nctId
        meta
      }
      nctId
    }
  }
`;

class WorkflowPageQueryComponent extends Query<
  WorkflowPageQuery,
  WorkflowPageQueryVariables
> {}

interface WorkflowPageProps {
  match: match<{ nctId: string; searchId?: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
}

interface WorkflowPageState {
  selectedLabel: { key: string; value: string } | null;
  review: ReviewFragment | null;
  editReviewMode: boolean;
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const RichTextEditorContainer = styled.div`
  margin-bottom: 16px;
`;

const StyledPanel = styled(Panel)`
  padding: 16px;
`;

class WorkflowPage extends React.Component<
  WorkflowPageProps,
  WorkflowPageState
> {
  state: WorkflowPageState = {
    selectedLabel: null,
    review: null,
    editReviewMode: true,
  };
  reviewFormRef: ReviewForm | null = null;

  handleSelect = (
    meta: {},
    upsertLabel: UpsertMutationFn,
    deleteLabel: DeleteMutationFn,
  ) => (key: string, value: string, checked: boolean) => {
    if (checked) {
      CrowdPage.addLabel(
        key,
        value,
        meta,
        this.props.match.params.nctId,
        upsertLabel,
      );
    } else {
      CrowdPage.deleteLabel(
        key,
        value,
        meta,
        this.props.match.params.nctId,
        upsertLabel,
        deleteLabel,
      );
    }
  };

  handleSave = () => {
    this.reviewFormRef && this.reviewFormRef.submitReview();
  };

  handleReviewEdit = () => {
    this.setState({ editReviewMode: true });
  };

  handleReviewSave = (review: ReviewFragment) => {
    this.setState({ review, editReviewMode: false });
  };

  renderReview = (hideMeta: boolean) => {
    if (this.state.editReviewMode) {
      return (
        <ReviewForm
          ref={ref => {
            this.reviewFormRef = ref;
          }}
          nctId={this.props.match.params.nctId}
          hideSaveButton
          hideMeta={hideMeta}
          review={this.state.review || undefined}
          afterSave={this.handleReviewSave}
        />
      );
    }

    const content = (this.state.review && this.state.review.content) || '';
    return (
      <>
        <RichTextEditorContainer>
          <RichTextEditor
            readOnly
            value={EditorValue.createFromString(content, 'markdown')}
          />
        </RichTextEditorContainer>
        <ButtonContainer>
          <Button onClick={this.handleReviewEdit}>Edit</Button>
        </ButtonContainer>
      </>
    );
  };

  render() {
    return (
      <SiteProvider>
        {site => (
          <div>
            <h3>
              {this.state.editReviewMode ? 'Add Review' : 'Added Review'}{' '}
            </h3>
            <StyledPanel>{this.renderReview(!site.siteView.workflow.addRating)}</StyledPanel>
            <h3>Crowd Labels</h3>
        <StyledPanel>
        <WorkflowPageQueryComponent
          query={QUERY}
          variables={{ nctId: this.props.match.params.nctId }}
        >
          {({ data, loading, error }) => (
            <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
              {upsertMutation => (
                <DeleteMutationComponent mutation={DELETE_LABEL_MUTATION}>
                  {deleteMutation => (
                    <SuggestedLabels
                      nctId={this.props.match.params.nctId}
                      searchHash={this.props.match.params.searchId || null}
                      onSelect={this.handleSelect(
                        (data &&
                          data.study &&
                          data.study.wikiPage &&
                          JSON.parse(data.study.wikiPage.meta)) ||
                          {},
                        upsertMutation,
                        deleteMutation,
                      )}
                    />
                  )}
                </DeleteMutationComponent>
              )}
            </UpsertMutationComponent>
          )}
        </WorkflowPageQueryComponent>
        <CrowdPage
          {...this.props}
          workflowView
          forceAddLabel={this.state.selectedLabel || undefined}
        />
        </StyledPanel>
            <ButtonContainer>
              <Button
                disabled={!this.state.editReviewMode}
                onClick={this.handleSave}
              >
                Save
              </Button>
            </ButtonContainer>
          </div>
        )}
      </SiteProvider>
    );
  }
}

export default WorkflowPage;
