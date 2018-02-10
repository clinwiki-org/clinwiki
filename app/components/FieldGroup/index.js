import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const FieldGroup = (props) => (
  <FormGroup controlId={props.id}>
    <ControlLabel>{props.label}</ControlLabel>
    <FormControl {...props} />
    {props.help && <HelpBlock>{props.help}</HelpBlock>}
  </FormGroup>
);

FieldGroup.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  help: PropTypes.string,
};

export default FieldGroup;
