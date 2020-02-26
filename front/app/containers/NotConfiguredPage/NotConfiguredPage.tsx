import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';
import messages from './messages';

export default class NotConfiguredPage extends React.PureComponent<
  RouteComponentProps
> {
  render() {
    const { subdomain } = queryString.parse(this.props.location.search);
    return (
      <h1>
        <FormattedMessage {...messages.header} values={{ subdomain }} />
      </h1>
    );
  }
}
