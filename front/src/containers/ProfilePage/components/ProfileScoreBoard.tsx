import * as React from 'react';
import ReactStars from 'react-stars';
import {
  StyledProfileScoreLabel,
  StyledLabelValuePair,
  StyledProfileScoreValue,
  ScoreBoard,
  StyledProfileRanking,
} from '../../../components/StyledComponents';

import { getStarColor } from 'utils/auth';

interface ProfileScoreBoardProps {
  totalPoints: any;
  totalContributions: any;
  totalReviews: any;
  totalTags: any;
  totalFavorites: any;
  handleDisplayChange?: any;
  rank?: any;
  reactions?: number | null;
  reactedStudies?: any[] | null;
}

interface ProfileScoreBoardState{
    showSelector: boolean;
}

class ProfileScoreBoard extends React.Component<ProfileScoreBoardProps, ProfileScoreBoardState> {
    state: ProfileScoreBoardState ={
      showSelector : false
    }
  starLogo = () => {

    let color = getStarColor(this.props.rank)
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
  };
  // handleSelectorClick=(e)=>{
  //   console.log(e)

  // }
  render() {
    return (
      <div>
        <ScoreBoard>
          <StyledLabelValuePair>
            <StyledProfileRanking>
              {this.starLogo()}
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
          <StyledLabelValuePair
            onClick={() => this.props.handleDisplayChange('reactions')}
            // onMouseEnter={()=>this.setState({showSelector: true})}
            // onMouseLeave={()=>this.setState({showSelector: false})}
            >
              {/* {
                this.state.showSelector == true ?
                <GithubSelector
                reactions={['👍', '👎', '❤️', '☠️']}
                onSelect={(e) => this.handleSelectorClick(e)} />
                :
                null
              } */}
            <StyledProfileScoreValue>
              {this.props.reactions}
            </StyledProfileScoreValue>
            <StyledProfileScoreLabel>Reactions</StyledProfileScoreLabel>
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
