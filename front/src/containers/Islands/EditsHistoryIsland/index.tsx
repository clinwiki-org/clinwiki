import React, { useContext, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { BeatLoader } from 'react-spinners';

import { StudyEditsHistoryQuery } from 'types/StudyEditsHistoryQuery';
import QUERY from 'queries/StudyEditsHistoryQuery';
import Error from 'components/Error';
import EditsHistory from './EditsHistory';
import { fetchStudyEditsHistory } from 'services/study/actions';
import {RootState} from 'reducers';

interface EditsIslandProps {
  nctId: string;
}

const EditsHistoryIsland = (props: EditsIslandProps) => {
  const { nctId } = props;
/*  const { data, error, loading } = useQuery<StudyEditsHistoryQuery>(QUERY, {
    variables: {
      nctId,
    },
  });
*/
  const dispatch = useDispatch();
  const studyEditsHistoryData = useSelector( (state: RootState) => state.study.StudyEditsHistory);
  const loading = useSelector ((state: RootState) => state.study.isFetchingStudyEditsHistory )
  useEffect (() => {
    dispatch (fetchStudyEditsHistory(nctId));
  },[dispatch]);
  if (loading || !studyEditsHistoryData || !studyEditsHistoryData.data.study || !studyEditsHistoryData.data.study.wikiPage) return <BeatLoader />;

  const {
    study: {
      wikiPage: { edits },
    },
  } = studyEditsHistoryData.data;

  return <EditsHistory edits={edits} />;
};

export default EditsHistoryIsland;
