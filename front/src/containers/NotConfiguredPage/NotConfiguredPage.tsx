import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as queryString from 'query-string';

export default class NotConfiguredPage extends React.PureComponent<
  RouteComponentProps
> {
  render() {
    const { subdomain } = queryString.parse(this.props.location.search);
    return <h1>The page you requested could not be found: {subdomain}</h1>;
  }
}
