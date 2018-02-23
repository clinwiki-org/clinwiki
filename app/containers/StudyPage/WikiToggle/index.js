import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  margin-top: 5px;
  padding-right: 15px;
  label{
    font-size: 10px;
  }
`;


class WikiToggle extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.onWikiOverride(this.props.nctId, event.target.checked);
  }

  render() {
    return (
      <ToggleWrapper>
        <div className="clearfix">
          <Toggle
            className="pull-right"
            defaultChecked={this.props.wikiOverride}
            onChange={this.handleChange}
          />
        </div>
        <div className="clearfix">
          <label htmlFor="wgaf" className="pull-right">Wiki Data Enabled</label>
          &nbsp;
        </div>
      </ToggleWrapper>
    );
  }
}

WikiToggle.propTypes = {
  wikiOverride: PropTypes.bool,
  onWikiOverride: PropTypes.func,
  nctId: PropTypes.string,
};

export default WikiToggle;
