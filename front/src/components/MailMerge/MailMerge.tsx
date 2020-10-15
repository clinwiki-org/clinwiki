import React, { useState } from 'react';
import SchemaSelector, { SchemaType } from './SchemaSelector';
import View, { Props as ViewProps } from './MailMergeView';
import Editor from './MailMergeEditor';
import useUrlParams from 'utils/UrlParamsProvider';

// MailMerge props includes all ViewProps except context is renamed to sample
interface Props extends Omit<ViewProps, 'context'> {
  schema: SchemaType;
  sample?: object;
  onTemplateChanged: (template: string) => void;
}

const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  background: '#ccc',
};

export default function MailMerge(props: Props) {
  const template = props.template;
  const len = props.template.length;
  const [cursorPosition, setCursorPosition] = useState([len, len]);
  const insertSchemaItem = (templateString: string) => {
    const before = template.slice(0, cursorPosition[0]);
    const after = template.slice(cursorPosition[1]);
    props.onTemplateChanged(before + templateString + after);
  };
  const style = { ...defaultStyle, ...props.style };
  const urlParams = useUrlParams()
  const queryStringParams = new Set(Object.keys(urlParams || {}));
  return (
    <>
      <div style={style}>
        <SchemaSelector schema={props.schema} onSelectItem={insertSchemaItem} />
        <Editor
          markdown={template}
          onChange={props.onTemplateChanged}
          onCursorMove={setCursorPosition}
        />
      </div>
      <View
        style={{border: '2px solid black'}}
        template={template}
        context={props.sample}
        fragmentName={props.fragmentName}
        fragmentClass={props.fragmentClass}
        onFragmentChanged={props.onFragmentChanged}
        islands={props.islands}
      />
    </>
  );
}
