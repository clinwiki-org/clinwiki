import * as React from 'react';
import SearchPage from 'containers/SearchPage';
import { History, Location } from 'history';
import {
  ThemedMainContainer,
  ThemedSearchContainer,
} from 'components/StyledComponents';
import ThemedLoaderWrapper from '../../components/LoadingPane/LoadingPane';
import ProfileScoreBoard from './components/ProfileScoreBoard';
import ProfilePicture from './components/ProfilePicture';
import ReviewsTable from './components/ReviewsTable';
import { connect } from 'react-redux';
import { fetchUser } from 'services/user/actions';

interface ProfilePageProps {
  history: History;
  location: Location;
  match: any;
  fetchUser: any;
  isFetchingUser: boolean;
  userData: any;
  users: any;
}
interface ProfilePageState {
  currentDisplay: string;
  username: string;
}

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
    let uId = new URLSearchParams(this.props.location.search).getAll('uid').toString();
    const userId = parseInt(uId)
    this.props.fetchUser(userId);
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
          <ReviewsTable reviewData={reviews} history={this.props.history} isReview={true} />
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
      let uId = new URLSearchParams(this.props.location.search).getAll('uid').toString();
      const userId = parseInt(uId)
      const {users} = this.props;
      
      if (!users)
      return (
              <ThemedMainContainer>
                <ThemedLoaderWrapper />
              </ThemedMainContainer>
            );
            
        const userData = users[userId]
          //console.log('userData', userData);
          return (
            <div>
              <ThemedMainContainer>
                <ProfilePicture pictureUrl={userData.pictureUrl} />
                <h2>
                  {userData.firstName || this.state.username}'s
                  Contributions
                </h2>
                <ThemedSearchContainer>
                  <ProfileScoreBoard
                    totalPoints={0}
                    totalContributions={userData.contributions}
                    totalReviews={userData.reviewCount}
                    totalTags={'Coming Soon'}
                    totalFavorites={0}
                    handleDisplayChange={this.handleDisplayChange}
                    rank={userData.rank}
                  />
                </ThemedSearchContainer>
                {this.renderHeader(userData)}
                {this.renderResults(userData.reviews)}
              </ThemedMainContainer>
            </div>
          );
      
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (userId) => dispatch(fetchUser(userId)),
})

const mapStateToProps = (state, ownProps) => ({
  isFetchingUser: state.user.isFetchingUser,
  users: state.user.user//[ownProps.userId]
})

export default connect(mapStateToProps, mapDispatchToProps ) (ProfilePage);