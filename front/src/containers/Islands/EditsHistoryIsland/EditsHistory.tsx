import React, { useState } from 'react';
import { Route, useRouteMatch } from 'react-router';

//import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'types/StudyEditsHistoryQuery';
import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'services/study/model/StudyEditsHistoryQuery';
import EditsExpansionContext from 'components/Edits/EditsExpansionContext';
import Edits from 'components/Edits';
import EditsHistoryButtons from './EditsHistoryButtons';
import { mergeAll, map } from 'ramda';

interface EditsHistoryProps {
  edits: StudyEditsHistoryQuery_study_wikiPage_edits[];
}

const setInitialEditExpandedState = (
  edit: StudyEditsHistoryQuery_study_wikiPage_edits
) => {
  return {
    [edit.id]: false,
  };
};

const EditsHistory = (props: EditsHistoryProps) => {
  const { edits } = props;

  const [historyExpanded, setHistoryExpanded] = useState(() => {
    const editsWithExpandedState = map(setInitialEditExpandedState, edits);
    return mergeAll(editsWithExpandedState);
  });

  let match = useRouteMatch();

  return (
    <EditsExpansionContext.Provider
      value={{ historyExpanded, setHistoryExpanded }}>
      <div>
        <EditsHistoryButtons />
        <Route
          path={`${match.path}/history`}
          render={() => <Edits edits={edits ? edits : []} />}
        />
      </div>
    </EditsExpansionContext.Provider>
  );
};

export default EditsHistory;
