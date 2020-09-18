import * as React from 'react';
import { WikiPageEditFragment } from 'types/WikiPageEditFragment';
import StyleWrapper from './StyleWrapper';
import Edit from './Edit';

interface EditsProps {
  edits: WikiPageEditFragment[];
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
}

export default Edits;
