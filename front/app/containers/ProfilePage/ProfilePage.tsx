import * as React from 'react';
import styled from 'styled-components';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';

interface ProfilePageProps {
  history: History;
  location: Location;
  match: any;
}

class ProfilePage extends React.Component<ProfilePageProps> {
  componentDidMount() {
    console.log('This.props', this.props);
  }

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

  render() {
    return (
      <div>
        <h2>Profile Page</h2>
        <SearchPage
          history={this.props.history}
          location={this.props.location}
          match={this.props.match}
          email={this.props.match.params.id}
          profileParams={this.getUserParams(this.props.match.params.id)}
        />
      </div>
    );
  }
}

export default ProfilePage;
