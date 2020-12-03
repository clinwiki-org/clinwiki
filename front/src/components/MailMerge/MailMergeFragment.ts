import { useMemo, useState } from 'react';

function mustacheTokens(input: string) {
  let tokens: string[] = [];
  const yeet = (t: string) => {
    if (t !== '') tokens.push(t);
  };
  let current = '';
  let last = '';
  let inside = false;
  for (const ch of input) {
    if (ch === '{' && last !== '{') {
      // Begin {{
      inside = true;
      current = ch;
    } else if (last === '{' && ch !== '{') {
      // Begin inside token
      current = ch;
    } else if (ch === '}' && last !== '}' && inside) {
      inside = false;
      // Begin }}
      yeet(current);
      current = ch;
    } else {
      current += ch;
    }
    last = ch;
  }
  return tokens;
}

type Marker = 'x';
function tokensToGraphQLOb(tags: string[]) {
  let result: Record<string, object | Marker> = {};
  let scope = result;
  let stack = [result];
  const pushScope = name => {
    const parts = name.split('.');
    stack.push(scope);
    for (const s of parts) {
      let temp = scope[s] || {};
      if (temp === 'x') temp = {};
      scope[s] = temp;
      scope = temp as any;
    }
  };
  const popScope = () => {
    scope = stack.pop() || result;
  };
  const setProperty = (name: string) => {
    const index = name.lastIndexOf('.');
    if (index > 0) {
      // multi part property
      const scopeName = name.slice(0, index);
      const propName = name.slice(index + 1);
      pushScope(scopeName);
      scope[propName] = 'x';
      popScope();
    } else {
      // single value
      scope[name] = 'x';
    }
  };
  for (const t of tags) {
    // Check for 'block helper'
    if (t.startsWith('#')) {
      // split on any whitespace, remove blanks
      const parts = t.split(/\s/).filter(id => id);
      if (parts.length > 1) {
        const name = parts[1];
        pushScope(name);
      }
    } else if (t.startsWith('/')) {
      popScope();
    }
    // Check for non-block helper. Very similar to block helper but doesn't create a scope
    else if (t.indexOf(' ') > 0) {
      const parts = t.split(/\s/).filter(id => id);
      if (parts.length > 1) {
        const name = parts[parts.length - 1];
        //Hardcoded for now, to be kept in list like commonIslands
        //Will handle cases of handlers who should  not be part of the fragment
        if (
          parts[0] == 'querystring' ||
          parts[0] == '$LEFT' ||
          parts[0] == '$TRUNCATE'
        ) {
          console.log('');
        } else {
          setProperty(name);
        }
      }
    } else {
      setProperty(t);
    }
  }
  return result;
}

function jsonToFragmentBody(
  json: Record<string, object | Marker>,
  indent = ''
) {
  if (Object.keys(json).length == 0) return '';
  var result = '{\n';
  for (const key in json) {
    const value = json[key];
    result += indent;
    if (value === 'x') {
      result += key;
      result += '\n';
    } else {
      result += key;
      result += jsonToFragmentBody(
        value as Record<string, object | Marker>,
        indent + '  '
      );
    }
  }
  result += '}\n';
  return result;
}

function toFragment(name: string, className: string, body: string) {
  if (body) {
    return `fragment ${name} on ${className} ${body}`;
  } else {
    return '';
  }
}

export function compileFragment(
  fragmentName: string,
  className: string,
  template: string
) {
  const tokens = mustacheTokens(template);
  const json = tokensToGraphQLOb(tokens);
  const fragmentBody = jsonToFragmentBody(json);
  return toFragment(fragmentName, className, fragmentBody);
}

function randomIdentifier() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
  const randomChar = () => chars[Math.floor((Math.random()*chars.length))]
  return Array.from({ length: 12 }, randomChar).join('');
}

export function useFragment(className : string, template : string) {
  const [fragmentName, _] = useState<string>(randomIdentifier());
  return useMemo(
    () => [fragmentName, compileFragment(fragmentName, className, template)],
    [fragmentName, className, template]
  );
}
