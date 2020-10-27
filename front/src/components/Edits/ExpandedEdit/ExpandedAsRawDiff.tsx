import React from 'react';

import { StudyEditsHistoryQuery_study_wikiPage_edits } from 'types/StudyEditsHistoryQuery';

interface EditProps {
  edit: StudyEditsHistoryQuery_study_wikiPage_edits;
}

const ExpandedAsRawDiff = (props: EditProps) => {
  const { edit } = props;
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: edit.diffHtml || '<p></p>',
      }}
    />
  );
};

export default ExpandedAsRawDiff;
