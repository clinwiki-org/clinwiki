import { History } from 'history';
import apolloClient from '../configureApollo';
import { getLocalJwt, setLocalJwt } from './localStorage';

export const getLocalEmail = (): string | null => {
  const jwt = getLocalJwt();
  if (!jwt) return null;

  const payloadb64 = jwt.split('.')[1];
  const payloadJson = atob(payloadb64);
  let payload;
  try {
    payload = JSON.parse(payloadJson);
  } catch (e) {
    console.log(`Failed to parse Json from jwt, jwt: ${jwt}`);
    return null;
  }

  return payload['email'];
};

export const logout = (history: History) => {
  setLocalJwt(null);
  apolloClient.resetStore().then(() => history.push('/'));
};
