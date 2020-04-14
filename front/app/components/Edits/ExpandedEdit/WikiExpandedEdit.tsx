import * as React from 'react';
import * as FontAwesome from 'react-fontawesome';
import { Row, Col } from 'react-bootstrap';

import { WikiPageEditFragment } from 'types/WikiPageEditFragment';

interface EditProps {
  edit: WikiPageEditFragment;
}

interface EditState {
  lineVisible: any;
  hoveredLine: number | null;
}

class WikiExpandedEdit extends React.Component<EditProps, EditState> {
  state = {
    lineVisible: {},
    hoveredLine: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      lineVisible: this.prepareSpans(),
      hoveredLine: null,
    };
  }

  /**
   * Only show a line on either side for context
   * by default for line-by-line change.
   */
  prepareSpans = () => {
    const { edit } = this.props;
    let lastWasChange = false;
    const lineVisible = {};
    edit.changeSet.editLines.forEach((line, i) => {
      if (line.status !== 'UNCHANGED') {
        lineVisible[i - 1] = true;
        lineVisible[i] = true;
        lastWasChange = true;
      } else if (lastWasChange) {
        lineVisible[i] = true;
        lastWasChange = false;
      } else {
        lineVisible[i] = false;
      }
    });
    return lineVisible;
  };

  expandSpans = (start, end) => () => {
    const lineVisibleUpdate = {};
    for (let i = start; i <= end; i++) {
      lineVisibleUpdate[i] = true;
    }
    this.setState({
      lineVisible: { ...this.state.lineVisible, ...lineVisibleUpdate },
    });
  };

  hoveredOpts = (key, className = '') => ({
    key,
    className: `${className}${
      this.state.hoveredLine === key ? ' hovered' : ''
    }`,
    onMouseEnter: () => {
      console.log(key);
      this.setState({ ...this.state, hoveredLine: key });
    },
    onMouseLeave: () => this.setState({ ...this.state, hoveredLine: null }),
  });

  render() {
    const {
      edit: {
        changeSet: { editLines },
      },
    } = this.props;
    const { lineVisible, hoveredLine } = this.state;
    const nodes: any[] = [];
    const actions: any[] = [];
    let firstInvisible: number | null = null;
    editLines.forEach((line, i) => {
      if (line.frontMatter || line.content === '---') {
        // skip front matter
        return;
      }
      if (lineVisible[i]) {
        if (firstInvisible !== null && i > firstInvisible) {
          actions.push(
            <li {...this.hoveredOpts(i - 1)}>
              <button
                className="diff-expander"
                onClick={this.expandSpans(firstInvisible, i - 1)}>
                <FontAwesome name="arrows" />
              </button>
            </li>
          );
          nodes.push(<li {...this.hoveredOpts(i - 1)}>&nbsp;</li>);
          firstInvisible = null;
        }
        actions.push(
          <li {...this.hoveredOpts(i, line.status.toLowerCase())} />
        );
        nodes.push(
          <li {...this.hoveredOpts(i, line.status.toLowerCase())}>
            {line.content}
          </li>
        );
      } else {
        firstInvisible = firstInvisible || i;
      }
    });
    if (firstInvisible !== null) {
      const key = editLines.length + 1;
      actions.push(
        <li {...this.hoveredOpts(key)}>
          <button
            className="diff-expander"
            onClick={this.expandSpans(firstInvisible, editLines.length)}>
            <FontAwesome name="arrows" />
          </button>
        </li>
      );
      nodes.push(<li {...this.hoveredOpts(key)}> </li>);
    }
    return (
      <Row>
        <Col md={1} className="diff-action-column">
          <div className="diff">
            <ul>{actions}</ul>
          </div>
        </Col>
        <Col md={11} className="diff-column">
          <div className="diff">
            <ul className="diff-lines">{nodes}</ul>
          </div>
        </Col>
      </Row>
    );
  }
}

export default WikiExpandedEdit;
