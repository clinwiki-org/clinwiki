import * as React from 'react';
import styled from 'styled-components';
import * as FontAwesome from 'react-fontawesome';
import ReactStars from 'react-stars';
import ThemedButton from 'components/StyledComponents';
import {getStarColor} from '../../../utils/auth'
import { StudyPageQuery, StudyPageQueryVariables } from 'types/StudyPageQuery';

interface StudyPageHeaderProps {

    navButtonClick:any;
    user: any;
    history:any;
    data:any;
    theme:any;
}
interface StudyPageHeaderState{
    like: boolean;
    dislike:boolean;
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
    state:StudyPageHeaderState={
        like: false,
        dislike:false
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

      thumbsUpClick = () => {
        if (this.state.like) {
          this.setState({
            like: false,
          });
        } else {
          this.setState({
            like: true,
            dislike: false,
          });
        }
      };
    
      thumbsDownClick = () => {
        if (this.state.dislike) {
          this.setState({
            dislike: false,
          });
        } else {
          this.setState({
            dislike: true,
            like: false,
          });
        }
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
                <ThumbIcon>
                  <FontAwesome
                    name="thumbs-up"
                    style={{
                      color: this.state.like ? 'green' : '#fff',
                      fontSize: 24,
                    }}
                    onClick={this.thumbsUpClick}
                  />
                </ThumbIcon>
                <LikesText>120</LikesText>
              </ThumbsRow>
              <ThumbsRow>
                <ThumbIcon>
                  <FontAwesome
                    name="thumbs-down"
                    style={{
                      color: this.state.dislike ? 'red' : '#fff',
                      fontSize: 24,
                    }}
                    onClick={this.thumbsDownClick}
                  />
                </ThumbIcon>
                <LikesText style={{ color: '#B8B8B8' }}>20</LikesText>
              </ThumbsRow>
            </LikesRow>
            {this.renderReviewsSummary(this.props.data)}
          </ReactionsContainer>
        </HeaderContentWrapper>
    );
  }
}

export default StudyPageHeader;
