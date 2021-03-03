import { getLocalJwt } from 'utils/localStorage';


export const callGraphql = (endpoint: string, query: any, variables: any, operationName?: string) => {
    /*console.log("callGraphql called");
    console.log(endpoint);
    console.log(query);
    console.log(variables);
    console.log(operationName);
    console.log(`auth = ${getLocalJwt()}`);*/
    const abc = fetch(endpoint,{
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
    console.log(abc);
    return abc;
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

export const getGraphQLMigrationURL = () => {
    console.log(window.location.hostname.includes('localhost'));
    if (
    typeof window === 'undefined' ||
    window.location.hostname.includes('localhost')
  ) {
    return `http://${window.location.hostname}:8088/graphql`;
  }
  return '/graphql';
}
