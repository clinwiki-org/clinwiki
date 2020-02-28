import * as React from 'react';

interface Props {
  markdown: string;
  style?: object;
  onCursorMove?: (selection: [number, number]) => void;
  onChange: (value: string) => void;
}
const defaultStyle = {};

export default class Editor extends React.PureComponent<Props> {
  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.props.onChange(e.target.value);
  };
  onSelect = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (this.props.onCursorMove) {
      this.props.onCursorMove([e.target.selectionStart, e.target.selectionEnd]);
    }
  };
  render() {
    const style = this.props.style ? { ...defaultStyle, ...this.props.style } : defaultStyle;
    return (
      <textarea
        spellCheck={false}
        className="mailmerge-editor"
        style={style}
        value={this.props.markdown}
        onSelect={this.onSelect}
        onChange={this.onChange}
      />
    );
  }
}
