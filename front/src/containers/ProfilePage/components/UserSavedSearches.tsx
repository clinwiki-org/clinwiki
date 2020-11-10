import * as FontAwesome from 'react-fontawesome';
import * as React from 'react';
import {
  Mutation,
  MutationComponentOptions,
  MutationFunction,
  useQuery,
} from 'react-apollo';
import {
  StyledProfileForm,
  StyledProfileLabel,
  StyledProfileLogValue,
  StyledProfileValue,
  ThemedMainContainer,
  ThemedSearchContainer,
} from 'components/StyledComponents';
import QUERY from 'queries/UserSavedSearchesQuery';
import { ThemedButton } from '../../LoginPage/StyledButton';
import { UserFragment } from 'types/UserFragment';
import { UserSavedSearchesQuery } from 'types/UserSavedSearchesQuery';


interface UserSavedSearchesProps {
  user: UserFragment | null;
}
interface UserSavedSearchesState {
  isEditing: boolean;
}



export default function UserSavedSearches(props: UserSavedSearchesProps) {
   const userId =  props.user?.id;


    const { data: savedSearch } = useQuery<UserSavedSearchesQuery>(QUERY, {
        variables: { userId },
      });
    console.log("UserSavedSearches -> savedSearches", savedSearch);

    const savedSearches= savedSearch?.savedSearch
      return (
          (savedSearches) ?  
          <div>{"savedSearches"}</div>
             
            :
            <StyledProfileLabel>
                No Saved Searches for user {props.user?.email}
            </StyledProfileLabel>
  
      );
}


/* 
  //! Map for user saved searches
  savedSearches.map( (search)=>(
    <>
  <StyledProfileLogValue>
    {
      
    }
    <ThemedButton
      style={{ fontSize: '12px', padding: '6px 8px', float: 'right' , margin: "1px 2px" }}
      onClick={() => console.log('Click FAVORITE ')}>
      <FontAwesome name="save" />
    </ThemedButton>
    <ThemedButton
      style={{ fontSize: '13px', padding: '5px 9px', float: 'right' , margin: "1px 2px" }}
      onClick={() => console.log('Click DELETE ')}>
      <FontAwesome name="trash" />
    </ThemedButton>
  </StyledProfileLogValue>
 </>
  )) */