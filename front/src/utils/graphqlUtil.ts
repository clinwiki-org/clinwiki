import { getLocalJwt } from 'utils/localStorage';
import jwt_decode from "jwt-decode";



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
    //console.log('endpoint being hit', endpoint);
    const abc = fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: getLocalJwt() ? `Bearer ${getLocalJwt()}` : "",
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
        return `https://${window.location.hostname}:3000/graphql`;
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
    if (  window.location.hostname.includes('staging') || window.location.hostname.includes('experimental')  ) {
        return `http://${window.location.hostname}:8088/graphql`;
    }
    else {
    return `https://${window.location.hostname}/graphql`;
    }
};

/* export const callHasuraAACT = (
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
 */

  
export const callHasuraClinwiki = (
    endpoint: string,
    query: any,
    variables: any,
    operationName?: string
) => {
    let token = getLocalJwt()
    let hasuraHeaders = {}
    if (token) {
        const decoded: any = jwt_decode(token)

        let currentDate = new Date();
        // console.log('TIME', currentDate.getTime())
        // console.log('DECDOED', decoded)
        if (decoded.exp * 1000 < currentDate.getTime() || token == null) {
            // console.log("Token expired.", token);
            ///TOKEN EXPIRED
            hasuraHeaders = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            } 
        } 
        else {
            // console.log("Valid token", token);
            ///VALID TOKEN  
            hasuraHeaders = {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: token ? `Bearer ${token}` : "", 
            }   
        }
    } else {
        // console.log("No Token.");
        ///NO TOKEN
        hasuraHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        } 
    }
  
    return fetch(endpoint, {
        method: 'POST',
        headers: hasuraHeaders,
        body: JSON.stringify({
            query,
            variables,
            operationName,
        }),
    }).then(r => r.json());
};
export const callHasuraDIS = (
    endpoint: string,
    query: any,
    variables: any,
    operationName?: string
) => {
    let hasuraHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-hasura-admin-secret': "56yLdUHm55QErQJepIvlIxFMk8jcnxRRF8dWA8JQjuP4h0py25uLbquMvqULZkRU" ,

    }
    return fetch(endpoint, {
        method: 'POST',
        headers: hasuraHeaders,
        body: JSON.stringify({
            query,
            variables,
            operationName,
        }),
    }).then(r => r.json());
};


export const getHasuraClinwikiURL = () => {
    if (
        typeof window === 'undefined' ||
        window.location.hostname.includes('localhost')
    ) {
        return `${process.env.REACT_APP_HASURA_CLINWIKI_URL}`;
    }
    return `${process.env.REACT_APP_HASURA_CLINWIKI_URL}`;
};
export const getHasuraDISURL = () => {
    if (
        typeof window === 'undefined' ||
        window.location.hostname.includes('localhost')
    ) {
        return `${process.env.REACT_APP_HASURA_DIS_URL}`;
    }
    return `${process.env.REACT_APP_HASURA_DIS_URL}`;
};
