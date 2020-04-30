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
  SearchContainer,
} from 'components/StyledComponents';

interface RenderReviewsProps {

}

class RenderReviews extends React.Component<RenderReviewsProps> {
  componentDidMount() {

  };

  render() {
    return (
      <SearchContainer>
          Showing Reviews
      </SearchContainer>
    );
  }
}

export default RenderReviews;
