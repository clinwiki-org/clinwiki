import React, { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import { Row, Col, Button } from 'react-bootstrap';

import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'types/StudyEditsHistoryQuery';

interface EditProps {
  edit: StudyEditsHistoryQuery_study_wikiPage_edits;
}

const WikiExpandedEdit = (props: EditProps) => {
  const [hoveredLine, setHoveredLine] = useState(null);
  /**
   * Only show a line on either side for context
   * by default for line-by-line change.
   */
  const [lineVisible, setLineVisible] = useState(() => {
    const { edit } = props;
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
  });

  const expandSpans = (start, end) => () => {
    const lineVisibleUpdate = {};
    for (let i = start; i <= end; i++) {
      lineVisibleUpdate[i] = true;
    }
    setLineVisible(lineVisibleUpdate);
  };

  const hoveredOpts = (key, className = '') => ({
    key,
    className: `${className}${hoveredLine === key ? ' hovered' : ''}`,
    onMouseEnter: () => setHoveredLine(key),
    onMouseLeave: () => setHoveredLine(null),
  });

  const hasInvisibleLines = () => {
    for (let i = 0; i < Object.keys(lineVisible).length; i++) {
      if (!lineVisible[i]) {
        return true;
      }
    }
    return false;
  };

  const {
    edit: {
      changeSet: { editLines },
    },
  } = props;
  const invisibleLines = hasInvisibleLines();
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
          <li {...hoveredOpts(i - 1)}>
            <button
              className="diff-expander"
              onClick={expandSpans(firstInvisible, i - 1)}>
              <FontAwesome name="arrows" />
            </button>
          </li>
        );
        nodes.push(<li {...hoveredOpts(i - 1)}>&nbsp;</li>);
        firstInvisible = null;
      }
      actions.push(<li {...hoveredOpts(i, line.status.toLowerCase())} />);
      nodes.push(
        <li {...hoveredOpts(i, line.status.toLowerCase())}>{line.content}</li>
      );
    } else {
      firstInvisible = firstInvisible || i;
    }
  });
  if (firstInvisible !== null) {
    const key = editLines.length + 1;
    actions.push(
      <li {...hoveredOpts(key)}>
        <button
          className="diff-expander"
          onClick={expandSpans(firstInvisible, editLines.length)}>
          <FontAwesome name="arrows" />
        </button>
      </li>
    );
    nodes.push(<li {...hoveredOpts(key)}> </li>);
  }
  return (
    <Row>
      <Col md={1} className="diff-action-column">
        <div className="diff">
          <ul>{actions}</ul>
        </div>
      </Col>
      <Col md={10} className="diff-column">
        <div className="diff">
          <ul className="diff-lines">{nodes}</ul>
        </div>
      </Col>
      <Col md={1}>
        {invisibleLines && (
          <Button
            bsSize="xsmall"
            onClick={expandSpans(0, editLines.length + 1)}>
            Expand All
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default WikiExpandedEdit;
