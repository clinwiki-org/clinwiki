import React,{useState} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import {editProfile} from 'services/user/actions';
import {RootState} from 'reducers';
import {
  Mutation,
  MutationComponentOptions,
} from '@apollo/client/react/components';
import { gql, MutationFunction }  from '@apollo/client';
// import {
//   EditProfileMutation,
//   EditProfileMutationVariables,
// } from 'types/EditProfileMutation';
import SearchPage from 'containers/SearchPage';
import { match } from 'react-router-dom';
import { History, Location } from 'history';
import StyledError from '../LoginPage/StyledError';
import CurrentUser from 'containers/CurrentUser';
// import { UserFragment } from 'types/UserFragment';
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
import ReactionsById from 'containers/StudyPage/components/ReactionsById';
import * as FontAwesome from 'react-fontawesome';
import UserSearchLogs from './components/UserSearchLogs';
import UserSavedSearches from './components/UserSavedSearches';

interface EditProfilePageProps {
  //@ts-ignore
  user: UserFragment | null;
  history: History;
  location: Location;
  match: match;
}

const ProfileInfo = ({user,onToggle}) => {
  let pictureUrl = user.pictureUrl || null;
  return (
    <div>
    <ProfilePicture pictureUrl={pictureUrl} />
    <a
      style={{ paddingLeft: '15px', cursor: 'pointer' }}
      onClick={onToggle}>
      {' '}
      Edit Profile
    </a>

    <ThemedSearchContainer>
      <StyledProfileLabel>First Name:</StyledProfileLabel>
      <StyledProfileValue>
        {' '}
        {user.firstName}
      </StyledProfileValue>
      <StyledProfileLabel>Last Name: </StyledProfileLabel>
      <StyledProfileValue>{user.lastName}</StyledProfileValue>
      <StyledProfileLabel>E-mail: </StyledProfileLabel>
      <StyledProfileValue>{user.email}</StyledProfileValue>
      <StyledProfileLabel>Default Query String: </StyledProfileLabel>
      <StyledProfileValue>
        {user.defaultQueryString || 'N/A'}
      </StyledProfileValue>
    </ThemedSearchContainer>
  </div>

  );
}

const EditForm = ({user,onToggle}) => {
  const dispatch = useDispatch();
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [defaultQueryString,setDefaultQueryString] = useState('');

  const handleEditProfile = () => {
    dispatch(editProfile(firstName,lastName,defaultQueryString));
    onToggle();
  };

  return (
    <div>
    <ProfilePicture pictureUrl={user.pictureUrl} />
    <a
      style={{ paddingLeft: '15px', cursor: 'pointer' }}
      onClick={onToggle}>
      X
    </a>
    <ThemedSearchContainer>
      <StyledProfileLabel>First Name:</StyledProfileLabel>
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
      </ThemedButton>
    </ThemedSearchContainer>
  </div>    
  );  
}

const EditProfilePage = (props : EditProfilePageProps) => {
  const [isEditing,setEditing] = useState(false);
  const [currentDisplay,setCurrentDisplay] = useState('contributions');
  const [totalContributions,setTotalContributions] = useState('');
  const user = useSelector( (state : RootState) => state.user.current);

  if (!user || !user.reactions) {
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
            <h2>Contributed Studies:</h2>
            <SearchPage
              history={props.history}
              location={props.location}
              match={props.match}
              email={email}
              getTotalContributions={handleTotalContributions}
            />
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
                <ReactionsById reactionKindId={id} key={id}>
                  {reactions =>
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
                  }
                </ReactionsById>
              );
            })}
          </div>
        );
    }
  };

  return (
    <ThemedMainContainer>
    <h2>My profile</h2>
    {isEditing === true
      ? <EditForm user={user} onToggle={() => setEditing(false)}/>
      : <ProfileInfo user={user} onToggle={() => setEditing(true)}/>}

    <h2>My Searches</h2>
    <ThemedSearchContainer>
    <h4>Saved Searches:</h4>
      <UserSavedSearches
        user={user}
      />
    </ThemedSearchContainer>

    <h2>My Contributions</h2>
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
    </ThemedSearchContainer>
    {user ? (
      renderResults(user.email)
    ) : (
      <div>No User</div>
    )}
  </ThemedMainContainer>

  );
};

export default EditProfilePage;
