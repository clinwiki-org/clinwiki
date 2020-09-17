import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import ExpansionContext from 'containers/WikiPage/ExpansionContext';
import EditBlurb from './EditBlurb';
import ExpandedEdit from './ExpandedEdit';

interface EditProps {
  edit: WikiPageEditFragment;
}

const Edit = (props: EditProps) => {
  const { edit } = props;

  return (
    <tr style={{ padding: '10px' }}>
      <td>
        <ExpansionContext.Consumer>
          {({ historyExpanded, toggleEditVisibility }) => {
            const expanded = historyExpanded[edit.id];
            const nodes = [
              <EditBlurb
                edit={edit}
                expanded={expanded}
                setExpanded={toggleEditVisibility(edit.id)}
              />,
            ];

            if (expanded) {
              nodes.push(
                <Row style={{ padding: '10px', marginBottom: '10px' }}>
                  <Col md={12}>
                    <ExpandedEdit edit={edit} />
                  </Col>
                </Row>
              );
            }
            return nodes;
          }}
        </ExpansionContext.Consumer>
      </td>
    </tr>
  );
}

export default Edit;
