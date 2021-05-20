import * as React from 'react';
import {
  StyledProfileLabel,
  StyledProfileLogValue,
} from 'components/StyledComponents';
import { UserFragment } from 'services/user/model/UserFragment';
import useUrlParams from 'utils/UrlParamsProvider';
import { useHistory } from 'react-router-dom';
import LabeledButton from 'components/LabeledButton';
import { deleteSavedSearch, fetchSavedSearches } from 'services/search/actions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from 'reducers';
import { BeatLoader } from 'react-spinners';

interface UserSavedSearchesProps {
  //@ts-ignore
  user: UserFragment | null;
  //id?: any;
}
interface UserSavedSearchesState {
  isEditing: boolean;
}

export default function UserSavedSearches(props: UserSavedSearchesProps) {
  const userId = props.user!.id;
  //const {id} = props;

  let history = useHistory();
  let sv = useUrlParams().sv
  let pv = useUrlParams().pv


  const buildLink = (shortLink) => {
    history.push(`search?hash=${shortLink}&sv=default&pv=${pv}`);
    //with current user SITEVIEW history.push(`search?hash=${shortLink}&sv=${sv}&pv=${pv}`);
  }

  const dispatch = useDispatch();

  const handleDeleteSavedSearch = (
    id: number
  ) => () => {
    dispatch(deleteSavedSearch(id));
  };


  useEffect(() => {
    dispatch(fetchSavedSearches(userId));
  }, [dispatch]);

  const userSavedSearches = useSelector((state: RootState) => state.search.savedSearches);

  if (!userSavedSearches) {
    return <BeatLoader />
  }

  const savedSearches = userSavedSearches.data.saved_searches

  //console.log('saved seraches', savedSearches)
  return (
    (savedSearches && savedSearches?.length !== 0) ?
      <>{
        savedSearches.map((search) => (
          <StyledProfileLogValue key={search?.search_hash + search?.created_at}>
            <a href={search?.url}> {search?.name_label} </a>
            <div style={{ float: 'right', margin: "1px 2px" }} >
              <LabeledButton
                helperText={"Delete Search"}
                theClick={handleDeleteSavedSearch(search?.id)}
                iconName={"trash"}
              />
              <LabeledButton
                helperText={"Navigate to Link"}
                theClick={() => buildLink(search?.search_hash)}
                iconName={"link"}
              />
            </div>
          </StyledProfileLogValue>
        ))
      }
      </>
      :
      <StyledProfileLabel>
        No Saved Searches for user {props.user?.email}
      </StyledProfileLabel>

  );
}


//! return statement with the Buttons setup No helper label
/*
       <ThemedButton
              style={{ fontSize: '12px', padding: '6px 8px', float: 'right' , margin: "1px 2px" }}
              onClick={() => buildLink(search.shortLink.short)}>
              <FontAwesome name="link" />
            </ThemedButton>
            <ThemedButton
              style={{ fontSize: '13px', padding: '5px 9px', float: 'right' , margin: "1px 2px" }}
              onClick={handleDeleteSavedSearch(deleteSavedSearch, search.id)}>
              <FontAwesome name="trash" />
            </ThemedButton>

      */
