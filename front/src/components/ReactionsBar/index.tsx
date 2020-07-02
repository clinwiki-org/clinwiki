import * as React from 'react';
import styled from 'styled-components';
import LoginModal from '../LoginModal'
import SlackCounter from './SlackCounter/SlackCounter'
import GithubSelector from './GithubSelector/GithubSelector'
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';
import { find, propEq } from 'ramda';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';
import StudyReactions from '../ReactionsBar/StudyReaction'
interface ReactionsBarProps {
    user: any;
    studyData: any;
    theme: any;
    nctId: any;
    studyRefetch: any;
    reactionsConfig?: any;
    allReactions: any;
}
interface ReactionsBarState {
    showReactions: boolean;
    reactions: any;
    counters: any;
    showLoginModal: boolean;
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


class ReactionsBar extends React.Component<ReactionsBarProps, ReactionsBarState> {
    state: ReactionsBarState = {
        showReactions: false,
        reactions: [],
        counters: [],
        showLoginModal: false,

    }


    componentDidUpdate = (prevProps) => {
        const { reactionsConfig, studyData, allReactions } = this.props;

        if (allReactions.data && prevProps !== this.props) {
            let reactions = this.activeReactions(reactionsConfig)
            this.setState({ reactions: reactions })
        }
        if (studyData && prevProps !== this.props) {
            let activeCount: any[] = []
            studyData.reactionsCount.map((reaction) => {
                let configArray = JSON.parse(reactionsConfig)

                //through each reaction iteration we check against the config array to figure if the count should display
                let isActive = find(propEq('name', reaction.name))(configArray)
                if (isActive) {
                    activeCount.push(reaction)
                }
            })
            this.setState({ counters: activeCount })


        }

    }

    activeReactions = (reactionsConfig) => {
        const { allReactions } = this.props;

        let obj = JSON.parse(reactionsConfig)
        let activeArray: any[] = []
        if (!allReactions.data) return
        obj.map((reaction) => {
            //reaction here only has the name property, as it's the only thing we store in the configurations array 
            //so we have to find it in allReactions which will contain the id, unicode, and name fields
            //This is what we want to store in state as it is what our selector will use to render configured emojis and be able to interact w/ db 
            let currentReaction = find(propEq('name', reaction.name))(allReactions.data.reactionKinds)
            activeArray.push(currentReaction)
        })
        return activeArray
    }

    handleAddReaction = () => {
        this.setState({ showReactions: !this.state.showReactions })

    }
    setShowLoginModal = showLoginModal => {
        this.setState({ showLoginModal, showReactions: false });
    };
    handleSelectorClick = (e, createReaction, refetch, allReactions) => {

        if (this.props.user == null) {
            this.setShowLoginModal(true);
            return
        }
        this.setState({ showReactions: false })
        let currentReaction = find(propEq('unicode', e))(allReactions)

        createReaction({
            variables: {
                reactionKindId: currentReaction.id,
                nctId: this.props.nctId

            }
        })
            .then(() => this.props.studyRefetch())
            .then(() => refetch())


    }
    render() {
        return (
            <StudyReactions nctId={this.props.nctId}>
                {(reactions, refetch) => (
                    <HeaderContentWrapper>
                        <LoginModal
                            show={this.state.showLoginModal}
                            cancel={() => this.setShowLoginModal(false)}
                        />
                        <ReactionsContainer>

                            <SlackCounter
                                currentUserAndStudy={reactions?.reactions}
                                activeReactions={this.state.counters}
                                allReactions={this.props.allReactions}
                                user={this.props.user}
                                onAdd={this.handleAddReaction}
                                nctId={this.props.nctId}
                                studyRefetch={this.props.studyRefetch}
                                refetch={refetch}
                            />
                            {this.state.showReactions == true ?
                                    <CreateReactionMutation>
                                        {createReaction => (<GithubSelector
                                            reactions={this.state.reactions}
                                            onSelect={(e) => this.handleSelectorClick(e, createReaction, refetch, this.props.allReactions.data.reactionKinds)} 
                                            closeSelector={()=>this.setState({ showReactions: false })}
                                        />)}
                                    </CreateReactionMutation>
                                : null}

                        </ReactionsContainer>
                    </HeaderContentWrapper>

                )}
            </StudyReactions>
        )

    }
}

export default ReactionsBar;
