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
import { useQuery, useMutation } from 'react-apollo';
import REACTION_KINDS from 'queries/ReactionKinds';
import { ReactionKinds } from 'types/ReactionKinds';

// import { reactionIdFromCharacter, activeReactions, isReactionUnique, reactionCharacterFromName } from '../../../utils/reactions/reactionKinds'
interface StudyPageHeaderProps {

    navButtonClick: any;
    user: any;
    history: any;
    data: any;
    theme: any;
    nctId: any;
    userRefetch: any;
    site?: any;
    allReactions:any;
}
interface StudyPageHeaderState {

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


export default function StudyPageHeader(props: StudyPageHeaderProps){
    const renderBackButton = (name: string, link?: string | null) => {
        if (link === undefined) return null;

        return (
            <div style={{ paddingTop: '10px' }}>
                <ThemedButton
                    style={{ marginRight: '10px', float: 'left' }}
                    onClick={props.navButtonClick(link!)}
                    disabled={link === null}>
                    {name}
                </ThemedButton>
            </div>
        );
    };

    const renderReviewsSummary = (data: StudyPageQuery | undefined) => {
        const { theme } = props;
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
    const {nctId} = props

    const { data: allReactions } = useQuery<ReactionKinds>(REACTION_KINDS, {
        variables: { nctId },
      });

        const hash = new URLSearchParams(props.history.location.search)
            .getAll('hash')
            .toString();
        const siteViewUrl = new URLSearchParams(props.history.location.search)
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
                    {renderBackButton('⤺︎ Search Results', backLink())}
                </BackButtonContainer>
                <ReactionsContainer>
                    <LikesRow>
                        <ThumbsRow>
                            <ReactionsBar
                                reactionsConfig={props.site.reactionsConfig}
                                nctId={props.nctId}
                                theme={props.theme}
                                studyData={props.data}
                                user={props.user}
                                allReactions={allReactions}
                            />

                        </ThumbsRow>
                    </LikesRow>
                    {renderReviewsSummary(props.data)}
                </ReactionsContainer>
            </HeaderContentWrapper>
        );
    }

