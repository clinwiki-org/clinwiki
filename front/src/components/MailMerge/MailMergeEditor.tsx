import * as React from 'react';

interface Props {
  markdown: string;
  style?: object;
  onCursorMove?: (selection: [number, number]) => void;
  onChange: (value: string) => void;
}
const defaultStyle = {
  minWidth: '220px',
  flexGrow: 1,
};

function Editor(props: Props) {
  const onSelect = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onCursorMove?.([e.target.selectionStart, e.target.selectionEnd]);
  };
  const style = props.style
    ? { ...defaultStyle, ...props.style }
    : defaultStyle;
  return (
    <textarea
      spellCheck={false}
      className="mailmerge-editor"
      style={style}
      value={props.markdown}
      onSelect={onSelect}
      onChange={e => props.onChange(e.target.value)}
    />
  );
}
export default Editor;
