import * as React from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import ThemedButton from 'components/StyledComponents';
import { getStarColor } from '../../../utils/auth'
import LoginModal from '../../../../src/components/LoginModal'
import SlackCounter from '../../../components/SlackCounter/SlackCounter'
import GithubSelector from '../../../components/GithubSelector/GithubSelector'
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';
import DeleteReactionMutation, {
} from 'mutations/DeleteReactionMutation';
import { find, propEq, findLastIndex } from 'ramda';
import StudyReactions from './StudyReaction'
import { reactionIdFromCharacter, activeReactions, isReactionUnique } from '../../../utils/reactions/reactionKinds'
interface StudyPageHeaderProps {

    navButtonClick: any;
    user: any;
    history: any;
    data: any;
    theme: any;
    nctId: any;
    studyRefetch: any;
    userRefetch: any;
}
interface StudyPageHeaderState {
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

const ThumbIcon = styled.div`
  margin: 2px;
  &:hover {
    cursor: pointer;
  }
`;
const BackButtonContainer = styled.div``;

const ReactionsContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const LikesText = styled.div`
  font-size: 20px;
  color: #b8b8b8;
  margin-left: 4px;
`;

// A simple counter that displays which study you're on on the study page, in the middle of the prev and next buttons
class StudyPageHeader extends React.Component<StudyPageHeaderProps, StudyPageHeaderState> {
    state: StudyPageHeaderState = {
        likesArray: [],
        dislikesArray: [],
        showReactions: false,
        reactions: [],
        counters: [],
        showLoginModal: false,

    }
    renderBackButton = (name: string, link?: string | null) => {
        if (link === undefined) return null;

        return (
            <div style={{ paddingTop: '10px' }}>
                <ThemedButton
                    style={{ margin: 'auto', float: 'left' }}
                    onClick={this.props.navButtonClick(link!)}
                    disabled={link === null}>
                    {name}
                </ThemedButton>
            </div>
        );
    };

    componentDidMount = () => {
        let reactions = activeReactions

        this.setState({ reactions: reactions })
    }
    componentDidUpdate = (prevProps) => {
        // console.log("DATA", this.props.data)
        if (this.props.data && prevProps !== this.props) {

            this.setState({ counters: this.props.data.reactionsCount })


        }
    }
    renderReviewsSummary = (data: StudyPageQuery | undefined) => {
        const { theme } = this.props;
        if (!data || !data.study) {
            return (
                <ReviewsWrapper>
                    <div>
                        <ReactStars
                            count={5}
                            color2={theme.studyPage.reviewStarColor}
                            edit={false}
                            value={0}
                        />
                        <div>{'0 Reviews'}</div>
                    </div>
                </ReviewsWrapper>
            );
        }

        return (
            <ReviewsWrapper>
                <div>
                    <ReactStars
                        count={5}
                        color2={theme.studyPage.reviewStarColor}
                        edit={false}
                        value={data.study.averageRating}
                    />
                    <div
                        style={{
                            color: 'rgba(255, 255, 255, 0.5)',
                        }}>{`${data.study.reviewsCount} Reviews`}</div>
                </div>
            </ReviewsWrapper>
        );
    };
    handleEmojiSelect = (e, deleteReaction, reactions, refetch) => {

        // console.log(e, this.props)
        let reactionId = isReactionUnique(e, reactions)
        if (reactionId !== undefined) {

            deleteReaction({
                variables: {
                    //Need to define object type fields in isReactionUnique finction inside reactionKinds.ts
                    //@ts-ignore
                    id: reactionId.id
                }
            })
            this.props.studyRefetch();
            refetch();


        } else {
            console.log("Whoops, looks like something went wrong!")
        }



    }
    handleAddReaction = (e) => {
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
        .then(()=>this.props.studyRefetch())
        .then(()=>refetch())
        

    }
    render() {

        const hash = new URLSearchParams(this.props.history.location.search)
            .getAll('hash')
            .toString();
        const siteViewUrl = new URLSearchParams(this.props.history.location.search)
            .getAll('sv')
            .toString();
        const userRank = this.props.user ? this.props.user.rank : 'default'
        let rankColor = getStarColor(userRank)
        const backLink = () => {
            if (hash !== '') {
                return `/search?hash=${hash}&sv=${siteViewUrl}`;
            }
            return undefined;
        };
        return (
            <StudyReactions nctId={this.props.nctId}>
                {(reactions, refetch) => (
                    <HeaderContentWrapper>
                        <LoginModal
                            show={this.state.showLoginModal}
                            cancel={() => this.setShowLoginModal(false)}
                        />
                        <BackButtonContainer>
                            {this.renderBackButton('⤺︎ Back', backLink())}
                        </BackButtonContainer>
                        <ReactionsContainer>
                            <LikesRow>
                                <ThumbsRow>
                                    <DeleteReactionMutation>
                                        {deleteReaction => (
                                            <SlackCounter
                                                currentUserAndStudy={reactions?.reactions}
                                                reactions={this.state.counters}
                                                user={this.props.user}
                                                onSelect={(e) => this.handleEmojiSelect(e, deleteReaction, reactions?.reactions, refetch)}
                                                onAdd={this.handleAddReaction}
                                                nctId={this.props.nctId}
                                            />
                                        )}
                                    </DeleteReactionMutation>

                                    {this.state.showReactions == true ?
                                        <div className="selector" onClick={() => this.setState({ showReactions: false })}>
                                            <CreateReactionMutation>
                                                {createReaction => (<GithubSelector
                                                    reactions={this.state.reactions}
                                                    onSelect={(e) => this.handleSelectorClick(e, createReaction, refetch)} />)}
                                            </CreateReactionMutation>
                                        </div>
                                        : null}
                                </ThumbsRow>
                            </LikesRow>
                            {this.renderReviewsSummary(this.props.data)}
                        </ReactionsContainer>
                    </HeaderContentWrapper>

                )}
            </StudyReactions>
        );
    }
}

export default StudyPageHeader;
