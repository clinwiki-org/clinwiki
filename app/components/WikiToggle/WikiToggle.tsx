import * as React from 'react';
import Toggle from 'react-toggle';
import styled from 'styled-components';

interface WikiToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleWrapper = styled.div`
  margin-top: 5px;
  padding-right: 15px;
  label {
    font-size: 10px;
  }
  .react-toggle-track {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .react-toggle-thumb {
    border: 0px;
    background: #55b88d;
  }
`;

class WikiToggle extends React.PureComponent<WikiToggleProps> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange && this.props.onChange(event.target.checked);
  };

  render() {
    return (
      <ToggleWrapper>
        <div className="clearfix">
          <Toggle
            className="pull-right"
            defaultChecked={this.props.value}
            onChange={this.handleChange}
          />
        </div>
        <div className="clearfix">
          <label htmlFor="wgaf" className="pull-right">
            Wiki Data {this.props.value ? 'Enabled' : 'Disabled'}
          </label>
          &nbsp;
        </div>
      </ToggleWrapper>
    );
  }
}

export default WikiToggle;
