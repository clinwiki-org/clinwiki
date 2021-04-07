import { getLocalJwt } from 'utils/localStorage';

export const callGraphql = (
  endpoint: string,
  query: any,
  variables: any,
  operationName?: string
) => {
  /*console.log("callGraphql called");
    console.log(`endpoint = ${endpoint}`);
    //console.log(query);
    console.log("variables = ",variables);
    console.log(`operationName = ${operationName}`);
    console.log(`auth = ${getLocalJwt()}`);*/
  console.log('endpoint being hit', endpoint);
  const abc = fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getLocalJwt() ? `Bearer ${getLocalJwt()}` : '',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  }).then(r => r.json());
  //console.log(abc);
  return abc;
};

export const get_gql_url = () => {
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `http://${window.location.hostname}:3000/graphql`;
  }
  return '/graphql';
};

export const getGraphQLMigrationURL = () => {
  //console.log(window.location.hostname.includes('localhost'));
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `http://${window.location.hostname}:8088/graphql`;
  }
  return `http://${window.location.hostname}:8088/graphql`;
};

export const callHasuraAACT = (
  endpoint: string,
  query: any,
  variables: any,
  operationName?: string
) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-hasura-admin-secret': `${process.env.REACT_APP_HAS_AACT_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  }).then(r => r.json());
};

export const callHasuraClinwiki = (
  endpoint: string,
  query: any,
  variables: any,
  operationName?: string
) => {
  return fetch(endpoint, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getLocalJwt() ? `Bearer ${getLocalJwt()}` : '',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  }).then(r => r.json());
};

export const getHasuraURLAACT = () => {
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `https://clinwiki-graphql-1.hasura.app/v1/graphql`;
  }
  return `https://clinwiki-graphql-1.hasura.app/v1/graphql`;
};

export const getHasuraClinwikiURL = () => {
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `https://clinwiki-crowd-stg.hasura.app/v1/graphql`;
  }
  return 'https://clinwiki-crowd-stg.hasura.app/v1/graphql';
};
