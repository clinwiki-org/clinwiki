import React from 'react';

import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'services/study/model/StudyEditsHistoryQuery';
import StyleWrapper from './StyleWrapper';
import Edit from './Edit';

interface EditsProps {
  edits: StudyEditsHistoryQuery_study_wikiPage_edits[];
}

const Edits = (props: EditsProps) => {
  const { edits } = props;

  return (
    <StyleWrapper striped bordered>
      <tbody>
        {edits.map((edit, i) => (
          <Edit key={i} edit={edit} />
        ))}
      </tbody>
    </StyleWrapper>
  );
};

export default Edits;
