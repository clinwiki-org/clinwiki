import * as React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import ThemedButton from 'components/StyledComponents';
import { getStarColor } from '../../utils/auth'
import LoginModal from '../LoginModal'
import SlackCounter from './SlackCounter/SlackCounter'
import GithubSelector from './GithubSelector/GithubSelector'
import { StudyPageQuery } from 'types/StudyPageQuery';
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';
import { find, propEq } from 'ramda';

import StudyReactions from '../ReactionsBar/StudyReaction'
import { reactionIdFromCharacter, activeReactions, isReactionUnique, reactionCharacterFromName } from '../../utils/reactions/reactionKinds'
interface ReactionsBarProps {

    navButtonClick: any;
    user: any;
    history: any;
    data: any;
    theme: any;
    nctId: any;
    studyRefetch: any;
    userRefetch: any;
    site?: any;
}
interface ReactionsBarState {
    likesArray: any[];
    dislikesArray: any[];
    showReactions: boolean;
    reactions: any;
    counters: any;
    showLoginModal: boolean;
}
const ReviewsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  margin-top: 30px;
`;
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

const ThumbsRow = styled.div`
  margin: 3px;
  flex-direction: row;
  display: flex;
    span > div> div>div{
            background: none !important;
            height: 19px;
            padding-top: 1px;
            padding-left: 3px;
            padding-right: 4px;
            border: 1px solid rgb(187, 225, 255);
            font-size: 11px;
            color: rgb(153, 153, 153);
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            cursor: pointer;
            border-radius: 5px
          
    }
`;

const BackButtonContainer = styled.div``;

const ReactionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;


// A simple counter that displays which study you're on on the study page, in the middle of the prev and next buttons
class ReactionsBar extends React.Component<ReactionsBarProps, ReactionsBarState> {
    state: ReactionsBarState = {
        likesArray: [],
        dislikesArray: [],
        showReactions: false,
        reactions: [],
        counters: [],
        showLoginModal: false,

    }


    componentDidMount = () => {
        let reactions = activeReactions(this.props.site.reactionsConfig)

        this.setState({ reactions: reactions })
    }
    componentDidUpdate = (prevProps) => {
        // console.log("DATA", this.props.data)
        if (this.props.data && prevProps !== this.props) {
            let activeCount: any[] = []
            this.props.data.reactionsCount.map((reaction) => {
                let configArray = JSON.parse(this.props.site.reactionsConfig)
                let isActive = find(propEq('name', reaction.name))(configArray)
                if (isActive) {
                    activeCount.push(reaction)
                }
            })
            this.setState({ counters: activeCount })


        }
    }


    handleAddReaction = () => {
        this.setState({ showReactions: !this.state.showReactions })

    }



    setShowLoginModal = showLoginModal => {
        this.setState({ showLoginModal, showReactions: false });
    };
    handleSelectorClick = (e, createReaction, refetch) => {

        if (this.props.user == null) {
            this.setShowLoginModal(true);
            return

        }

        this.setState({ showReactions: false })
        let reactionId = reactionIdFromCharacter(e)
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
                                        reactions={this.state.counters}
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
                                                    onSelect={(e) => this.handleSelectorClick(e, createReaction, refetch)} />)}
                                            </CreateReactionMutation>
                                        </div>
                                        : null}
   
                        </ReactionsContainer>
                    </HeaderContentWrapper>

                )}
            </StudyReactions>
        );
    }
}

export default ReactionsBar;
