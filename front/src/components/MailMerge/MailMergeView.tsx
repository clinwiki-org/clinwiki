import React, { useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Handlebars from 'handlebars';
import { registerHandlebarsHelpers } from './MailMergeHelpers';
import useHandlebars from 'hooks/useHandlebars';

interface Props {
  template: string;
  context: object;
  style?: object;
  fragmentClass?: string;
  onFragmentChanged?: (fragment: string) => void;
}
interface State {
  template: string;
  compiled: (a: any) => string;
  markdown: string;
}
const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  flexGrow: 1,

  padding: '4px',
  overflow: 'scroll',
  background: '#ffffff',
};

function compileFragment(template: string) {
  // extract strings
  return 'fuck you';
}

function compileTemplate(template: string) {
  try {
    return Handlebars.compile(template);
  } catch (e) {
    const errMsg = `Template error: ${e}`;
    return _ => errMsg;
  }
}

function handleTemplateChanged(props: Props) {
  const { template, fragmentClass, onFragmentChanged } = props;
  const compiled = compileTemplate(template);
  if (onFragmentChanged) {
    const fragment = compileFragment(template);
    onFragmentChanged(fragment);
  }
  return compiled;
}

export default function View(props: Props) {
  useHandlebars();
  const compiled = useMemo(() => handleTemplateChanged(props), [
    props.template,
  ]);

  // Note: We can make this faster by compiling markdown->html before applying the template
  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;
  const markdown = compiled(props.context);
  return (
    <div className="mail-merge" style={style}>
      <ReactMarkdown
        className="mailmerge-view"
        source={markdown}
        escapeHtml={false}
      />
    </div>
  );
}
