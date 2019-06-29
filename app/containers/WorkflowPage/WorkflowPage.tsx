import * as React from 'react';
import styled from 'styled-components';
import { Button, Panel, FormControl } from 'react-bootstrap';
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
import { extractWikiSections, WikiSection } from 'utils/helpers';
import {
  drop,
  addIndex,
  map,
  pipe,
  isNil,
  find,
  propEq,
  lensPath,
  set,
  keys,
} from 'ramda';
import { StyledFormControl } from 'components/SiteForm/Styled';
import UpdateWikiSectionsMutation, {
  UpdateWikiSectionsMutationFn,
} from 'mutations/UpdateWikiSectionsMutation';

const QUERY = gql`
  query WorkflowPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        nctId
        meta
        content
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

  handleSave = (updateWikiSections: UpdateWikiSectionsMutationFn) => () => {
    this.reviewFormRef && this.reviewFormRef.submitReview();
    updateWikiSections({
      variables: {
        input: {
          nctId: this.props.match.params.nctId,
          sections: keys(this.state.updatedSections).map(key => ({
            name: key,
            content: this.state.updatedSections[key],
          })),
        },
      },
    }).then(() => this.setState({ updatedSections: {} }));
  };

  handleReviewEdit = () => {
    this.setState({ editReviewMode: true });
  };

  handleReviewSave = (review: ReviewFragment) => {
    this.setState({ review, editReviewMode: false });
  };

  handleSectionChange = (name: string) => (e: {
    currentTarget: { value: string };
  }) => {
    this.setState({
      updatedSections: {
        ...this.state.updatedSections,
        [name]: e.currentTarget.value,
      },
    });
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

  renderWikiSection = (section: WikiSection, sections: WikiSection[]) => {
    let value = this.state.updatedSections[section.name];
    if (isNil(value)) {
      const foundSection = find(
        propEq('name', section.name),
        sections,
      ) as WikiSection;
      value = foundSection.content;
    }

    return (
      <React.Fragment key={section.name}>
        <h3>{section.name}</h3>
        <FormControl
          componentClass="textarea"
          placeholder="Add a description"
          rows={5}
          value={value}
          onChange={this.handleSectionChange(section.name)}
        />
      </React.Fragment>
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
            <StyledPanel>
              {this.renderReview(!site.siteView.workflow.addRating)}
            </StyledPanel>
            <h3>Crowd Labels</h3>

            <WorkflowPageQueryComponent
              query={QUERY}
              variables={{ nctId: this.props.match.params.nctId }}
            >
              {({ data, loading, error }) => (
                <>
                  <UpsertMutationComponent mutation={UPSERT_LABEL_MUTATION}>
                    {upsertMutation => (
                      <DeleteMutationComponent mutation={DELETE_LABEL_MUTATION}>
                        {deleteMutation => (
                          <StyledPanel>
                            <SuggestedLabels
                              nctId={this.props.match.params.nctId}
                              searchHash={
                                this.props.match.params.searchId || null
                              }
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
                          </StyledPanel>
                        )}
                      </DeleteMutationComponent>
                    )}
                  </UpsertMutationComponent>
                  <CrowdPage
                    {...this.props}
                    workflowView
                    forceAddLabel={this.state.selectedLabel || undefined}
                  />
                  {pipe(
                    drop(1),
                    addIndex(map)((section, _, sections) =>
                      this.renderWikiSection(
                        section as WikiSection,
                        sections as WikiSection[],
                      ),
                    ),
                  )(
                    extractWikiSections(
                      (data &&
                        data.study &&
                        data.study.wikiPage &&
                        data.study.wikiPage.content) ||
                        '',
                    ),
                  )}
                </>
              )}
            </WorkflowPageQueryComponent>

            <ButtonContainer>
              <UpdateWikiSectionsMutation>
                {mutate => (
                  <Button
                    disabled={!this.state.editReviewMode}
                    onClick={this.handleSave(mutate)}
                    style={{ marginTop: 15 }}
                  >
                    Save
                  </Button>
                )}
              </UpdateWikiSectionsMutation>
            </ButtonContainer>
          </div>
        )}
      </SiteProvider>
    );
  }
}

export default WorkflowPage;
