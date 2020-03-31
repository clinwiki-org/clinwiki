import * as React from "react";
import styled from "styled-components";
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';

interface ProfilePageProps {
  history: History;
  location: Location;
  match: any;
}



class SitesPage extends React.Component<ProfilePageProps> {

  componentDidMount(){
    console.log("This.props", this.props)
  }

  render() {
    return (
      <div>
     <h2>Profile Page</h2>
      <SearchPage
      history={this.props.history}
      location={this.props.location}
      match={this.props.match}
      userId={this.props.match.params.id}
      />
      </div>
    );
  }
}

export default SitesPage;
