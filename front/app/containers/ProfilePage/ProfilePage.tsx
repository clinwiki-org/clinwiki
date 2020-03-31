import * as React from "react";
import styled from "styled-components";
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';

interface ProfilePageProps {
  history: History;
}



class SitesPage extends React.Component<ProfilePageProps> {

  componentDidMount(){
    console.log("This.props", this.props)
  }

  render() {
    return (
      <div>
     <h2>Profile Page</h2>
      <SearchPage/>
      </div>
    );
  }
}

export default SitesPage;
