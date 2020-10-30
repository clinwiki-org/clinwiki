import React, { useMemo, useEffect } from 'react';
import Handlebars from 'handlebars';
import useHandlebars from 'hooks/useHandlebars';
import marked from 'marked';
import HtmlToReact from 'html-to-react';

export type IslandConstructor = (
  attributes: Record<string, string>,
  context?: object,
  parent?: any
) => JSX.Element;

export interface Props {
  template: string;
  context?: object;
  style?: object;
  islands?: Record<string, IslandConstructor>;
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
  context?: object
) {
  try {
    context = {...context, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL'}
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

  const compiled = useMemo(() => compileTemplate(marked(props.template)), [
    props.template,
  ]);
  const raw = useMemo(() => applyTemplate(compiled, props.context), [
    compiled,
    props.context,
  ]);

  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;

  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const islandKeys = new Set(Object.keys(props.islands || {}));
  var instructions = [
    {
      shouldProcessNode: node => islandKeys.has(node.name),
      processNode: (node, children) => {
        const create = props.islands?.[node.name];
        return (
          <div
            className="mail-merge-island"
            key={node.attribs['key'] || node.name}>
            {create?.(node.attribs, props.context, children)}
          </div>
        );
      },
    },
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];
  const parser = new HtmlToReact.Parser();
  const reactElement = parser.parseWithInstructions(
    raw,
    () => true,
    instructions
  );

  return (
    <div className="mail-merge" style={style}>
      {reactElement}
    </div>
  );
}
