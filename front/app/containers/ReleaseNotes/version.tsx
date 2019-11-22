import * as React from 'react';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { Row, Col } from 'react-bootstrap';
import RichTextEditor, { EditorValue } from 'react-rte-yt';

const notes = 
  RichTextEditor.createValueFromString(`

# ClinWiki Version History

### Version 3
- Bulk edit feature
- Handle returns in extra data of studies #173
- Bugfix #189 unable to 'hide section' on study page configuration
- Bugfix #164 crowd facets not filtering with selections properly
- Feature ##171 Enable subsites config to start on search page
- Reduce sidekick timer to 5 seconds
- Fixed source maps
- Bugfix #160 facet filter list for subsite/workflow not displaying all options
- CTG: facet sorting

### Version 2
- Add /voyager to debug builds for exploring graphql schema
- Add link to NCT ID to address issue #162 - thanks rarbuthnot

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
