import React, {useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers';
import { isAdmin } from 'utils/auth';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state: RootState) => state.user.current);

  if (!isAdmin(user)) {
    return <Unauthorized />
  }
  
  return (
    <Component {...rest} />
  )
}

export default ProtectedRoute;