import * as React from 'react';
import RichTextEditor from 'react-rte';
import FontAwesome from 'react-fontawesome';

// Wrap RichTextEditor for video support
export default class TextEditor extends React.PureComponent<any> {

  render() {
    // Add 'react-rte' button to insert video
    // render by passing blockRenderMap though
    // extra props pass though to draft-js Editor
    return <RichTextEditor {...this.props} />
  }
}

// pass though odd 'static' functions from RichTextEditor
Object.assign(TextEditor,
  ...RichTextEditor
)

