import * as React from 'react';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import * as FontAwesome from 'react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import withTheme from '../../containers/ThemeProvider';
import { toggleExpander } from 'services/search/actions';
import { connect } from 'react-redux';

interface CollapsiblePanelProps {
  header: string;
  children: React.ReactNode;
  collapsed?: boolean;
  dropdown?: boolean;
  theme?: any;
  toggleExpander:any;
  expander:any;
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
function randomIdentifier() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_'
  const randomChar = () => chars[Math.floor((Math.random() * chars.length))]
  return Array.from({ length: 12 }, randomChar).join('');
}

const randId = randomIdentifier();
const ThemedStyleWrapper = withTheme(StyleWrapper);
const ThemedStyledPanelBody = withTheme(StyledPanelBody);

class CollapsiblePanel extends React.Component<
  CollapsiblePanelProps
  // CollapsiblePanelState
> {
  // state: CollapsiblePanelState = {
  //   summaryVisible: true,
  //   prevCollapsed: false,
  // };

  // static getDerivedStateFromProps = (
  //   props: CollapsiblePanelProps,
  //   state: CollapsiblePanelState
  // ): CollapsiblePanelState | null => {
  //   if (
  //     props.collapsed !== undefined &&
  //     props.collapsed !== state.prevCollapsed
  //   ) {
  //     return {
  //       summaryVisible: !props.collapsed,
  //       prevCollapsed: !!props.collapsed,
  //     };
  //   }

  //   return null;
  // };
  componentDidMount(){
    this.props.collapsed && this.setState({summaryVisible: !this.props.collapsed})
    this.props.expander && this.props.expander[randId] && this.props.toggleExpander(randId, this.props.expander[randId].collapsed);
  }

  render() {
    let initialObject =  {id: randId, collapsed: this.props.collapsed}
    const expanderProps = this.props.expander? this.props.expander[randId] : initialObject
    return (
      <ThemedStyleWrapper {...this.props}>
        <Panel>
          <Panel.Heading
            onClick={() =>{
               this.props.toggleExpander(randId, !expanderProps.collapsed)

              this.setState({ summaryVisible: !expanderProps.collapsed })
            }
          }
            title={
              expanderProps.collapsed
                ? 'Click to hide details'
                :'Click to show details'
            }>
            <Panel.Title
              componentClass="h3"
              className="pull-left"
              style={{ fontSize: '18px', color: '#333' }}>
              <FontAwesome
                name={expanderProps.collapsed
                  ? 'chevron-down' : 'chevron-up'}
                className="pull-left"
                style={{ fontSize: '14px', color: '#333' }}
              />
              {this.props.header}
            </Panel.Title>
            &nbsp;
          </Panel.Heading>
          <Panel.Body style={{display: `${expanderProps.collapsed ? "none":""}`}} >{this.props.children}</Panel.Body>
        </Panel>
      </ThemedStyleWrapper>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  expander: state.search.expanders,
})
const mapDispatchToProps = (dispatch) => ({
  toggleExpander: (id, collapsed) => dispatch(toggleExpander(id, collapsed)),

})
export default connect(mapStateToProps, mapDispatchToProps) (CollapsiblePanel);
