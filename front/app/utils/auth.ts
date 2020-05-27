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

export const getStarColor = rank => {
  const firstTier = '#A97142';
  const secondTier = '#C0C0C0';
  const thirdTier = '#D4AF37';
  const fourthTier = '#E5E4E2';

  switch (rank) {
    case 'default':
      return firstTier;
    case 'silver':
      return secondTier;
    case 'gold':
      return thirdTier;
    case 'platinum':
      return fourthTier;
  }
  return;
};
