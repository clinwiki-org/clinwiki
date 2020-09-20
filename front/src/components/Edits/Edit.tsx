import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import EditBlurb from './EditBlurb';
import ExpandedEdit from './ExpandedEdit';
import ExpansionContext from 'containers/Islands/EditsHistoryIsland/ExpansionContext';

interface EditProps {
  edit: WikiPageEditFragment;
}

const Edit = (props: EditProps) => {
  const { edit } = props;

  return (
    <ExpansionContext.Consumer>
      {({ historyExpanded, setHistoryExpanded }) => (
        <tr style={{ padding: '10px' }}>
          <td>
            <EditBlurb
              edit={edit}
              expanded={historyExpanded[edit.id]}
              setExpanded={setHistoryExpanded({
                ...historyExpanded,
                [edit.id]: true,
              })}
            />
            {historyExpanded[edit.id] ? (
              <Row style={{ padding: '10px', marginBottom: '10px' }}>
                <Col md={12}>
                  <ExpandedEdit edit={edit} />
                </Col>
              </Row>
            ) : null}
          </td>
        </tr>
      )}
    </ExpansionContext.Consumer>
  );
};

export default Edit;
