import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';

//TODO define Mutation
/* const SAVE_USER_SEARCH_MUTATION = gql`
  mutation SaveUserSearchMutation($searchHash: String!, $siteViewId: Int!) {
    exportToCsv(input: { searchHash: $searchHash, siteViewId: $siteViewId }) {
      searchExport {
        id
      }
    }
  }
`; */

interface SaveSearchProps {
  siteView: any;
  searchHash: string;
  //mutate: any;
  user?: any;
}

interface SaveSearchState {
  showLoginModal: boolean;
}

class SaveSearch extends React.Component<SaveSearchProps, SaveSearchState> {
  state = {
    showLoginModal: false,
  };
  render() {
    const { 
      //mutate,
      siteView, 
      searchHash, 
      user 
    } = this.props;
    const { showLoginModal } = this.state;

    const setShowLoginModal = showLoginModal => {
      this.setState({ showLoginModal });
    };

    async function onClick() {
      console.log("USER",user)
      if (user) {
        console.log("SAVING SEarch")
        window.alert("SAVING")
      /*   const { data } = await mutate({
          variables: { siteViewId: siteView.id, searchHash },
        }); */
        //TODO SAVE USER SEARCH HERE
      } else {
        setShowLoginModal(true);
      }
    }
    return (
      <>
        <LoginModal
          show={showLoginModal}
          cancel={() => setShowLoginModal(false)}
        />
        <ThemedButton 
        style={{float:"right"}}
        onClick={onClick}>
          &nbsp;
          <FontAwesome name="heart" />
          &nbsp;
        </ThemedButton>
      </>
    );
  }
}

// it's a little annoying that the HOC expects so many types
/* export default graphql<any, any, any, any>(SAVE_USER_SEARCH_MUTATION)(
    SaveSearch
); */
export default SaveSearch;
