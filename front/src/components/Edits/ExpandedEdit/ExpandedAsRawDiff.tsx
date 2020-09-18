import * as React from 'react';

import { WikiPageEditFragment } from 'types/WikiPageEditFragment';

interface EditProps {
  edit: WikiPageEditFragment;
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
}

export default ExpandedAsRawDiff;
