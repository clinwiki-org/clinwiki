import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import Handlebars from 'handlebars';

interface Props {
  template: string;
  context: object;
  style?: object;
}
interface State {
  template: string;
  compiled: (a: any) => string;
  markdown: string;
}
const defaultStyle: React.CSSProperties = {
  overflow: 'scroll',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
};

export default class View extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = View.getDerivedStateFromProps(props) as Readonly<State>;
  }
  static getDerivedStateFromProps(props: Props, state?: State): State | undefined {
    if (props.template === state?.template) {
      return { ...state, markdown: state.compiled(props.context) };
    }
    try {
      const template = Handlebars.compile(props.template);
      return {
        template: props.template,
        compiled: template,
        markdown: template(props.context),
      };
    } catch {
      return state;
    }
  }
  render() {
    const style = { ...defaultStyle, ...this.props.style };
    return (
      <div style={style}>
        <ReactMarkdown className="mailmerge-view" source={this.state.markdown} escapeHtml={false} />
      </div>
    );
  }
}
