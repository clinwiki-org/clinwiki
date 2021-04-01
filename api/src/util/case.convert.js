const toCamel = (s) => {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  };
  
  const isArray = function (a) {
    return Array.isArray(a);
  };
  
  const isObject = function (o) {
    return o === Object(o) && !isArray(o) && typeof o !== 'function';
  };
  
export const keysToCamel = function (o) {
    if (isObject(o)) {
        const n = {};

        Object.keys(o)
        .forEach((k) => {
            n[toCamel(k)] = keysToCamel(o[k]);
        });

        return n;
    } else if (isArray(o)) {
        return o.map((i) => {
        return keysToCamel(i);
        });
    }

    return o;
};
  
