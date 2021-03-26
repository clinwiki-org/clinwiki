import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import ReactionsBar from '../../components/ReactionsBar'
import { BeatLoader } from 'react-spinners';
import { fetchReactionsIsland } from 'services/study/actions';
import { fetchReactionKinds } from 'services/study/actions';

interface Props {
  nctId?: string;
}

export default function ReactionsIsland(props: Props) {
  const { nctId } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const site = useSelector((state: RootState) => state.site.presentSiteProvider.site)
  const user = useSelector((state: RootState) => state.user.current);
  const reactionsIslandData = useSelector((state: RootState) => state.study.reactionsIsland);
  const reactionKindsData = useSelector((state: RootState) => state.study.reactionKinds);
  
  useEffect(() => {
    dispatch(fetchReactionsIsland(nctId || ""));

  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchReactionKinds());
  }, [dispatch]);

  if (!site || !reactionKindsData || !reactionsIslandData) {
    return <BeatLoader />
  }

  if (site && reactionKindsData && reactionsIslandData && theme) {
    return (
      <ReactionsBar
        reactionsConfig={site.reactionsConfig}
        nctId={nctId}
        theme={theme}
        studyData={reactionsIslandData.data.study}
        user={user}
        allReactions={reactionKindsData.data}
      />
    );
  }
  return null;
}
