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
import QUERY from 'queries/UserSearchLogsQuery';
import { ThemedButton } from '../../LoginPage/StyledButton';
import { UserFragment } from 'services/user/model/UserFragment';
import { UserSearchLogsQuery } from 'types/UserSearchLogsQuery';


interface UserSearchLogsProps {
  user: UserFragment | null;
}
interface UserSearchLogsState {
}



export default function UserSearchLogs(props: UserSearchLogsProps) {
   const userId =  props.user?.id;

    const { data: searchLogs } = useQuery<UserSearchLogsQuery>(QUERY, {
        variables: { userId },
      });

      return (
        <>
            <h4>Search History:</h4>
            <StyledProfileLogValue>
              
              {//props.user ||
                'Delete Search History?'}
        
              <ThemedButton
                style={{ fontSize: '13px', padding: '5px 9px', float: 'right' , margin: "1px 2px" }}
                onClick={() => console.log('Click DELETE ')}>
                <FontAwesome name="trash" />
              </ThemedButton>
            
            </StyledProfileLogValue>
        </>
      );
}
