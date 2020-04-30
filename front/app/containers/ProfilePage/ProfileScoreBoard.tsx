import * as React from 'react';
import styled from 'styled-components';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  StyledProfileLabel,
  StyledProfileScoreLabel,
  StyledLabelValuePair,
  StyledProfileValue,
  StyledProfileScoreValue,
  ScoreBoard,
} from 'components/StyledComponents';

interface ProfileScoreBoardProps {
  totalPoints: any;
  totalContributions: any;
  totalReviews: any;
  totalSearches: any;
  totalFavorites: any;
  handleDisplayChange:any;
}

class ProfileScoreBoard extends React.Component<ProfileScoreBoardProps> {
  componentDidMount() {
    console.log('This.props', this.props);
  }
  starLogo = totalContributions => {
    if (10 > totalContributions && totalContributions > 0) {
      console.log('Outlined star');
      return <img style={{ maxWidth: '1.25em' }} src="/star_outline.png" />;
    } else if (50 > totalContributions && totalContributions > 10) {
      console.log('Outlined star');

      return <img style={{ maxWidth: '1.25em' }} src="/silver_star.png" />;
    } else if (100 > totalContributions && totalContributions > 50) {
      return <img style={{ maxWidth: '1.25em' }} src="/gold_star.png" />;
    } else if (totalContributions > 100) {
      return 'Platinum Star';
    }
  };

  render() {
    return (
      <div>
        <ScoreBoard>
          <StyledLabelValuePair>
            <StyledProfileScoreValue>
              {this.props.totalContributions +
                this.props.totalSearches +
                this.props.totalReviews}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Total Points</StyledProfileScoreLabel>
          </StyledLabelValuePair>

          <StyledLabelValuePair>
            <StyledProfileScoreValue>
              {this.starLogo(this.props.totalContributions)}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Star Level</StyledProfileScoreLabel>
          </StyledLabelValuePair>
        </ScoreBoard>
        <ScoreBoard>
          <StyledLabelValuePair onClick={()=>this.props.handleDisplayChange("contributions")}>
            <StyledProfileScoreValue>
              {this.props.totalContributions}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Contributions</StyledProfileScoreLabel>
          </StyledLabelValuePair>
          <StyledLabelValuePair onClick={()=>this.props.handleDisplayChange("reviews")}>
            <StyledProfileScoreValue>
              {this.props.totalReviews}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Reviews</StyledProfileScoreLabel>
          </StyledLabelValuePair>
          <StyledLabelValuePair>
            <StyledProfileScoreValue>
              {this.props.totalSearches}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Searches</StyledProfileScoreLabel>
          </StyledLabelValuePair>
        </ScoreBoard>
      </div>
    );
  }
}

export default ProfileScoreBoard;
