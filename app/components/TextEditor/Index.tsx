import * as React from 'react';
import RichTextEditor from 'react-rte-yt';

// Wrap RichTextEditor for video support
export default class TextEditor extends React.PureComponent<any> {
  render() {
    return <RichTextEditor {...this.props} />
  }
}

interface ViewMarkdownProps { 
  markdown? : string
  value? : any
}
interface ViewMarkdownState { value : any }
export class ViewMarkdown extends React.Component<ViewMarkdownProps, ViewMarkdownState> {
  constructor(props) {
    super(props);
    this.state = { 
      value: RichTextEditor.createValueFromString(props.markdown||"", 'markdown')
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.markdown != nextProps.markdown) {
      this.setState({
        value: RichTextEditor.createValueFromString(nextProps.markdown||"", 'markdown')
      });
    }
  }
  render() {
    return <RichTextEditor readOnly={true} value={this.props.value || this.state.value} />
  }
}

// pass though odd 'static' functions from RichTextEditor
Object.assign(TextEditor,
  ...RichTextEditor
)

