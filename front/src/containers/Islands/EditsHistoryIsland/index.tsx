import React, { useState } from 'react';
import { Route } from 'react-router';
import { useQuery } from 'react-apollo';
import { BeatLoader } from 'react-spinners';

import { StudyEditsHistoryQuery } from 'types/StudyEditsHistoryQuery';
import QUERY from 'queries/StudyEditsHistoryQuery';
import EditsExpansionContext from 'components/Edits/EditsExpansionContext';
import Error from 'components/Error';
import Edits from 'components/Edits';
import EditsHistoryButtons from './EditsHistoryButtons';

interface EditsIslandProps {
  nctId: string;
}

const EditsHistoryIsland = (props: EditsIslandProps) => {
  const [historyExpanded, setHistoryExpanded] = useState({});
  const { nctId } = props;
  const { data, error, loading } = useQuery<StudyEditsHistoryQuery>(QUERY, {
    variables: {
      nctId,
    },
  });

  if (loading) return <BeatLoader />;
  if (error || !data || !data.study || !data.study.wikiPage) {
    return (
      <Error message="Looks like something went wrong. Please refresh the page." />
    );
  }

  const {
    study: {
      wikiPage: { edits },
    },
  } = data;

  return (
    <div>
      <EditsExpansionContext.Provider
        value={{ historyExpanded, setHistoryExpanded }}>
        <EditsHistoryButtons />
        <Route
          path="/study/:nctId/wiki/history"
          render={() => <Edits edits={edits ? edits : []} />}
        />
      </EditsExpansionContext.Provider>
    </div>
  );
};

export default EditsHistoryIsland;
