import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import ThemedButton from 'components/StyledComponents/index';
import LoginModal from 'components/LoginModal';
import Snackbar from 'components/Snackbar';
import LabeledButton from 'components/LabeledButton';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSavedSearch } from 'services/search/actions';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';

interface SaveSearchProps {
  siteView: any;
  searchHash: string;
  user?: any;
}
interface SaveSearchState {
  showLoginModal: boolean;
}

export default function SaveSearch (props: SaveSearchProps) {

  const [showLoginModal, setShowLoginModal] = useState(false)
    const { 
      searchHash, 
      user 
    } = props;

    const dispatch = useDispatch();
    const userSavedSearches = useSelector((state:RootState) => state.search.savedSearches);

    const toggleShowLoginModal = showLoginModal => {
      setShowLoginModal(showLoginModal)
    };
    
    const snackbarRef = React.createRef();
    const  _showSnackbarHandler = () => {
      //@ts-ignore
      this.snackbarRef.current.openSnackBar('Button Pressed...');
    }

    async function onClick() {
      console.log('window.location.href', window.location.href)
  
      if (user) {
          const url = window.location.href

          dispatch(createSavedSearch(searchHash, url, user.id));

    /*   if(!userSavedSearches){
        return <BeatLoader/>
      }
      console.log("Last save search name " , userSavedSearches.data.savedSearch.last) //TODO  Find new saved search name(byId) in redux store to display on the alert box
 */
        //TODO Give user notification / snackbar. FIX TS Errors
        //_showSnackbarHandler();
       //@ts-ignore
        //<Snackbar ref={snackbarRef}/>
        alert("Saved search") //: \n" + data?.createSavedSearch.savedSearch.nameLabel) 
      } else {
        toggleShowLoginModal(true);
      }
    }
    return (
      <>
        <LoginModal
          show={showLoginModal}
          cancel={() => toggleShowLoginModal(false)}
        />
        <LabeledButton
          helperText={"Save Search"}
          theClick={onClick}
          iconName={"bookmark"}
        />
      </>
    );

};

