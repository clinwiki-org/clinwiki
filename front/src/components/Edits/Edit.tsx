import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'types/StudyEditsHistoryQuery';
import EditsExpansionContext from './EditsExpansionContext';
import EditBlurb from './EditBlurb';
import ExpandedEdit from './ExpandedEdit';

interface EditProps {
  edit: StudyEditsHistoryQuery_study_wikiPage_edits;
}

const Edit = (props: EditProps) => {
  const { edit } = props;

  return (
    <EditsExpansionContext.Consumer>
      {({ historyExpanded, setHistoryExpanded }) => (
        <tr style={{ padding: '10px' }}>
          <td>
            <EditBlurb
              edit={edit}
              historyExpanded={historyExpanded}
              setExpanded={setHistoryExpanded}
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
    </EditsExpansionContext.Consumer>
  );
};

export default Edit;
