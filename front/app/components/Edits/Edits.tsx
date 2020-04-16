import * as React from 'react';
import {
  WikiPageEditFragment,
} from 'types/WikiPageEditFragment';
import StyleWrapper from "./StyleWrapper";
import Edit from "./Edit";

interface EditsProps {
  edits: WikiPageEditFragment[];
}


class Edits extends React.Component<EditsProps> {
  render() {
    const { edits } = this.props
    return (
      <StyleWrapper striped bordered>
        <tbody>
          {edits.map((edit, i) => (
            <Edit key={i} edit={edit} />
          ))}
        </tbody>
      </StyleWrapper>
    );
  }
}

export default Edits;
