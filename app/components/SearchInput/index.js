/**
*
* SearchInput
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import FontAwesome from 'react-fontawesome';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';

/**
<Button
  style={{ marginLeft: '5px' }}
  title="Choose Columns..."
  onClick={this.props.toggleColumnPickerAction}
>
  <FontAwesome name="table" /> ...
</Button>
<ColumnPicker
  columns={this.props.Search.columns}
  isOpen={this.props.Search.columnPickerOpen}
  onRequestClose={this.props.toggleColumnPickerAction}
  onPickColumn={this.props.pickColumnAction}
/>
*/

class SearchInput extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.query = this.props.query;
  }

  onSearchChange(e) {
    this.query = e.target.value;
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.history.push(`/search/${this.query}`);
    this.props.searchChanged(this.query);
  }

  render() {
    return (
      <Form inline onSubmit={this.onSubmit}>
        <FormGroup controlId="formInlineEmail">
          <FormControl
            style={{ width: '80%' }}
            type="text"
            placeholder="search"
            defaultValue={this.props.query || 'search...'}
            onChange={this.onSearchChange}
          />
          <Button type="submit">
            <FontAwesome name="search" />
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

SearchInput.propTypes = {
  query: PropTypes.string,
  searchChanged: PropTypes.func,
  history: ReactRouterPropTypes.history,
};

export default SearchInput;
