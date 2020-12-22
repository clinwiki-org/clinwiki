import * as React from 'react';
import {useEffect} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { Query, QueryComponentOptions } from '@apollo/client/react/components';
import { gql, useQuery }  from '@apollo/client';
import { CurrentUserQuery } from 'types/CurrentUserQuery';
import { UserFragment } from 'types/UserFragment';
import { fetchUser } from 'services/user/actions';

const CurrentUser = ({children}) => {
  const dispatch = useDispatch();
  useEffect( () => {
    dispatch(fetchUser());
  },[dispatch]);
  return (
    <div>
      {children}
    </div>
  );
};

export default CurrentUser;
