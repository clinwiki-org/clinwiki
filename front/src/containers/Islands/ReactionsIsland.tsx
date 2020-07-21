
import React, { useContext } from 'react';
import { Panel } from 'react-bootstrap';
import styled from 'styled-components';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { trimPath } from 'utils/helpers';
import ThemedButton from 'components/StyledComponents';
import { ReactionsIslandQuery } from 'types/ReactionsIslandQuery';
import { ReactionKinds } from 'types/ReactionKinds';
import { useSite } from 'containers/SiteProvider/SiteProvider';
import { useTheme } from 'containers/ThemeProvider/ThemeProvider';
import { useCurrentUser } from 'containers/CurrentUser/CurrentUser';
import QUERY from 'queries/ReactionsIslandQuery';
import { useQuery, useMutation } from 'react-apollo';
import REACTION_KINDS from 'queries/ReactionKinds';
import ReactionsBar from '../../components/ReactionsBar'

interface Props {
  nctId?: string;
}
const StyledPanel = styled(Panel)`
  padding: 16px;
`;
export default function ReactionsIsland(props: Props) {
  const { nctId } = props;
  const history = useHistory();
  const { currentSiteView, site } = useSite();
  const theme  = useTheme();
  const user = useCurrentUser()?.data?.me;
  // TODO: This query should be pushed up as a fragment to the Page
  const { data: studyData } = useQuery<ReactionsIslandQuery>(QUERY, {
    variables: { nctId },
  });
  const { data: allReactions } = useQuery<ReactionKinds>(REACTION_KINDS, {
    variables: { nctId },
  });

  const name = '⤺︎ Back';
  const hash = new URLSearchParams(history.location.search)
    .getAll('hash')
    .toString();
  const siteViewUrl = new URLSearchParams(history.location.search)
    .getAll('sv')
    .toString();

if(site && allReactions && studyData && theme){
  return (
    <div>
      <ReactionsBar
          reactionsConfig={site.reactionsConfig}
          //studyRefetch={this.props.studyRefetch}
          nctId={nctId}
          theme={theme}
          studyData={studyData.study}
          user={user}
          allReactions={allReactions}
      />

    </div>
  );
}
return(
  <div>
    No Site
  </div>
);
}