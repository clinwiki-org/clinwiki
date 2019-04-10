export const capitalize = (x: string): string =>
  x.charAt(0).toUpperCase() + x.slice(1);

export const camelCase = (text: string) =>
  text
    .split('_')
    .map(w => w.replace(/./, m => m.toUpperCase()))
    .join('')
    .replace(/./, m => m.toLowerCase());

export const snakeCase = (text: string) =>
  text.replace(/([A-Z])/g, x => `_${x.toLowerCase()}`);

export const trimPath = (text: string): string => {
  return text[text.length - 1] === '/'
    ? text.substr(0, text.length - 1)
    : text.substr(0, text.length);
};
