import React, { useState } from 'react';
import { usePageView } from 'queries/PageViewQueries';
import MailMergeView, {
  microMailMerge,
} from 'components/MailMerge/MailMergeView';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-apollo';
import { getStudyQuery } from 'components/MailMerge/MailMergeUtils';
import { BeatLoader } from 'react-spinners';
import { pageIslands } from 'containers/Islands/CommonIslands'

interface Props {
  url: string;
  arg?: string;
}
export default function GenericPage(props: Props) {
  // When we add more page types we need to refactor this a little bit and pull out the query/nctid
  const fragmentName = 'GenericPageStudy';
  const { data: pageViewData } = usePageView(props.url);
  const currentPage = pageViewData?.site?.pageView;
  const [fragment, setFragment] = useState('');
  const { data: studyData, loading } = useQuery(
    getStudyQuery(fragmentName, fragment),
    {
      skip: fragment == '' || !props.arg,
      variables: { nctId: props.arg ?? '' },
    }
  );

  if (!props.arg) {
    return <h1>Missing NCTID in URL</h1>;
  }
  if (loading || !pageViewData) {
    return <BeatLoader />;
  }

  const title = microMailMerge(currentPage?.title, studyData?.study);
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <MailMergeView
        template={currentPage?.template || ''}
        context={studyData?.study}
        fragmentName={fragmentName}
        fragmentClass="Study"
        onFragmentChanged={setFragment}
        islands={pageIslands}
      />
    </div>
  );
}
