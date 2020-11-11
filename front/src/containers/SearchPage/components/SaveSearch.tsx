import * as React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';

//TODO define Mutation
const CREATE_SAVED_SEARCH_MUTATION = gql`
  mutation CreateSavedSearchMutation($searchHash: String!){
  createSavedSearch(input: {
    shortHash: $searchHash
  }) {
    savedSearch {
      shortLink
      {
        long
      	short
      }
      userId
      createdAt
      nameLabel
    }
    }
  }
`;


interface SaveSearchProps {
  siteView: any;
  searchHash: string;
  mutate: any;
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
      mutate,
      searchHash, 
      user 
    } = this.props;
    
    const { showLoginModal } = this.state;
    const setShowLoginModal = showLoginModal => {
      this.setState({ showLoginModal });
    };

    async function onClick() {
      if (user) {
        console.log("SAVING Search to User ID: ", user.id)
          const { data } = await mutate({
          variables: { shortHash: searchHash },
        });
        //TODO Give user notification / snackbar.
        alert("Saved search: \n" + data?.createSavedSearch.savedSearch.nameLabel) 
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
          <FontAwesome name="save" />
          &nbsp;
        </ThemedButton>
      </>
    );
  }
}

export default graphql<any, any, any, any>(CREATE_SAVED_SEARCH_MUTATION)(
    SaveSearch
); 
