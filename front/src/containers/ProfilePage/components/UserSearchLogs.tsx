import * as FontAwesome from 'react-fontawesome';
import * as React from 'react';
import { StyledProfileLogValue } from 'components/StyledComponents';
import { ThemedButton } from '../../LoginPage/StyledButton';
import { UserFragment } from 'services/user/model/UserFragment';


interface UserSearchLogsProps {
  //@ts-ignore
  user: UserFragment | null;
}
interface UserSearchLogsState {
}



export default function UserSearchLogs(props: UserSearchLogsProps) {
   const userId =  props.user?.id;
/* 
    const { data: searchLogs } = useQuery<UserSearchLogsQuery>(QUERY, {     
       //! NOTE: We worked on Search Logs plan was to create a delete all search logs mutation for user privacy. WIll need it on redux.
        variables: { userId },
      });
 */
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
