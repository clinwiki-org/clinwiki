import * as React from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import DeleteSiteMutation from 'mutations/DeleteSiteMutations';

interface EditProps {
  edit: WikiPageEditFragment;
}

class FrontMatterExpandedEdit extends React.Component<EditProps> {
  render() {
    const {
      edit: {
        changeSet: { editLines },
      },
    } = this.props;
    const fmLines = editLines.filter(({ frontMatter }) => frontMatter);
    const inserts = fmLines.filter(({ status }) => status === 'INS');
    const deletes = fmLines.filter(({ status }) => status === 'DEL');

    const nodes: any[] = [];
    // this only accommodates a single diff right now!
    if (deletes.length > 0) {
      const [fieldName, former] = deletes[0].content.split(/:(.+)/);
      nodes.push(
        <tr className="del">
          <td>-</td>
          <td>{fieldName}</td>
          <td>{former}</td>
        </tr>
      );
    }
    if (inserts.length > 0) {
      const [fieldName, current] = inserts[0].content.split(/:(.+)/);
      nodes.push(
        <tr className="ins">
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
              <th></th>
              <th>Field</th>
              <th>Value</th>
            </thead>
            <tbody>{nodes}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}

export default FrontMatterExpandedEdit;
