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
  params: any;
}
interface SaveSearchState {
  showLoginModal: boolean;
}


export default function SaveSearch (props: SaveSearchProps) {

  
const getSearchName = () => {
  let searchParams = props.params.current;
  let entries = 0 
  let result = ""
  if (searchParams!["q"]["children"][0]) {
    let search_term = searchParams["q"]["children"][0]["key"]
    result = result + `${search_term} | `
    entries = entries + 1 
  }
  if (searchParams!["crowdAggFilters"]) {

    searchParams!["crowdAggFilters"].map((value) => {
      if(!value) return
      value!.values?.map((subValue) => {
        result = result + `${subValue} | `
        entries = entries + 1 
      })
    })
  }
  if (searchParams!["aggFilters"]) {
    searchParams!["aggFilters"].map((value) => {
      if(value.values==undefined) return
      value!.values?.map((subValue) => {
        result = result + `${subValue} | `
        entries = entries + 1 
      })
    })
  }
  let searchName = result.substring(0, result.length -2)
  return searchName;
}

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
      //console.log('window.location.href', window.location.href)
  
      if (user) {
          const url = window.location.href

          dispatch(createSavedSearch(searchHash, url, user.id));


        let savedSearchName = getSearchName();

        //TODO Give user notification / snackbar. FIX TS Errors
        //_showSnackbarHandler();
       //@ts-ignore
        //<Snackbar ref={snackbarRef}/>
        alert("You have now saved and are subscribed to weekly updates to the following search: \n\n" + savedSearchName + " \n\n To unsubscribe: delete the search in your profile")//data?.createSavedSearch.savedSearch.nameLabel) 
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

