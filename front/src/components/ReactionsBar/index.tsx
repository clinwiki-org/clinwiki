import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import LoginModal from '../LoginModal';
import SlackCounter from './SlackCounter/SlackCounter';
import GithubSelector from './GithubSelector/GithubSelector';
import CreateReactionMutation, {
  CREATE_REACTION,
} from 'mutations/CreateReactionMutation';
import { find, propEq } from 'ramda';
import { useQuery, useMutation } from 'react-apollo';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import StudyReactions from '../../queries/StudyReaction';
import QUERY from 'queries/StudyPageQuery';
import REACTION_KINDS from 'queries/ReactionKinds';
import { ReactionKinds } from 'types/ReactionKinds';
import { StudyReactions as StudyReactionsQueryType } from 'types/StudyReactions';
import REACTIONS_QUERY from '../../queries/StudyReaction';

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
  const { data: userReactions } = useQuery<StudyReactionsQueryType>(
    REACTIONS_QUERY,
    {
      variables: { nctId },
    }
  );

  const [createReactionMutation] = useMutation(CREATE_REACTION, {
    refetchQueries: [{ query: REACTIONS_QUERY, variables: { nctId } }],
  });
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
  }, [allReactions, studyData]);
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
      refetchQueries: [
        { query: QUERY, variables: { nctId } },
        { query: REACTIONS_QUERY, variables: { nctId } },
      ],
    });
  };

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
      {showReactions == true ? (
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
