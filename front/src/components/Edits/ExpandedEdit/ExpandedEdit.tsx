import React from 'react';
import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'types/StudyEditsHistoryQuery';
import ExpandedAsRawDiff from './ExpandedAsRawDiff';
import FrontMatterExpandedEdit from './FrontMatterExpandedEdit';
import WikiExpandedEdit from './WikiExpandedEdit';

interface EditProps {
  edit: StudyEditsHistoryQuery_study_wikiPage_edits;
}

const ExpandedEdit = (props: EditProps) => {
  const { edit } = props;
  const {
    changeSet: { bodyChanged, frontMatterChanged },
  } = edit;

  if (frontMatterChanged) {
    return <FrontMatterExpandedEdit edit={edit} />;
  }
  if (bodyChanged && !frontMatterChanged) {
    return <WikiExpandedEdit edit={edit} />;
  }

  return <ExpandedAsRawDiff edit={edit} />;
};

export default ExpandedEdit;
