import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import messages from './messages';

export default class NotFound extends React.PureComponent {
  render() {
    return (
      <h1>
        <FormattedMessage {...messages.header} />
      </h1>
    );
  }
}
