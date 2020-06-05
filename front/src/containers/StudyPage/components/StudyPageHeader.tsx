import * as React from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import ThemedButton from 'components/StyledComponents';
import { getStarColor } from '../../../utils/auth'
import { GithubSelector, GithubCounter, SlackCounter, SlackSelector } from 'react-reactions';
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';
interface StudyPageHeaderProps {

    navButtonClick: any;
    user: any;
    history: any;
    data: any;
    theme: any;
    nctId: any;
}
interface StudyPageHeaderState {
    likesArray: any[];
    dislikesArray: any[];
    showReactions: boolean;
    reactions: any;
    counters: any;
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
        counters: []

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
        let reactions = ['👍', '👎', '❤️', '☠️']

        this.setState({ reactions: reactions })
    }
    componentDidUpdate = (prevProps) => {
        
        if (this.props.data && prevProps !== this.props) {

            let dislikesCount = this.props.data.dislikesCount

            let likesCount = this.props.data.likesCount
            if (dislikesCount > 0) {
                let dislikesCounter: any[] = []
                let dislike = {
                    emoji: '👎',
                    by: "user"
                }
                for (let i = 0; i < dislikesCount; i++) {
                    dislikesCounter.push(dislike)

                }
                this.setState({ dislikesArray: dislikesCounter })
            }
            if (likesCount > 0) {
                let likesCounter: any[] = []
                let like = {
                    emoji: '👍',
                    by: "user"
                }
                for (let i = 0; i < likesCount; i++) {
                    likesCounter.push(like)

                }

                this.setState({ likesArray: likesCounter })

            }

            let dislikeCounter = this.state.dislikesArray
            let likesCounter = this.state.likesArray
            let finalArray = likesCounter.concat(dislikeCounter)
            this.setState({ counters: finalArray })

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
    handleEmojiSelect = (e) => {
        console.log(e)
    }
    handleAddReaction = (e) => {
        console.log("Clicked", e)
        this.setState({ showReactions: !this.state.showReactions })

    }
    reactions = (character) => {
        switch (character) {
            case '👎':
                return 0;
            case '👍':
                return 1;
            // case '❤️':
            //     return 2;
            // case '☠️':
            //     return 3;
        }
    }

    handleSelectorClick = (e, createReaction) => {
        console.log("CLICK CLACK", e)
        let newObject = {
            emoji: `${e}`,
            by: `${this.props.user.email}`
        }
        console.log("NEW", newObject)
        let oldArray = this.state.counters
        console.log('OLD', oldArray)
        console.log("Props", this.props)
        oldArray.push(newObject)
        this.setState({ counters: oldArray, showReactions: false })
        let reactionId = this.reactions(e)
        console.log("ID", reactionId)
        createReaction({
            variables: {
                reactionKindId: reactionId,
                nctId: this.props.nctId

            }
        })
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
            <HeaderContentWrapper>
                <BackButtonContainer>
                    {this.renderBackButton('⤺︎ Back', backLink())}
                </BackButtonContainer>
                <ReactionsContainer>
                    <LikesRow>
                        <ThumbsRow>
                            <SlackCounter
                                counters={this.state.counters}
                                user={"Brian"}
                                onSelect={this.handleEmojiSelect}
                                onAdd={this.handleAddReaction}
                            />
                            {this.state.showReactions == true ?
                                <CreateReactionMutation>
                                    {createReaction => (<GithubSelector
                                        reactions={this.state.reactions}
                                        onSelect={(e) => this.handleSelectorClick(e, createReaction)} />)}
                                </CreateReactionMutation>
                                : null}
                        </ThumbsRow>
                    </LikesRow>
                    {this.renderReviewsSummary(this.props.data)}
                </ReactionsContainer>
            </HeaderContentWrapper>
        );
    }
}

export default StudyPageHeader;
