import * as React from 'react';
import ReactStars from 'react-stars';
import styled from 'styled-components';
import SearchPage from '../../SearchPage'
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  StyledProfileLabel,
  StyledProfileScoreLabel,
  StyledLabelValuePair,
  StyledProfileValue,
  StyledProfileScoreValue,
  ScoreBoard,
  StyledProfileRanking,
} from '../../../components/StyledComponents';


interface ProfileScoreBoardProps {
  totalPoints: any;
  totalContributions: any;
  totalReviews: any;
  totalTags: any;
  totalFavorites: any;
  handleDisplayChange?: any;
  rank?: any;
}

class ProfileScoreBoard extends React.Component<ProfileScoreBoardProps> {
  starLogo = totalContributions => {
      const firstTier = '#A97142';
      const secondTier = '#C0C0C0';
      const thirdTier = '#D4AF37';
      const fourthTier = '#E5E4E2';

      let color = '';
      switch (this.props.rank) {
        case 'default':
          color = firstTier;
          return (
            <span style={{ display: 'flex', margin: 'auto' }}>
              <ReactStars
                count={1}
                color1={color}
                color2={color}
                half={false}
                size={25}
              />
            </span>
          );
        case 'silver':
          color = secondTier;
          return (
            <span style={{ display: 'flex', margin: 'auto' }}>
              <ReactStars
                count={1}
                color1={color}
                color2={color}
                half={false}
                size={25}
              />
            </span>
          );
        case 'gold':
          color = thirdTier;
          return (
            <span style={{ display: 'flex', margin: 'auto' }}>
              <ReactStars
                count={1}
                color1={color}
                color2={color}
                half={false}
                size={25}
              />
            </span>
          );
        case 'platinum':
          color = fourthTier;
          return (
            <span style={{ display: 'flex', margin: 'auto' }}>
              <ReactStars
                count={1}
                color1={color}
                color2={color}
                half={false}
                size={25}
              />
            </span>
          );
      }
    return;
  };

  render() {
    return (
      <div>
        <ScoreBoard>
          <StyledLabelValuePair>
            <StyledProfileRanking>
              {this.starLogo(this.props.totalContributions)}
            </StyledProfileRanking>
            <StyledProfileScoreLabel>Star Level</StyledProfileScoreLabel>
          </StyledLabelValuePair>
        </ScoreBoard>
        <ScoreBoard>
          <StyledLabelValuePair
            onClick={() => this.props.handleDisplayChange('contributions')}>
            <StyledProfileScoreValue>
              {this.props.totalContributions}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Contributions</StyledProfileScoreLabel>
          </StyledLabelValuePair>
          <StyledLabelValuePair
            onClick={() => this.props.handleDisplayChange('reviews')}>
            <StyledProfileScoreValue>
              {this.props.totalReviews}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Reviews</StyledProfileScoreLabel>
          </StyledLabelValuePair>
          <StyledLabelValuePair>
            <StyledProfileScoreValue>
              {this.props.totalTags}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Tags</StyledProfileScoreLabel>
          </StyledLabelValuePair>
        </ScoreBoard>
      </div>
    );
  }
}

export default ProfileScoreBoard;