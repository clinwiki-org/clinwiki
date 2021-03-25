import { getLocalJwt } from 'utils/localStorage';


export const callGraphql = (endpoint: string, query: any, variables: any, operationName?: string) => {
    return fetch(endpoint,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query,
            variables,
            operationName
        })
    }).then(r => r.json());

}

export const get_gql_url = () => {
    if (
      typeof window === 'undefined' ||
      window.location.hostname.includes('localhost')
    ) {
      return `http://${window.location.hostname}:3000/graphql`;
    }
    return '/graphql';
  }


  export const callHasura = (endpoint: string, query: any, variables: any, operationName?: string) => {
    return fetch(endpoint,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'x-hasura-admin-secret': `${process.env.REACT_APP_HAS_TOKEN}`
        },
        body: JSON.stringify({
            query,
            variables,
            operationName
        })
    }).then(r => r.json());
}


export const getHasuraURL = () => {
  if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `https://clinwiki-graphql-1.hasura.app/v1/graphql`;
  }
  return `https://clinwiki-graphql-1.hasura.app/v1/graphql`;
}
