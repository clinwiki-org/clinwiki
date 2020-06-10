import * as React from 'react';
import SchemaSelector, { SchemaType, JsonSchema } from './SchemaSelector';
import View from './MailMergeView';
import Editor from './MailMergeEditor';

interface Props {
  schemaType?: SchemaType;
  schema: JsonSchema;
  sample: object;
  style?: object;
  template: string;
  onTemplateChanged?: (template: string) => void;
}

interface State {
  template: string;
  cursorPosition: [number, number];
}

const defaultStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  background: '#ccc',
};

export default class MailMerge extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    const len = props.template.length;
    this.state = { template: props.template, cursorPosition: [len, len] };
  }
  setTemplate = (s: string) => {
    this.setState({ template: s });
    if (this.props.onTemplateChanged) {
      this.props.onTemplateChanged(s);
    }
  };
  updateCursorPos = (position: [number, number]) =>
    this.setState({ cursorPosition: position });
  insertSchemaItem = (templateString: string) => {
    const template = this.state.template;
    const before = template.slice(0, this.state.cursorPosition[0]);
    const after = template.slice(this.state.cursorPosition[1]);
    this.setTemplate(before + templateString + after);
  };
  render() {
    const style = { ...defaultStyle, ...this.props.style };
    return (
      <div style={style}>
        <SchemaSelector
          schemaType={this.props.schemaType}
          schema={this.props.schema}
          onSelectItem={this.insertSchemaItem}
        />
        <Editor
          markdown={this.state.template}
          onChange={this.setTemplate}
          onCursorMove={this.updateCursorPos}
        />
        <View template={this.state.template} context={this.props.sample} />
      </div>
    );
  }
}
