import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import useUrlParams from 'utils/UrlParamsProvider';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchParams } from 'services/search/actions'
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';
import LoginModal from 'components/LoginModal';
import LabeledButton from 'components/LabeledButton';
import { createSavedDocument } from 'services/search/actions';

interface SaveDocProps {
  user?: any;
  id: any;
}
function SaveDoc(props: SaveDocProps) {



  const [showLoginModal, setShowLoginModal] = useState(false)
  const {
    user, id
  } = props;

  const dispatch = useDispatch();
  const userSavedDocs = useSelector((state: RootState) => state.search.savedDocs);

  const toggleShowLoginModal = showLoginModal => {
    setShowLoginModal(showLoginModal)
  };

  const snackbarRef = React.createRef();
  const _showSnackbarHandler = () => {
    //@ts-ignore
    this.snackbarRef.current.openSnackBar('Button Pressed...');
  }

  async function onClick() {
    //console.log('window.location.href', window.location.href)

    if (user) {
      const url = window.location.href
      const title = await window.prompt("Save as: ")



      dispatch(createSavedDocument(id, url, user.id, title ?? id));




      //TODO Give user notification / snackbar. FIX TS Errors
      //_showSnackbarHandler();
      //@ts-ignore
      //<Snackbar ref={snackbarRef}/>
      alert("You have now saved and are subscribed to weekly updates to the following Study: \n\n" + title + " \n\n To unsubscribe: delete the study in your profile")//data?.createSavedSearch.savedSearch.nameLabel) 
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
        helperText={"Save Study"}
        theClick={onClick}
        iconName={"bookmark"}
      />
    </>
  );

};




interface Props {

}

function SaveDocumentIsland(props: Props) {
  const dispatch = useDispatch();
  const params = useUrlParams();
  const hash = params.hash

  



  const data = useSelector((state: RootState) => state.search.searchResults);
  const searchParams = data?.data?.searchParams;
  const match = useRouteMatch();
  const user = useSelector((state: RootState) => state.user.current);
  useEffect(() => {
    match.path == "/search2/" && dispatch(fetchSearchParams(hash));
  }, [dispatch]);


  
;

  if(!data || !searchParams){
    return <BeatLoader/>
  }
  return (
    <>
          <SaveDoc
            id={'NCT10000'}
            user={user}
          />
    </>
  );
}
export default SaveDocumentIsland;