import * as React from 'react';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import { fetchCurrentUser } from 'services/user/actions';

const CurrentUser = ({children}) => {
  const dispatch = useDispatch();
  useEffect( () => {
    dispatch(fetchCurrentUser());
  },[dispatch]);
  return (
    <div>
      {children}
    </div>
  );
};

export default CurrentUser;
