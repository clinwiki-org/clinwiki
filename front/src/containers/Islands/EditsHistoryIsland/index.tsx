import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { BeatLoader } from 'react-spinners';

import QUERY from 'queries/StudyEditsHistoryQuery';
import Error from 'components/Error';
import Edits from 'components/Edits';
import ExpansionContext from './ExpansionContext';
import EditsHistoryButtons from './EditsHistoryButtons';

interface EditsIslandProps {
  nctId: string;
}

const EditsHistoryIsland = (props: EditsIslandProps) => {
  const [historyExpanded, setHistoryExpanded] = useState({});
  const { nctId } = props;
  const { data, error, loading } = useQuery(QUERY, {
    variables: nctId,
  });

  if (loading) return <BeatLoader />;
  if (error || !data || !data.study || !data.study.wikiPage) {
    return (
      <Error message="Looks like something went wrong. Please refresh the page." />
    );
  }

  const {
    study: { wikiPage: edits },
  } = data;

  return (
    <ExpansionContext.Provider value={{ historyExpanded, setHistoryExpanded }}>
      <EditsHistoryButtons />
      <Edits edits={edits ? edits : []} />
    </ExpansionContext.Provider>
  );
};

export default EditsHistoryIsland;
