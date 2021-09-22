import * as React from 'react';
import { Col, Modal } from 'react-bootstrap';
import styledComponents from 'styled-components';
import { Link } from 'react-router-dom';
import { defaultTo } from 'ramda';
import ThemedButton from 'components/StyledComponents/index';
import * as FontAwesome from 'react-fontawesome';


const LabelSpan = styledComponents.span`
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: 1px solid #ccc;
  padding: 5px;
  top: -25px;
  position: absolute;
  left: 1em;
  color: black;
  background: white;
  border-radius: 4px;
  font-size: 0.85em;
`;

interface LabeledButtonState {
  showLabel?: Boolean;
}

interface LabeledButtonProps {
  helperText?: string;
  theClick?: any;
  iconName?: string;
  theType?: string;
  buttonTitle?: string;
}

class LabeledButton extends React.PureComponent<LabeledButtonProps, LabeledButtonState> {

  state = {
    showLabel: false,
  };

  setShowLabel = () => {
    //console.log(this.state.showLabel)
    this.setState({
      showLabel: !this.state.showLabel,
    });
  };


  render() {
    const { helperText, theClick, iconName, theType, buttonTitle } = this.props;

    return (
      <ThemedButton
        type={theType}
        className="labeled-btn"
        onClick={theClick}
        onMouseEnter={() => this.setShowLabel()}
        onMouseLeave={() => this.setShowLabel()}>
        {this.state.showLabel ? <LabelSpan>{helperText}</LabelSpan> : null}
        &nbsp;
        <FontAwesome name={iconName} />
        &nbsp; {buttonTitle}
      </ThemedButton>

    );
  }
}

export default LabeledButton;
