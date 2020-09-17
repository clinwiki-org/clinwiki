import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import EditBlurb from './EditBlurb';
import ExpandedEdit from './ExpandedEdit';

interface EditProps {
  edit: WikiPageEditFragment;
}

const Edit = (props: EditProps) => {
  const [expanded, setExpanded] = useState(false);
  const { edit } = props;

  return (
          <tr style={{ padding: '10px' }}>
            <td>
              <EditBlurb
                edit={edit}
                expanded={expanded}
                setExpanded={setExpanded}
              />
              {expanded ? (
                <Row style={{ padding: '10px', marginBottom: '10px' }}>
                  <Col md={12}>
                    <ExpandedEdit edit={edit} />
                  </Col>
                </Row>
              ) : null}
            </td>
          </tr>
        );
}

export default Edit;
