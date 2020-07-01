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
    allReactions:any;
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
  .selector{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
  }
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


    componentDidMount = () => {
        // activeReactions() takes in the reactionsConfig JSON object coming from site 
        // and returns an array of the active characters based off the config
        //this state managed array will handle the characters in the reaction selector

    }
    componentDidUpdate = (prevProps) => {
        if(this.props.allReactions.data && prevProps !== this.props){

            let reactions = this.activeReactions(this.props.reactionsConfig)

            this.setState({ reactions: reactions })
        }
        if (this.props.studyData && prevProps !== this.props) {
            let activeCount: any[] = []
            this.props.studyData.reactionsCount.map((reaction) => {
                let configArray = JSON.parse(this.props.reactionsConfig)

                //through each reaction iteration we check against the config array to figure if the count should display
                let isActive = find(propEq('name', reaction.name))(configArray)
                if (isActive) {
                    activeCount.push(reaction)
                }
            })
            this.setState({ counters: activeCount })


        }

    }

    activeReactions =(reactionsConfig)=>{
        let obj = JSON.parse(reactionsConfig)
        let activeArray: any[]=[]
        if(!this.props.allReactions.data) return
        obj.map((reaction)=>{
            let currentReaction = find(propEq('name', reaction.name))(this.props.allReactions.data.reactionKinds)
            console.log(currentReaction)
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
        console.log(e)
        console.log("YOOOO", allReactions )
        if (this.props.user == null) {
            this.setShowLoginModal(true);
            return

        }

        this.setState({ showReactions: false })
        let currentReaction = find(propEq('unicode', e))(allReactions) 
        console.log("HEHE",currentReaction)
        let reactionId = currentReaction.id


        createReaction({
            variables: {
                reactionKindId: reactionId,
                nctId: this.props.nctId

            }
        })
            .then(() => this.props.studyRefetch())
            .then(() => refetch())


    }
    render() {
        console.log("STudy dAta", this.props.studyData)
        return (
            // <Query query={REACTION_KINDS} >

            // {allReactions=>{
            //     console.log("Argg",allReactions)
            //     return(
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
                                    reactions={reactions}
                                    user={this.props.user}
                                    onAdd={this.handleAddReaction}
                                    nctId={this.props.nctId}
                                    studyRefetch={this.props.studyRefetch}
                                    refetch={refetch}
                                />
                                {this.state.showReactions == true ?
                                    <div className="selector" onClick={() => this.setState({ showReactions: false })}>
                                        <CreateReactionMutation>
                                            {createReaction => (<GithubSelector
                                                reactions={this.state.reactions}
                                                onSelect={(e) => this.handleSelectorClick(e, createReaction, refetch, this.props.allReactions.data.reactionKinds)} />)}
                                        </CreateReactionMutation>
                                    </div>
                                    : null}

                    </ReactionsContainer>
                </HeaderContentWrapper>

            )}
        </StudyReactions>
            )

            // }}
            // </Query>
        // );
    }
}

export default ReactionsBar;
