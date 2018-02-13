/**
*
* SearchFieldName
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import messages from './messages';


const SearchFieldName = (props) => messages[props.field] ? (<FormattedMessage {...messages[props.field]} />) : props.field;

SearchFieldName.propTypes = {
  field: PropTypes.string,
};

export default SearchFieldName;
