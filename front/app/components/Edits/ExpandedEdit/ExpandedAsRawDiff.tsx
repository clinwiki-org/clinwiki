import * as React from "react";

import {
  WikiPageEditFragment,
} from 'types/WikiPageEditFragment';

interface EditProps {
  edit: WikiPageEditFragment;
}

class ExpandedAsRawDiff extends React.Component<EditProps> {
  render() {
    const { edit } = this.props;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: edit.diffHtml || '<p></p>',
        }}
      />
    )
  }
}

export default ExpandedAsRawDiff;
