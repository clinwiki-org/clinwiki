import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile } from 'services/user/actions';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import StyledError from '../LoginPage/StyledError';
import { UserFragment } from 'services/user/model/UserFragment';
import { equals, pick } from 'ramda';
import {
  ThemedMainContainer,
  ThemedSearchContainer,
  StyledProfileLabel,
  StyledProfileValue,
  StyledProfileForm,
} from 'components/StyledComponents';
import { ThemedButton } from '../LoginPage/StyledButton';
import ProfileScoreBoard from './components/ProfileScoreBoard';
import ProfilePicture from './components/ProfilePicture';
import ReviewsTable from './components/ReviewsTable';
import * as FontAwesome from 'react-fontawesome';
import UserSearchLogs from './components/UserSearchLogs';
import UserSavedSearches from './components/UserSavedSearches';
import UserSavedDocuments from './components/UserSavedDocuments';
import { RootState } from 'reducers';
import { fetchReactionsById } from './../../services/study/actions'
import { sentanceCaseFromCamelCase } from 'utils/helpers';

interface EditProfilePageProps {
  //@ts-ignore
  user: UserFragment | null;
  history: History;
  location: Location;
  match: match;
}
let editableFields = ['first_name', 'last_name', 'email', 'default_query_string'];

const ProfileInfo = ({ user, onToggle }) => {
  // let pictureUrl = user.pictureUrl || null; 
  const renderFields = () =>
    editableFields.map((field) => {

      let userValue = user[field];
      if (userValue) {


        return (

          <li className="flex flex-row ">
            <div className="select-none flex flex-1 items-center p-4">
              <div className="flex-1 pl-1 mr-16">

                <div className="font-medium dark:text-white">
                  {/* {user?.firstName  ?? 'None'} */}
                  {userValue}
                </div>
                <div className="text-gray-600 dark:text-gray-200 text-sm">
                  {sentanceCaseFromCamelCase(field)}
                </div>
              </div>
            </div>
          </li>
        )
      }
    })
  return (
    <>
      <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6 border-b w-full">
          <h3 className="font-bold text-2xl leading-6 font-medium text-gray-900 dark:text-white">
            My Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            <a className='cursor-pointer'
              onClick={onToggle}>
              {' '}
              Edit Profile
            </a>
            {/* By saving a study you are subscribing to weekly updates and email notifications.  */}
          </p>
          <div className="flex items-center bg-blue-400 text-white text-lg font-bold px-4 py-3" role="alert">
            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
            <p>Please update your profile. The following fields are empty: {
              editableFields.map((field, i) => {

                let userValue = user[field];
                return !userValue && `${sentanceCaseFromCamelCase(field)}${i + 1 < editableFields.length ? (', ') : ('')}`
              })

            }</p>
          </div>
        </div>

        <ul className="flex flex-col divide divide-y w-full">
          {renderFields()}
        </ul>
      </div>
    </>
  );

}
const EditForm = ({ user, onToggle }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [defaultQueryString, setDefaultQueryString] = useState(user.default_query_string || '');
  const handleEditProfile = () => {
    dispatch(editProfile(firstName, lastName, defaultQueryString, user.email));
    onToggle();
  };
  const returnStateValue = (field) => {
    console.log(field)
    // 'firstName', 'lastName', 'email','defaultQueryString'
    switch (field) {
      case 'first_name':
        return firstName
      case 'last_name':
        return lastName
      case 'email':
        return user.email
      case 'default_query_string':
        return defaultQueryString
      default:
        return
    }
  }
  const handleFormInput = (field, input) => {
    console.log(field, input)
    // 'firstName', 'lastName', 'email','defaultQueryString'
    switch (field) {
      case 'first_name':
        setFirstName(input);
        return firstName
      case 'last_name':
        setLastName(input);
        return
      case 'email':
        return
      case 'default_query_string':
        setDefaultQueryString(input);
        return
      default:
        return
    }
  }
  return (
    <div className="container flex flex-col mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 border-b w-full">
        <h3 className="font-bold text-2xl leading-6 font-medium text-gray-900 dark:text-white">
          My Profile
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          <a className='cursor-pointer'
            onClick={onToggle}>
            {' '}
            X
          </a>
        </p>
        <div>

          {editableFields.map((field) => {
            let userValue = returnStateValue(field);

            return (

              <li className="flex flex-row ">
                <div className="select-none flex flex-1 items-center p-4">
                  <div className="flex-1 pl-1 mr-16">
                    <div className="font-medium dark:text-white">
                      <input onChange={(ev) => handleFormInput(field, ev.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id={field} type="text" value={userValue} />
                    </div>
                    <div className="text-gray-600 dark:text-gray-200 text-sm">
                      {sentanceCaseFromCamelCase(field)}
                    </div>
                  </div>
                </div>
              </li>
            )

          })}

          <ThemedButton onClick={handleEditProfile}>
            Save
          </ThemedButton>
          {/* <ThemedSearchContainer> */}
          {/* <StyledProfileLabel>First Name:</StyledProfileLabel>
        <StyledProfileForm
          name="firstName"
          placeholder="First name"
          value={firstName}
          onChange={(ev) => setFirstName(ev.target.value)}
        />
        <StyledProfileLabel>Last Name:</StyledProfileLabel>
        <StyledProfileForm
          name="lastName"
          placeholder="Last name"
          value={lastName}
          onChange={(ev) => setLastName(ev.target.value)}
        />
        <StyledProfileLabel>Default Query String:</StyledProfileLabel>
        <StyledProfileForm
          name="defaultQueryString"
          placeholder="Default query string"
          value={defaultQueryString}
          onChange={(ev) => setDefaultQueryString(ev.target.value)}
        />
        <ThemedButton onClick={handleEditProfile}>
          Save
      </ThemedButton> */}
          {/* </ThemedSearchContainer> */}
        </div>
      </div>
    </div>
  );
}
const EditProfilePage = (props: EditProfilePageProps) => {
  const [isEditing, setEditing] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('contributions');
  const [totalContributions, setTotalContributions] = useState('');
  const user = useSelector((state: RootState) => state.user.current);
  const reactions = useSelector((state: RootState) => state.study.reactionsById);
  const dispatch = useDispatch();
  const ids = ["1", "2", "3", "4"]
  useEffect(() => {
    ids.map(id => {
      dispatch(fetchReactionsById(id))
    });
  }, [dispatch]);
  if (!user) // || !user.reactions)  //! Taking or out to avoid No user error on profile page load, not sure why this check was in.
  {
    return <div>No user</div>;
  }
  let userContributions = user?.contributions;
  let reviewCount = user?.reviewCount;
  let rank = user?.rank;
  let totalcount = 0;
  user.reactionsCount?.map(reaction => {
    totalcount += reaction.count;
  });
  const handleTotalContributions = recordsTotal => {
    if (recordsTotal !== totalContributions) {
      setTotalContributions(recordsTotal);
      return;
    }
    return;
  };
  const renderResults = user => {
    const email = user.email;
    switch (currentDisplay) {
      case 'contributions':
        return (
          <div>
            {/* <h2>Contributed Studies:</h2> */}
            {/* <SearchPage
              history={props.history}
              location={props.location}
              match={props.match}
              email={email}
              getTotalContributions={handleTotalContributions}
            /> */}
          </div>
        );
      case 'reviews':
        return (
          <div>
            <h2>Reviewed Studies:</h2>
            <ReviewsTable
              reviewData={user?.reviews}
              history={props.history}
              isReview={true}
            />
          </div>
        );
      case 'reactions':
        console.log(reactions);
        let idArray = ['1', '2', '3', '4'];
        return (
          <div>
            {/* <h2>Liked Studies:</h2> */}
            {idArray.map(id => {
              const displaySub = ID => {
                switch (ID) {
                  case '1':
                    return 'Liked Studies';
                  case '2':
                    return 'Disliked Studies';
                  case '3':
                    return 'Heart Studies';
                  case '4':
                    return 'Skull and Cross Studies';
                }
              };
              return (
                reactions ? (
                  <span>
                    <h2>
                      {displaySub(id)} ({reactions.reactions?.length}){' '}
                    </h2>
                    <ReviewsTable
                      //@ts-ignore
                      reviewData={reactions.reactions}
                      history={props.history}
                      isReview={false}
                    />
                  </span>
                ) : null
              );
            })}
          </div>
        );
    }
  };
  return (
    <div className='py-20'>

      {/* <span className='px-20 font-bold text-2xl'>My Saved Searches</span> */}
      {/* <ThemedSearchContainer> */}
      {/* <ProfilePicture pictureUrl={user.pictureUrl} /> */}

      <div className="container flex flex-col mx-auto w-full items-center justify-center">
        <ul className="flex flex-col">

          <li className="border-gray-400 flex flex-row mb-16">
            {isEditing === true
              ? <EditForm user={user} onToggle={() => setEditing(false)} />
              : <ProfileInfo user={user} onToggle={() => setEditing(true)} />}
          </li>
          <li className="border-gray-400 flex flex-row mb-16">

            <UserSavedSearches
              user={user}
            />
          </li>
          <li className="border-gray-400 flex flex-row mb-16">

            <UserSavedDocuments
              user={user}
            />
          </li>
        </ul>
      </div>
      {/* need to read add all of these */}
      {/* <h2>My Contributions</h2>
      <ThemedSearchContainer>
        <ProfileScoreBoard
          totalPoints={0}
          totalContributions={userContributions}
          totalReviews={reviewCount}
          totalTags={'Coming Soon'}
          totalFavorites={0}
          handleDisplayChange={(display) => setCurrentDisplay(display)}
          rank={rank}
          reactions={totalcount}
          reactedStudies={user.reactions}
        />
      </ThemedSearchContainer> */}
      {user ? (
        renderResults(user.email)
      ) : (
        <div>No User</div>
      )}
    </div>
  );
};
export default EditProfilePage;