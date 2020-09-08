import * as React from 'react';
import { useQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { match } from 'react-router-dom';
import { History } from 'history';
import { SiteStudyExtendedGenericSectionFragment } from 'types/SiteStudyExtendedGenericSectionFragment';
import { MailMergeView } from 'components/MailMerge';
import { useState } from 'react';
import { Spinner } from 'reactstrap';

interface GenericStudySectionPageProps {
  nctId: string;
  history: History;
  match: match<{ nctId: string }>;
  // onLoaded?: () => void;
  isWorkflow?: boolean;
  nextLink?: string | null;
  metaData: SiteStudyExtendedGenericSectionFragment;
}

const getQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on Study { nct_id }`;
  return gql`
  query GenericStudySectionQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;
};

function GenericStudySectionPage(props: GenericStudySectionPageProps) {
  const fragmentName = 'generic_study_section_fragment';
  const [fragment, setFragment] = useState('');
  const { data } = useQuery(getQuery(fragmentName, fragment), {
    variables: { nctId: props.nctId },
  });
  const updateFragmentAsync = async frag => {
    await new Promise(r => setTimeout(r));
    setFragment(frag);
  };

  return (
    <MailMergeView
      template={props.metaData.template || ''}
      context={data?.study ?? {}}
      fragmentName={fragmentName}
      fragmentClass="Study"
      onFragmentChanged={updateFragmentAsync}
    />
  );
}

export default GenericStudySectionPage;
