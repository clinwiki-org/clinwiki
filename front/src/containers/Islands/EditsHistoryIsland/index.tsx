import React from 'react';
import { useQuery } from 'react-apollo';
import { BeatLoader } from 'react-spinners';

import { StudyEditsHistoryQuery } from 'types/StudyEditsHistoryQuery';
import QUERY from 'queries/StudyEditsHistoryQuery';
import Error from 'components/Error';
import EditsHistory from './EditsHistory';

interface EditsIslandProps {
  nctId: string;
}

const EditsHistoryIsland = (props: EditsIslandProps) => {
  const { nctId } = props;
  const { data, error, loading } = useQuery<StudyEditsHistoryQuery>(QUERY, {
    variables: {
      nctId,
    },
  });

  if (loading || !data || !data.study || !data.study.wikiPage) return <BeatLoader />;
  if (error) {
    return (
      <Error message="Looks like something went wrong. Please refresh the page." />
    );
  }

  const {
    study: {
      wikiPage: { edits },
    },
  } = data;

  return <EditsHistory edits={edits} />;
};

export default EditsHistoryIsland;
