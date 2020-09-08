import { pipe, split, map, join } from 'ramda';

export const capitalize = (x: string): string =>
  x.charAt(0).toUpperCase() + x.slice(1);

// see also aggToField for formatting aggs
export const sentanceCase = (x: string) =>
  x.split('_').map(capitalize).join(' ');

export const camelCase = (text: string) =>
  text
    .split('_')
    .map(w => w.replace(/./, m => m.toUpperCase()))
    .join('')
    .replace(/./, m => m.toLowerCase());

export const snakeCase = (text: string) =>
  text.replace(/([A-Z])/g, x => `_${x.toLowerCase()}`);

export const sentanceCaseFromCamelCase = (x: string) =>
  pipe(snakeCase, split('_'), map(capitalize), join(' '))(x);

export const trimPath = (text: string): string => {
  return text[text.length - 1] === '/'
    ? text.substr(0, text.length - 1)
    : text.substr(0, text.length);
};

export type WikiSection = {
  name: string;
  match: string;
  content: string;
};

export const extractWikiSections = (text: string): WikiSection[] => {
  const regex = /^\s*##?\s*([^#\s].*)/i;
  const lines = text.split('\n');
  let currentSection: WikiSection = {
    name: '',
    match: '',
    content: '',
  };
  let sectionContents: string[] = [];
  let result: WikiSection[] = [];
  lines.forEach(line => {
    const matches = regex.exec(line);
    if (matches && matches[1] && matches[1].trim()) {
      currentSection.content = sectionContents.join('\n').trim();
      result.push(currentSection);
      currentSection = {
        name: matches[1].trim(),
        match: matches[0],
        content: '',
      };
      sectionContents = [];
    } else {
      sectionContents.push(line);
    }
  });
  currentSection.content = sectionContents.join('\n').trim();
  result.push(currentSection);

  return result;
};
