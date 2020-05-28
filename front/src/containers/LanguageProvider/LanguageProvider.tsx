import * as React from 'react';
import { IntlProvider } from 'react-intl';

interface LanguageProviderProps {
  locale: string;
  messages: {};
  children: React.ReactNode;
}

export class LanguageProvider extends React.PureComponent<
  LanguageProviderProps
> {
  render() {
    return (
      <IntlProvider
        locale={this.props.locale}
        key={this.props.locale}
        messages={this.props.messages[this.props.locale]}>
        {React.Children.only(this.props.children)}
      </IntlProvider>
    );
  }
}

export default LanguageProvider;
