import React, { useState } from 'react';
import SchemaSelector, { SchemaType } from './SchemaSelector';
import View from './MailMergeView';
import Editor from './MailMergeEditor';

interface Props {
  schema: SchemaType;
  sample: object;
  style?: object;
  template: string;
  onTemplateChanged?: (template: string) => void;
  onFragmentChanged?: (fragment: string) => void;
}

const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  background: '#ccc',
};

export default function MailMerge(props: Props) {
  const [template, setTemplate] = useState(props.template);
  const len = props.template.length;
  const [cursorPosition, setCursorPosition] = useState([len, len]);
  const updateTemplate = (s: string) => {
    setTemplate(s);
    props.onTemplateChanged?.(s);
  };
  const insertSchemaItem = (templateString: string) => {
    const before = template.slice(0, cursorPosition[0]);
    const after = template.slice(cursorPosition[1]);
    updateTemplate(before + templateString + after);
  };
  const style = { ...defaultStyle, ...props.style };
  return (
    <div style={style}>
      <SchemaSelector schema={props.schema} onSelectItem={insertSchemaItem} />
      <Editor
        markdown={template}
        onChange={setTemplate}
        onCursorMove={setCursorPosition}
      />
      <View template={template} context={props.sample} onFragmentChanged={props.onFragmentChanged} />
    </div>
  );
}
