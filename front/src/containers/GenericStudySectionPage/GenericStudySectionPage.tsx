import * as React from 'react';
import { useQuery } from 'react-apollo';
import { match } from 'react-router-dom';
import { History } from 'history';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { MailMergeView } from 'components/MailMerge';
import { useState } from 'react';
import { getStudyQuery } from 'components/MailMerge/MailMergeUtils';

interface GenericStudySectionPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

function GenericStudySectionPage(props: GenericStudySectionPageProps) {
  const { nctId, metaData } = props;
  const fragmentName = 'generic_study_section_fragment';
  const [fragment, setFragment] = useState('');
  const { data } = useQuery(getStudyQuery(fragmentName, fragment), {
    variables: { nctId },
  });

  return (
    <MailMergeView
      template={metaData.template || ''}
      context={data?.study ?? {}}
      fragmentName={fragmentName}
      fragmentClass="Study"
      onFragmentChanged={setFragment}
    />
  );
}

export default GenericStudySectionPage;
