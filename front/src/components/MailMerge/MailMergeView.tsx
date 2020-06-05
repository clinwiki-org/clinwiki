import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';
import Handlebars from 'handlebars';
import { registerHandlebarsHelpers } from './MailMergeHelpers';

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
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'left',
  flexGrow: 1,

  padding: '4px',
  overflow: 'scroll',
  background: '#ffffff',
};

export default class View extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    registerHandlebarsHelpers();
    this.state = View.getDerivedStateFromProps(props) as Readonly<State>;
  }
  static getDerivedStateFromProps(
    props: Props,
    state?: State
  ): State | undefined {
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
    } catch (e) {
      const errMsg = `Template error:\n${e}`;
      return (
        state || {
          template: props.template,
          compiled: _ => errMsg,
          markdown: errMsg,
        }
      );
    }
  }
  render() {
    const style = { ...defaultStyle, ...this.props.style };
    return (
      <div className="mail-merge" style={style}>
        <ReactMarkdown
          className="mailmerge-view"
          source={this.state.markdown}
          escapeHtml={false}
        />
      </div>
    );
  }
}
