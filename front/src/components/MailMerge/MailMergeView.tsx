import React, { useMemo, useEffect, useState } from 'react';
import Handlebars from 'handlebars';
import useHandlebars from 'hooks/useHandlebars';
import marked from 'marked';
import ReactDOM from 'react-dom';
import Islands from './Islands';

export type IslandConstructor = (parent:Element, context:any) => JSX.Element;

export interface Props {
  template: string;
  context: object;
  style?: object;
  fragmentName?: string;
  fragmentClass?: string;
  onFragmentChanged?: (fragment: string) => void;
  islands?: Record<string, IslandConstructor>
}
const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  flexGrow: 1,

  padding: '4px',
  overflow: 'auto',
  background: '#ffffff',
};

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
        const name = parts[1];
        setProperty(name);
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
    result += key;
    if (value === 'x') {
      result += '\n';
    } else {
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

function compileFragment(
  fragmentName: string,
  className: string,
  template: string
) {
  const tokens = mustacheTokens(template);
  const json = tokensToGraphQLOb(tokens);
  const fragmentBody = jsonToFragmentBody(json);
  return toFragment(fragmentName, className, fragmentBody);
}

function compileTemplate(template: string) {
  try {
    return Handlebars.compile(template);
  } catch (e) {
    const errMsg = `Template error: ${e}`;
    return _ => errMsg;
  }
}

function applyTemplate(
  template: HandlebarsTemplateDelegate<any>,
  context: object
) {
  try {
    return template(context);
  } catch (e) {
    return `#Template apply error:\n   ${e}`;
  }
}

export function microMailMerge(template = '', context?: object | null) {
  if (context && template.indexOf('{{') >= 0) {
    const compiled = compileTemplate(template);
    return applyTemplate(compiled, context);
  }
  return template;
}


export default function MailMergeView(props: Props) {
  useHandlebars();

  const [ref,setRef] = useState<HTMLDivElement|null>(null);

  const compiled = useMemo(() => compileTemplate(marked(props.template)), [
    props.template,
  ]);
  const raw = useMemo(() => applyTemplate(compiled, props.context), [compiled, props.context]);

  const { template, fragmentName, fragmentClass, onFragmentChanged } = props;
  useEffect(() => {
    if (onFragmentChanged && fragmentClass && fragmentName) {
      const fragment = compileFragment(fragmentName, fragmentClass, template);
      onFragmentChanged(fragment);
    }
  }, [template, onFragmentChanged, fragmentClass, fragmentName]);

  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;

  
  return (
    <>
      <div
        className="mail-merge"
        style={style}
        dangerouslySetInnerHTML={{ __html: raw }}
        ref={setRef}
      />
      <Islands
        context={props.context} 
        islands = {props.islands}
        root={ref}
      />
    </>
  );
}
