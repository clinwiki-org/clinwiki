import * as React from 'react';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import withTheme from '../../containers/ThemeProvider';

interface CollapsiblePanelProps {
  header: string;
  children: React.ReactNode;
  collapsed?: boolean;
  dropdown?: boolean;
  theme?: any;
}

interface CollapsiblePanelState {
  summaryVisible: boolean;
  prevCollapsed: boolean;
}

const StyleWrapper = styled.div`
  .panel-heading {
    cursor: pointer;
    ${(props: CollapsiblePanelProps) =>
      props.dropdown
        ? `background: ${props.theme.button}; padding: 10px 15px !important; color: #333;`
        : ''}
  }
`;

const StyledPanelBody = styled.div`
  transition: all 0.2s ease-in;
  overflow: hidden;
  max-height: 0;
  &.transition-enter {
    max-height: 0;
  }
  &.transition-enter-active {
    max-height: 400px;
  }
  &.transition-enter-done {
    max-height: none;
  }
  &.transition-exit {
    max-height: 400px;
  }
  &.transition-exit-active {
    max-height: 0;
  }
  &.transition-exit-done {
    max-height: 0;
  }
`;

const ThemedStyleWrapper = withTheme(StyleWrapper);
const ThemedStyledPanelBody = withTheme(StyledPanelBody);

class CollapsiblePanel extends React.Component<
  CollapsiblePanelProps,
  CollapsiblePanelState
> {
  state: CollapsiblePanelState = {
    summaryVisible: true,
    prevCollapsed: false,
  };

  static getDerivedStateFromProps = (
    props: CollapsiblePanelProps,
    state: CollapsiblePanelState
  ): CollapsiblePanelState | null => {
    if (
      props.collapsed !== undefined &&
      props.collapsed !== state.prevCollapsed
    ) {
      return {
        summaryVisible: !props.collapsed,
        prevCollapsed: !!props.collapsed,
      };
    }

    return null;
  };

  render() {
    return (
      <ThemedStyleWrapper {...this.props}>
        <Panel>
          <Panel.Heading
            onClick={() =>
              this.setState({ summaryVisible: !this.state.summaryVisible })
            }
            title={
              this.state.summaryVisible
                ? 'Click to hide details'
                : 'Click to show details'
            }>
            <Panel.Title
              componentClass="h3"
              className="pull-left"
              style={{ fontSize: '18px', color: '#333' }}>
              <FontAwesome
                name={this.state.summaryVisible ? 'chevron-up' : 'chevron-down'}
                className="pull-left"
                style={{ fontSize: '14px', color: '#333' }}
              />
              {this.props.header}
            </Panel.Title>
            &nbsp;
          </Panel.Heading>
          <CSSTransition
            in={this.state.summaryVisible}
            timeout={200}
            appear
            classNames="transition">
            <ThemedStyledPanelBody>
              <Panel.Body>{this.props.children}</Panel.Body>
            </ThemedStyledPanelBody>
          </CSSTransition>
        </Panel>
      </ThemedStyleWrapper>
    );
  }
}

export default CollapsiblePanel;
