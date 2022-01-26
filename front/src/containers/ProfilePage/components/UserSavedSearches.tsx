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
import * as FontAwesome from 'react-fontawesome';

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
  //console.log("🚀 ~ UserSavedSearches ~ userSavedSearches", userSavedSearches);


  if (!userSavedSearches || !userSavedSearches.data) {
    return <BeatLoader />
  }

  const savedSearches = userSavedSearches.data.saved_searches

  //console.log('saved seraches', savedSearches)
  return (
    (savedSearches && savedSearches?.length !== 0) ?
      <>
        <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-4 py-5 sm:px-6 border-b w-full">
            <h3 className="font-bold text-2xl leading-6 font-medium text-gray-900 dark:text-white">
              My Saved Searches
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              By saving a search you are subscribing to weekly updates and email notifications.
            </p>
          </div>
          <ul className="flex flex-col divide divide-y w-full">
            {
              savedSearches.map((search) => (


                <li className="flex flex-row ">
                  <div className="select-none flex flex-1 items-center p-4">
                    <div className="flex-1 pl-1 mr-16">
                      <a href={search?.url}>
                        <div className="font-medium dark:text-white">
                          {search?.name_label}
                        </div>
                        {/* <div className="text-gray-600 dark:text-gray-200 text-sm">
                  {search?.url}
                  </div> */}
                      </a>
                    </div>
                    <div className="cursor-pointer">
                      <FontAwesome onClick={handleDeleteSavedSearch(search.id)} className="hover:text-red-500 dark:hover:text-white dark:text-gray-200 text-gray-500" name={'trash'} />
                    </div>
                    <a href={search?.url}>
                      <button className="w-24 text-right flex justify-end">
                        <svg width="20" fill="currentColor" height="20" className="hover:text-gray-800 dark:hover:text-white dark:text-gray-200 text-gray-500" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z">
                          </path>
                        </svg>
                      </button>
                    </a>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </>
      :
      <StyledProfileLabel>
        No Saved Searches for user {props.user?.email}
      </StyledProfileLabel>

  );
}


