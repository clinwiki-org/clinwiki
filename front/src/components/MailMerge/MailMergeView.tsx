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
  refetchQuery?:any;
  pageType?:any;
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
  console.log("compiling template", template)
  try {
    return Handlebars.compile(template);
  } catch (e) {
    const errMsg = `Template error: ${e}`;
    return _ => errMsg;
  }
}

function applyTemplate(
  template: HandlebarsTemplateDelegate<any>,
  context?: object,
  pageType?:any
) {
  try {
     context = pageType=="Study"? { ...context, hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL' }
  :{ hash: 'hash', siteViewUrl: "siteViewUrl", pageViewUrl: 'pageViewUrl', q: 'q', ALL: 'ALL', studies: context }
    console.log("Applying template",context)
    console.log(template(context))
    return template(context);
  } catch (e) {
    return `#Template apply error:\n   ${e}`;
  }
}

export function microMailMerge(template = '', context?: object | null) {
  console.log("Micro")
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
  console.log("Comped",compiled)
  console.log(props.pageType)
  const raw = useMemo(() => applyTemplate(compiled, props.context, props.pageType), [
    compiled,
    props.context,
  ]);
console.log("RAW",raw)
  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;

  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
  const islandKeys = new Set(Object.keys(props.islands || {}));
  var instructions = [
    {
      shouldProcessNode: node => islandKeys.has(node.name),
      processNode: (node, children) => {

    //      node.attribs.onChange =()=>{
    //         // props.refetchQuery()
           //  console.log(props.context)
    // }
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
  console.log("Parsing", parser)
  const reactElement = parser.parseWithInstructions(
    raw,
    () => true,
    instructions
  );
 console.log("Creating react element")
  return (
    <div className="mail-merge" style={style}>
      {reactElement}
    </div>
  );
}
