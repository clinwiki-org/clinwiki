// We need cache, because localStorage is not consistent in reads / writes
const cache: { [key: string]: any } = {};

export const lsGet = (key: string) => {
  const cachedItem = cache[key];
  if (cachedItem) return cachedItem;

  const lsItem = localStorage.getItem(key);
  console.log(lsItem);
  if (lsItem != null) {
    cache[key] = lsItem;
    return lsItem;
  }

  return null;
};

export const lsSet = (key: string, value: any) => {
  if (value == null) {
    localStorage.removeItem(key);
    delete cache[key];
  } else {
    cache[key] = value;
    localStorage.setItem(key, value);
  }
};

export const getLocalJwt = () => lsGet('jwt');
export const setLocalJwt = (jwt: string | null) => lsSet('jwt', jwt);
