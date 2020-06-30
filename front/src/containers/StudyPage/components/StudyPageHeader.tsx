import * as React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-stars';
import ThemedButton from 'components/StyledComponents';
import { getStarColor } from '../../../utils/auth'
import LoginModal from '../../../../src/components/LoginModal'
import SlackCounter from '../../../components/ReactionsBar/SlackCounter/SlackCounter'
import GithubSelector from '../../../components/ReactionsBar/GithubSelector/GithubSelector'
import ReactionsBar from '../../../components/ReactionsBar'
import { StudyPageQuery } from 'types/StudyPageQuery';
import CreateReactionMutation, {
} from 'mutations/CreateReactionMutation';
import { find, propEq } from 'ramda';

// import { reactionIdFromCharacter, activeReactions, isReactionUnique, reactionCharacterFromName } from '../../../utils/reactions/reactionKinds'
interface StudyPageHeaderProps {

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

const BackButtonContainer = styled.div``;

const ReactionsContainer = styled.div`
  display: flex;
  flex-direction: row;
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




    render() {

        const hash = new URLSearchParams(this.props.history.location.search)
            .getAll('hash')
            .toString();
        const siteViewUrl = new URLSearchParams(this.props.history.location.search)
            .getAll('sv')
            .toString();
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
                            <ReactionsBar
                                site={this.props.site}
                                userRefetch={this.props.userRefetch}
                                studyRefetch={this.props.studyRefetch}
                                nctId={this.props.nctId}
                                theme={this.props.theme}
                                data={this.props.data}
                                history={this.props.history}
                                user={this.props.user}
                                navButtonClick={this.props.navButtonClick}

                            />

                        </ThumbsRow>
                    </LikesRow>
                    {this.renderReviewsSummary(this.props.data)}
                </ReactionsContainer>
            </HeaderContentWrapper>
        );
    }
}

export default StudyPageHeader;
