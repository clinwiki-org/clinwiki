import * as React from 'react';
import { gql, useQuery}  from '@apollo/client';
import { match } from 'react-router-dom';
import { History } from 'history';
import { SiteStudyExtendedGenericSectionFragment } from 'services/study/model/SiteStudyExtendedGenericSectionFragment';
import { MailMergeView } from 'components/MailMerge';
import { useState } from 'react';
import { getStudyQuery } from 'components/MailMerge/MailMergeUtils';
import { useFragment } from 'components/MailMerge/MailMergeFragment';

interface GenericStudySectionPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  // onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

function GenericStudySectionPage(props: GenericStudySectionPageProps) {
  const [fragmentName, fragment] = useFragment('Study', props.metaData.template ?? '');
  const { data } = useQuery(getStudyQuery(fragmentName, fragment), {
    variables: { nctId: props.nctId },
  });
  
  return (
    <MailMergeView
      template={props.metaData.template || ''}
      context={data?.study??{}}
    />
  );
}

export default GenericStudySectionPage;
