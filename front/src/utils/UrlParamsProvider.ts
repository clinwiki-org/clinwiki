export default function useUrlParams() {
  return {
    hash: new URLSearchParams(window.location.search)
      .getAll('hash')
      ?.toString(),
    sv: new URLSearchParams(window.location.search)
      .getAll('sv')
      ?.toString(),
    pv: new URLSearchParams(window.location.search)
      .getAll('pv')
      ?.toString(),  
    q: new URLSearchParams(window.location.search)
      .getAll('q')
      ?.toString(),

  };
}

export const queryStringAll =(params)=>{
  let queryString="?"
  for (const [key, value] of Object.entries(params)) {
    if(value){
      queryString= queryString.concat(`${key}=${value}&`)
    }
  }
  return queryString
}