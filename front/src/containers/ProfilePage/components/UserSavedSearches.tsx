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
import useUrlParams from 'utils/UrlParamsProvider';
import { useHistory } from 'react-router-dom';


interface UserSavedSearchesProps {
  user: UserFragment | null;
}
interface UserSavedSearchesState {
  isEditing: boolean;
}



export default function UserSavedSearches(props: UserSavedSearchesProps) {
  const userId =  props.user?.id;

let history = useHistory();
let sv = useUrlParams().sv
let pv = useUrlParams().pv


const buildLink = (shortLink) =>{
history.push(`search?hash=${shortLink}&sv=default&pv=${pv}`);
//with current user SITEVIEW history.push(`search?hash=${shortLink}&sv=${sv}&pv=${pv}`);
}

    const { data: savedSearch } = useQuery<UserSavedSearchesQuery>(QUERY, {
        variables: { userId },
      });
      const savedSearches= savedSearch?.savedSearch

      return (
          (savedSearches && savedSearches?.length !==0) ?  
          <>{
          savedSearches.map( (search)=>(
          <StyledProfileLogValue key={search.shortLink + search.createdAt}>
            {
              search.nameLabel
            }
         
            <ThemedButton
              style={{ fontSize: '12px', padding: '6px 8px', float: 'right' , margin: "1px 2px" }}
              onClick={() => buildLink(search.shortLink.short)}>
              <FontAwesome name="link" />
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
          (savedSearches && savedSearches?.length !==0) ?  
          <>{
          savedSearches.map( (search)=>(
          <StyledProfileLogValue key={search.shortLink + search.createdAt}>
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
  
      ); */