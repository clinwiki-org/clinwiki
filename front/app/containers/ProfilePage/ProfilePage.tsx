import * as React from 'react';
import styled from 'styled-components';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import {
  ThemedMainContainer,
  SearchContainer,
  StyledProfileLabel,
  StyledProfileValue,
  StyledProfileForm,
} from 'components/StyledComponents';
import ThemedLoaderWrapper from '../../components/LoadingPane/LoadingPane';
import ProfileScoreBoard from './components/ProfileScoreBoard';
import ProfilePicture from './components/ProfilePicture';
import ReviewsTable from './components/ReviewsTable';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

interface ProfilePageProps {
  history: History;
  location: Location;
  match: any;
}
interface ProfilePageState {
  currentDisplay: string;
  username: string;
}

const USER_QUERY = gql`
  query User($userId: Int!) {
    user(userId: $userId) {
      firstName
      lastName
      reviewCount
      rank
      reviews {
        nctId
        briefTitle
        content
      }
      contributions
      pictureUrl
    }
  }
`;

class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  state: ProfilePageState = {
    currentDisplay: 'contributions',
    username: '',
  };

  getUserParams = (userId: string) => {
    return {
      q: { key: 'AND', children: [] },
      aggFilters: [{ field: 'userId', values: [userId] }],
      crowdAggFilters: [],
      sorts: [],
      page: 0,
      pageSize: 25,
    };
  };

  username = () => {
    return new URLSearchParams(this.props.location.search)
      .getAll('username')
      .toString();
  };
  componentDidMount() {
    this.setState({ username: this.username() });
  }
  componentDidUpdate(currentState) {
    //  if(currentState.username!= this.username() ){
    //    this.setState({username: this.username()})
    //  }
  }
  handleDisplayChange = display => {
    this.setState({ currentDisplay: display });
  };
  renderResults = reviews => {
    switch (this.state.currentDisplay) {
      case 'reviews':
        return (
          <ReviewsTable reviewData={reviews} history={this.props.history} />
        );
      case 'contributions':
        return (
          <SearchPage
            history={this.props.history}
            location={this.props.location}
            match={this.props.match}
            email={this.props.match.params.id}
            profileParams={this.getUserParams(this.props.match.params.id)}
          />
        );
    }
  };

  renderHeader = user => {
    switch (this.state.currentDisplay) {
      case 'contributions':
        return (
          <h2>{user.firstName || this.state.username}'s Contributed Studies</h2>
        );
      case 'reviews':
        return (
          <h2> {user.firstName || this.state.username}'s Reviewed Studies</h2>
        );
    }
  };
  render() {
    let userId = new URLSearchParams(this.props.location.search)
      .getAll('uid')
      .toString();
    return (
      <Query query={USER_QUERY} variables={{ userId: parseInt(userId) }}>
        {({ loading, error, data }) => {
          if (loading)
            return (
              <ThemedMainContainer>
                <ThemedLoaderWrapper />
              </ThemedMainContainer>
            );
          if (error) return <div>Error</div>;
          const userData = data;
          console.log('userData', userData);
          return (
            <div>
              <ThemedMainContainer>
                <ProfilePicture pictureUrl={userData.user.pictureUrl} />
                <h2>
                  {userData.user.firstName || this.state.username}'s
                  Contributions
                </h2>
                <SearchContainer>
                  <ProfileScoreBoard
                    totalPoints={0}
                    totalContributions={userData.user.contributions}
                    totalReviews={userData.user.reviewCount}
                    totalTags={'Coming Soon'}
                    totalFavorites={0}
                    handleDisplayChange={this.handleDisplayChange}
                    rank={userData.user.rank}
                  />
                </SearchContainer>
                {this.renderHeader(userData.user)}
                {this.renderResults(userData.user.reviews)}
              </ThemedMainContainer>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default ProfilePage;
