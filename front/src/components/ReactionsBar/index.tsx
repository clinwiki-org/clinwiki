import React, { useContext, useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { RootState } from 'reducers';
import styled from 'styled-components';
import LoginModal from '../LoginModal';
import SlackCounter from './SlackCounter/SlackCounter';
import GithubSelector from './GithubSelector/GithubSelector';
import { find, propEq } from 'ramda';
import { fetchReactionsIsland, createReaction, fetchStudyReactions } from 'services/study/actions';
import { BeatLoader } from 'react-spinners';
import { getStudyQuery } from '../MailMerge/MailMergeUtils';
import { useFragment } from '../MailMerge/MailMergeFragment';
interface ReactionsBarProps {
  user: any;
  studyData: any;
  theme: any;
  nctId: any;
  reactionsConfig?: any;
  allReactions: any;
}
const HeaderContentWrapper = styled.div`
  width: 90%;
  padding: 5px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const LikesRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px;
  padding: 10px;
  margin-top: 19px;
`;

const ReactionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
export default function ReactionsBar(props: ReactionsBarProps) {
  const {
    user,
    allReactions,
    studyData,
    theme,
    nctId,
    reactionsConfig,
  } = props;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState<object[] | undefined>([]);
  const [counters, setCounters] = useState<object[]>([]);
  const handleAddReaction = () => {
    setShowReactions(!showReactions);
  };
  const dispatch = useDispatch();
  const userReactions = useSelector( (state: RootState) => state.study.studyReactions);
  useEffect (() => {
    dispatch (fetchReactionsIsland(nctId));
  },[dispatch]);
  useEffect (() => {
  dispatch (fetchStudyReactions(nctId));
  },[dispatch]);
  const isCreatingReaction = useSelector((state:RootState) => state.study.isCreatingReaction);
  const isDeletingReaction = useSelector((state:RootState) => state.study.isDeletingReaction);
  const pageViewData = useSelector((state:RootState) => state.study.pageView);
  const currentPage = pageViewData ?  pageViewData?.data.site?.pageView : null;
  const [ fragmentName, fragment ] = useFragment('Study', currentPage?.template || '');
  const studyQuery = `${getStudyQuery(fragmentName, fragment)}`
  const createReactionMutation = (action)=>{
    if(!action.variables.nctId || !action.variables.reactionKindId) return
    return dispatch(createReaction(action.variables.nctId, action.variables.reactionKindId, studyQuery))}

  const activeReactions = (reactionsConfig, allReactions) => {
    let obj = JSON.parse(reactionsConfig);
    let activeArray: object[] = [];
    if (!allReactions) return;
    obj.map(reaction => {
      //reaction here only has the name property, as it's the only thing we store in the configurations array
      //so we have to find it in allReactions which will contain the id, unicode, and name fields
      //This is what we want to store in state as it is what our selector will use to render configured emojis and be able to interact w/ db
      let currentReaction = find(propEq('name', reaction.name))(
        allReactions.reactionKinds
      );
      activeArray.push(currentReaction);
    });
    return activeArray;
  };
  const cancelHelper = () => {
    setShowLoginModal(false);
    setShowReactions(false);
  };
  useEffect(() => {
    function updateUserReactions() {
      let reactions = activeReactions(reactionsConfig, allReactions);
      setReactions(reactions);
    }
    function updateReactionsCount() {
      if (studyData) {
        let activeCount: object[] = [];
        studyData.reactionsCount.map(reaction => {
          let configArray = JSON.parse(reactionsConfig);
          //through each reaction iteration we check against the config array to figure if the count should display
          let isActive = find(propEq('name', reaction.name))(configArray);
          if (isActive) {
            activeCount.push(reaction);
          }
        });
        setCounters(activeCount);
        }
      }
      updateUserReactions();
      updateReactionsCount();
    }, [allReactions, studyData, userReactions, isCreatingReaction, isDeletingReaction]);

    const handleSelectorClick = (e, createReaction, allReactions) => {
      const { nctId, user } = props;
      if (user == null) {
        setShowLoginModal(true);
        return;
      }

      setShowReactions(false);
      let currentReaction = find(propEq('unicode', e))(allReactions);

      createReaction({
        variables: {
          reactionKindId: currentReaction.id,
          nctId: nctId,
        },
        awaitRefetchQueries: true,
        //refetchQueries: [
        //  { query: QUERY, variables: { nctId } },
        //  { query: REACTIONS_QUERY, variables: { nctId } },
        //],
      });
    };

  if (!userReactions) {
    return <BeatLoader />;
  }
  //console.log(userReactions);
  return (
    <HeaderContentWrapper>
      <LoginModal show={showLoginModal} cancel={() => cancelHelper()} />
      <ReactionsContainer>
        <SlackCounter
          currentUserAndStudy={userReactions?.me?.reactions}
          activeReactions={counters}
          allReactions={allReactions}
          user={user}
          onAdd={handleAddReaction}
          nctId={nctId}
        />
      </ReactionsContainer>
      {(showReactions == true && reactions) ? (
        <GithubSelector
          
          reactions={reactions}
          onSelect={e =>
            handleSelectorClick(
              e,
              createReactionMutation,
              allReactions.reactionKinds
            )
          }
          closeSelector={() => setShowReactions(false)}
        />
      ) : null}
    </HeaderContentWrapper>
  );
}
