import * as FontAwesome from 'react-fontawesome';
import * as React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
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
import { DeleteSavedSearchMutation } from 'types/DeleteSavedSearchMutation';
import LabeledButton from 'components/LabeledButton';



const DELETE_SAVED_SEARCH_MUTATION = gql`
  mutation DeleteSavedSearchMutation($id: Int!){
  deleteSavedSearch(input: {
    id: $id
  }) {
      success
      errors
      savedSearch{
        id
        userId
        shortLink{
          short
          long
        }
        isSubscribed
      }
      }
  }
`;

interface UserSavedSearchesProps {
  user: UserFragment | null;
  //id?: any;
}
interface UserSavedSearchesState {
  isEditing: boolean;
}



export default function UserSavedSearches(props: UserSavedSearchesProps) {
  const userId =  props.user?.id;
  //const {id} = props;

let history = useHistory();
let sv = useUrlParams().sv
let pv = useUrlParams().pv


const buildLink = (shortLink) =>{
history.push(`search?hash=${shortLink}&sv=default&pv=${pv}`);
//with current user SITEVIEW history.push(`search?hash=${shortLink}&sv=${sv}&pv=${pv}`);
}

const [deleteSavedSearch] = useMutation(DELETE_SAVED_SEARCH_MUTATION, {
  refetchQueries: [{ query: QUERY, variables: { userId } }],
});

const handleDeleteSavedSearch = (
  deleteSavedSearch: any,
  id: number
) => () => {
  deleteSavedSearch({ variables: { id } });
};


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
         
         <div style={{ float: 'right' , margin: "1px 2px" }} >
          <LabeledButton
            helperText={"Delete Search"}
            theClick={handleDeleteSavedSearch(deleteSavedSearch, search.id)}
            iconName={"trash"}
          />
          <LabeledButton
            helperText={"Navigate to Link"}
            theClick={() => buildLink(search.shortLink.short)}
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