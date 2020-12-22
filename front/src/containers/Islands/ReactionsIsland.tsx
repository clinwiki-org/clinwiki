import React, { useContext } from 'react';
import {useSelector} from 'react-redux';
import { RootState } from 'reducers';
import { Panel } from 'react-bootstrap';
import styled from 'styled-components';
import { ReactionsIslandQuery } from 'types/ReactionsIslandQuery';
import { ReactionKinds } from 'types/ReactionKinds';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
//import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import QUERY from 'queries/ReactionsIslandQuery';
import { useQuery } from '@apollo/client';
import REACTION_KINDS from 'queries/ReactionKinds';
import ReactionsBar from '../../components/ReactionsBar'
import { usePresentSite } from "../PresentSiteProvider/PresentSiteProvider";

interface Props {
  nctId?: string;
}
const StyledPanel = styled(Panel)`
  padding: 16px;
`;
export default function ReactionsIsland(props: Props) {
  const { nctId } = props;
  const { site } = usePresentSite();
  const theme  = useTheme();
  //const user = useCurrentUser()?.data?.me;
  const user = useSelector( (state: RootState) => state.user.current);
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<ReactionsIslandQuery>(QUERY, {
    variables: { nctId },
  });
  const { data: allReactions } = useQuery<ReactionKinds>(REACTION_KINDS, {
    variables: { nctId },
  });
  if (site && allReactions && studyData && theme) {
    return (
      <ReactionsBar
        reactionsConfig={site.reactionsConfig}
        nctId={nctId}
        theme={theme}
        studyData={studyData.study}
        user={user}
        allReactions={allReactions}
      />
    );
  }
  return null;
}
