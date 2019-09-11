import * as React from 'react';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { Row, Col } from 'react-bootstrap';
import RichTextEditor, { EditorValue } from 'react-rte-yt';

const notes = 
  RichTextEditor.createValueFromString(`

# ClinWiki Version History

### Version 1
- Filter facet values in site config
- Beta added to logo
- Dynamic study sections
- Country facet
- Release notes added
- Show record count on study page
- First/Last buttons on study page

### Version 0
- Everything else
`, 'markdown');

export default class ReleaseNotes extends React.PureComponent<{},{}> {
    render() {
        return (
        <div>
            <RichTextEditor
                readOnly
                value={notes} />
        </div>);
    }
}
