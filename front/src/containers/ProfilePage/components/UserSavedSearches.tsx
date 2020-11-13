import * as FontAwesome from 'react-fontawesome';
import * as React from 'react';
import {
  Mutation,
  MutationComponentOptions
} from '@apollo/client/react/components';

import {useQuery} from '@apollo/client';
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
      const savedSearches= savedSearch?.savedSearch

      return (
          (savedSearches) ?  
          <>{
          savedSearches.map( (search)=>(
          <StyledProfileLogValue>
            {
              search.nameLabel
            }
         
            <ThemedButton
              style={{ fontSize: '12px', padding: '6px 8px', float: 'right' , margin: "1px 2px" }}
              onClick={() => console.log('Click FAVORITE ')}>
              <FontAwesome name="pencil" />
            </ThemedButton>
            <ThemedButton
              style={{ fontSize: '13px', padding: '5px 9px', float: 'right' , margin: "1px 2px" }}
              onClick={() => console.log('Click DELETE ')}>
              <FontAwesome name="trash" />
            </ThemedButton>
          
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


//! return statement with the Buttons setup for delete and Edit name of saved search. BUTTONS NOT WIRED
/* 
  return (
          (savedSearches) ?  
          <>{
          savedSearches.map( (search)=>(
          <StyledProfileLogValue>
            {
              search.nameLabel
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
          ))
        } 
        </>
            :
            <StyledProfileLabel>
                No Saved Searches for user {props.user?.email}
            </StyledProfileLabel>
  
      ); */