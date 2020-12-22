import { getLocalJwt } from 'utils/localStorage';


export const callGraphql = (endpoint: string, query: any, variables: any) => {
    return fetch(endpoint,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Accept' : 'application/json',
            'Authorization': getLocalJwt() ? `Bearer ${getLocalJwt()}` : ''
        },
        body: JSON.stringify({
            query,
            variables
        })
    }).then(r => r.json());

}
