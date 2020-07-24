import React, { useContext } from 'react';
import { useWorkflowsView } from 'containers/WorkflowsViewProvider/WorkflowsViewProvider';
import { displayFields } from 'utils/siteViewHelpers';
import * as R from 'remeda';
import { fromPairs } from 'ramda';
import {
  DELETE_LABEL_MUTATION,
  DeleteMutationFn,
} from 'mutations/CrowdPageDeleteWikiLabelMutation';
import {
  UPSERT_LABEL_MUTATION,
  UpsertMutationFn,
} from 'mutations/CrowdPageUpsertWikiLabelMutation';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import QUERY from 'queries/WorkflowPageQuery';
import { useQuery, useMutation } from 'react-apollo';
import { WorkflowPageQuery } from 'types/WorkflowPageQuery';
import SuggestedLabels from 'containers/WorkflowPage/SuggestedLabels';
import { useSite } from 'containers/SiteProvider/SiteProvider';
import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import useUrlParams from 'utils/UrlParamsProvider';
import CrowdPage from 'containers/CrowdPage';
import { BeatLoader } from 'react-spinners';

interface Props {
  name: string;
  nctId?: string;
}

const StyledPanel = styled(Panel)`
  padding: 16px;
`;

const handleSelect = (
  meta: {},
  nctId: string,
  upsertLabel: UpsertMutationFn,
  deleteLabel: DeleteMutationFn
) => (key: string, value: string, checked: boolean) => {
  if (checked) {
    CrowdPage.addLabel(key, value, meta, nctId, upsertLabel);
  } else {
    CrowdPage.deleteLabel(key, value, meta, nctId, upsertLabel, deleteLabel);
  }
};

export default function WorkflowIsland(props: Props) {
  const { name, nctId } = props;

  const { data: allWorkflows } = useWorkflowsView();
  const workflow = allWorkflows?.workflowsView.workflows.filter(
    wf => wf.name === name
  )?.[0];

  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<WorkflowPageQuery>(QUERY, {
    variables: { nctId },
  });
  const [upsertMutation] = useMutation(UPSERT_LABEL_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  });
  const [deleteMutation] = useMutation(DELETE_LABEL_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { nctId } }],
  });

  const { currentSiteView } = useSite();
  const user = useCurrentUser()?.data?.me;

  if (!workflow || !nctId) return <BeatLoader />;

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
      <StyledPanel>
        <SuggestedLabels
          nctId={nctId}
          siteView={currentSiteView}
          onSelect={handleSelect(
            JSON.parse(studyData?.study?.wikiPage?.meta || '{}'),
            nctId,
            upsertMutation,
            deleteMutation
          )}
          allowedSuggestedLabels={allowedSuggestedLabels}
          suggestedLabelsConfig={suggestedLabelsConfig}
          disabled={!user}
          showAnimation={() =>
            console.log("todo: use animation context here.")
          }
        />
      </StyledPanel>
    </div>
  );
}
