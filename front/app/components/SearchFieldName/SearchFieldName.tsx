import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

interface SearchFieldNameProps {
  field?: any;
}

const SearchFieldName = (props: SearchFieldNameProps) =>
  messages[props.field] ? (
    <FormattedMessage {...messages[props.field]} />
  ) : (
    props.field
  );

export default SearchFieldName;
