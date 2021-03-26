import React from 'react';
import { Row, Col, Table } from 'react-bootstrap';

import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'services/study/model/StudyEditsHistoryQuery';

interface EditProps {
  edit: StudyEditsHistoryQuery_study_wikiPage_edits;
}

const FrontMatterExpandedEdit = (props: EditProps) => {
  const {
    edit: {
      changeSet: { editLines },
    },
  } = props;
  const fmLines = editLines.filter(
    ({ frontMatter, content }) => frontMatter && content !== '---'
  );
  const inserts = fmLines.filter(({ status }) => status === 'INS');
  const deletes = fmLines.filter(({ status }) => status === 'DEL');

  const nodes: any[] = [];
  // this only accommodates a single diff right now!
  if (deletes.length > 0) {
    const [fieldName, former] = deletes[0].content.split(/:(.+)/);
    nodes.push(
      <tr className="del" key={`${fieldName}-delete`}>
        <td>-</td>
        <td>{fieldName}</td>
        <td>{former}</td>
      </tr>
    );
  }
  if (inserts.length > 0) {
    const [fieldName, current] = inserts[0].content.split(/:(.+)/);
    nodes.push(
      <tr className="ins" key={`${fieldName}-insert`}>
        <td>+</td>
        <td>{fieldName}</td>
        <td>{current}</td>
      </tr>
    );
  }

  return (
    <Row>
      <Col md={12}>
        <Table className="crowd-diff">
          <thead>
            <tr>
              <th></th>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>{nodes}</tbody>
        </Table>
      </Col>
    </Row>
  );
};

export default FrontMatterExpandedEdit;
