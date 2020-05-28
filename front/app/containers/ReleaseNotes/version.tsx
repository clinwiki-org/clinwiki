import * as React from 'react';
import styled from 'styled-components';
import Heading from 'components/Heading';
import { Row, Col } from 'react-bootstrap';
import RichTextEditor, { EditorValue } from 'react-rte-yt';

const notes = RichTextEditor.createValueFromString(
  `

# ClinWiki Version History

### Version 22
- Pwd reset
- new auth header
- map facet types

### Version 21
- [#538](https://github.com/clinwiki-org/clinwiki/issues/538)
- [#540](https://github.com/clinwiki-org/clinwiki/issues/540)
- [#518](https://github.com/clinwiki-org/clinwiki/issues/518)
- [#537](https://github.com/clinwiki-org/clinwiki/issues/537)
- [#398 password reset](https://github.com/clinwiki-org/clinwiki/issues/398)
- [#526 workflow autosuggest](https://github.com/clinwiki-org/clinwiki/issues/526)
- [#530 Facet name config](https://github.com/clinwiki-org/clinwiki/issues/530)

### Version 20
- Export CSV

### Version 19
- Themes!

### Version 18
- Ability to configure sort order in site view
- Bug fixes in wiki history

### Version 17
- Wiki history improvements
- Improve range selector
- Performance improvements on workflow facets

### Version 16
- Bugfix: Facet bar was blank when returning to search from study page

### Version 15
- Support search query by query string q=...
- Temporarily hide workflow facet typo search
- Show range selector in presearch where appropriate

### Version 14
- configurable search views (siteview)

### Version 13
- Support for date and value range filters

### Version 12
- Google OAuth
- Workflow "typo" search functionality

### Version 11
- Bugfixes
- #156 missing facets

### Version 10
- #156 - visible crowd aggs
- Select all in facets
- loading for autocomplete
- Interventions page
- Fix crowd aggs in type ahead

### Version 9
- Facility maps
- Upgraded to typescript 3.7

### Version 8
- Type ahead search based on facet values [#207](https://github.com/clinwiki-org/clinwiki/issues/207)
- Link autosuggest to site config [#223](https://github.com/clinwiki-org/clinwiki/issues/223)

### Version 7
- Fix [#222](https://github.com/clinwiki-org/clinwiki/issues/222) - Study summary

### Version 6
- Merge Owera changes
    - New "Card View" search result option
    - New Mobile friendly study page

### Version 5
- Bugfix for mistyped subdomains
- update puma minor version

### Version 4
- Github dependency upgrade bot

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
`,
  'markdown'
);

export default class ReleaseNotes extends React.PureComponent<{}, {}> {
  render() {
    return (
      <div>
        <RichTextEditor readOnly value={notes} />
      </div>
    );
  }
}
