import * as React from 'react';
import RichTextEditor from 'react-rte-yt';
import FontAwesome from 'react-fontawesome';

// Wrap RichTextEditor for video support
export default class TextEditor extends React.PureComponent<any> {

  render() {
    return <RichTextEditor {...this.props} />
  }
}

// pass though odd 'static' functions from RichTextEditor
Object.assign(TextEditor,
  ...RichTextEditor
)

