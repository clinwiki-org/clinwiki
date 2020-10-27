import * as React from 'react';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import RichTextEditor, { EditorValue } from 'react-rte';
import { match } from 'react-router';
import ReviewForm from 'containers/ReviewForm';
import { History } from 'history';
import CrowdPage from 'containers/CrowdPage';
import SuggestedLabels from './SuggestedLabels';
import { ReviewFragment } from 'types/ReviewFragment';
import { Query, QueryComponentOptions } from 'react-apollo';
import {
  WorkflowPageQuery,
  WorkflowPageQueryVariables,
} from 'types/WorkflowPageQuery';
import withTheme from 'containers/ThemeProvider';
import { extractWikiSections, WikiSection } from 'utils/helpers';
import { drop, pipe, propEq, filter, fromPairs } from 'ramda';
import * as R from 'remeda';
import { SiteStudyBasicGenericSectionFragment } from 'types/SiteStudyBasicGenericSectionFragment';
import CurrentUser from 'containers/CurrentUser';
import WikiSections from './WikiSections';
import WorkflowsViewProvider from 'containers/WorkflowsViewProvider';
import { displayFields } from 'utils/siteViewHelpers';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import ThemedButton from 'components/StyledComponents';
import QUERY from 'queries/WorkflowPageQuery';
import { DELETE_LABEL_MUTATION, DeleteMutationComponent, DeleteMutationFn } from 'mutations/CrowdPageDeleteWikiLabelMutation';
import { UPSERT_LABEL_MUTATION, UpsertMutationComponent, UpsertMutationFn } from 'mutations/CrowdPageUpsertWikiLabelMutation';

const WorkflowPageQueryComponent = (
  props: QueryComponentOptions<WorkflowPageQuery, WorkflowPageQueryVariables>
) => Query(props);

interface WorkflowPageProps {
  nctId: string;
  match: match<{ nctId: string; searchId?: string }>;
  history: History;
  onLoaded?: () => void;
  isWorkflow?: boolean;
  workflowName?: string;
  nextLink?: string | null;
  metaData: SiteStudyBasicGenericSectionFragment;
  workflowsView: WorkflowsViewFragment;
  theme?: any;
  siteView?: any;
  showAnimation:any;
}

interface WorkflowPageState {
  selectedLabel: { key: string; value: string } | null;
  review: ReviewFragment | null;
  editReviewMode: boolean;
  updatedSections: { [key: string]: string };
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
    updatedSections: {},
  };
  reviewFormRef: ReviewForm | null = null;

  handleSelect = (
    meta: {},
    upsertLabel: UpsertMutationFn,
    deleteLabel: DeleteMutationFn
  ) => (key: string, value: string, checked: boolean) => {
    if (checked) {
      CrowdPage.addLabel(
        key,
        value,
        meta,
        this.props.match.params.nctId,
        upsertLabel
      );
    } else {
      CrowdPage.deleteLabel(
        key,
        value,
        meta,
        this.props.match.params.nctId,
        upsertLabel,
        deleteLabel
      );
    }
  };

  handleReviewSave = () => {
    this.reviewFormRef && this.reviewFormRef.submitReview();
  };

  handleReviewEdit = () => {
    this.setState({ editReviewMode: true });
  };

  handleReviewAfterSave = (review: ReviewFragment) => {
    this.setState({ review, editReviewMode: false });
  };

  renderReview = (hideMeta: boolean) => {
    if (this.state.editReviewMode) {
      return (
        <ReviewForm
          ref={ref => {
            this.reviewFormRef = ref;
          }}
          theme={this.props.theme}
          nctId={this.props.match.params.nctId}
          hideSaveButton
          hideMeta={hideMeta}
          review={this.state.review || undefined}
          afterSave={this.handleReviewAfterSave}
          handleClose={()=>console.log(`Hi, this page is no longer in use`)}
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
          <ThemedButton onClick={this.handleReviewEdit}>Edit</ThemedButton>
        </ButtonContainer>
      </>
    );
  };

  render() {
    const hash = new URLSearchParams(this.props.history.location.search)
      .getAll('hash')
      .toString() as string | null;

    return (
      <WorkflowsViewProvider>
        {workflowsView => (
          <CurrentUser>
            {user => {
              const workflow = R.pipe(
                workflowsView,
                R.prop('workflows'),
                R.find(propEq('name', this.props.workflowName))
              );
              if (workflow == null) return null;

              const allowedWikiSections = displayFields(
                workflow.wikiSectionsFilter.kind,
                workflow.wikiSectionsFilter.values,
                workflow.allWikiSections.map(name => ({ name, rank: null }))
              ).map(R.prop('name'));
              const allowedSuggestedLabels = displayFields(
                workflow.suggestedLabelsFilter.kind,
                workflow.suggestedLabelsFilter.values,
                workflow.allSuggestedLabels.map(name => ({
                  name,
                  rank: null,
                }))
              ).map(R.prop('name'));

              const suggestedLabelsConfig = fromPairs(
                workflow.suggestedLabelsConfig.map(c => [c.name, c])
              );

              return (
                <div>
                  {user && !workflow.hideReviews && (
                    <>
                      <h3>
                        {this.state.editReviewMode
                          ? 'Add Review'
                          : 'Added Review'}{' '}
                      </h3>
                      <StyledPanel>
                        {this.renderReview(workflow.disableAddRating)}
                      </StyledPanel>
                      <ButtonContainer>
                        <ThemedButton
                          disabled={!this.state.editReviewMode}
                          onClick={this.handleReviewSave}
                          style={{ marginTop: 15 }}>
                          Save Review
                        </ThemedButton>
                      </ButtonContainer>
                    </>
                  )}

                  <h3>Crowd Labels</h3>

                  <WorkflowPageQueryComponent
                    query={QUERY}
                    variables={{ nctId: this.props.match.params.nctId }}>
                    {({ data }) => {
                      const sections = pipe(
                        drop(1),
                        filter((section: WikiSection) =>
                          allowedWikiSections.includes(section.name)
                        )
                      )(
                        extractWikiSections(
                          (data &&
                            data.study &&
                            data.study.wikiPage &&
                            data.study.wikiPage.content) ||
                            ''
                        )
                      ) as WikiSection[];
                      return (
                        <>
                          <UpsertMutationComponent
                            mutation={UPSERT_LABEL_MUTATION}>
                            {upsertMutation => (
                              <DeleteMutationComponent
                                mutation={DELETE_LABEL_MUTATION}>
                                {deleteMutation => (
                                  <StyledPanel>
                                    <SuggestedLabels
                                      nctId={this.props.match.params.nctId}
                                      //siteView={this.props.siteView}
                                      onSelect={this.handleSelect(
                                        (data &&
                                          data.study &&
                                          data.study.wikiPage &&
                                          JSON.parse(
                                            data.study.wikiPage.meta
                                          )) ||
                                          {},
                                        upsertMutation,
                                        deleteMutation
                                      )}
                                      allowedSuggestedLabels={
                                        allowedSuggestedLabels
                                      }
                                      suggestedLabelsConfig={
                                        suggestedLabelsConfig
                                      }
                                      disabled={!user}
                                      showAnimation={this.props.showAnimation}
                                    />
                                  </StyledPanel>
                                )}
                              </DeleteMutationComponent>
                            )}
                          </UpsertMutationComponent>
                          <CrowdPage
                            {...this.props}
                            nctId={this.props.nctId}
                            workflowView
                            forceAddLabel={
                              this.state.selectedLabel || undefined
                            }
                            showAnimation={this.props.showAnimation}
                          />
                          <WikiSections
                            sections={sections}
                            disabled={!user}
                            nctId={this.props.match.params.nctId}
                            key={this.props.match.params.nctId}
                            showAnimation={this.props.showAnimation}
                          />
                        </>
                      );
                    }}
                  </WorkflowPageQueryComponent>
                </div>
              );
            }}
          </CurrentUser>
        )}
      </WorkflowsViewProvider>
    );
  }
}

export default withTheme(WorkflowPage);
