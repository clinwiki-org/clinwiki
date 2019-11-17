
# ClinWiki Manual Test Plan

# Search Page
* Selecting a facet value does not filter other values for the same facet.  i.e. selecting one city does not filter other cities.
    - Test both crowd and non-crowd facets
* Search in the search bar
* Remove breadcrumbs
    - Confirm search and facet checkboxes update apropriately
* Sort by various columns
* Click though to study

### Facets
* facets and crowd facets are filtered by search term
* facets are filtered by crowd facets
* crowd facets are filtered by main facets
* Search is not lost when adding/removing facets

### Url
* Refreshing page does not lose
    - search term
    - facets / crowd facets
* Navigating to a study and back does not lose
    - search term
    - facets / crowd facets

# Study Page
* Click through all sections

## Edits
* Wiki
    - Enter a new section
    - Add link, image, video and confirm save behavior
* Crowd + tags
    - Add crowd tag and confirm search updates
    - Remove crowd tag and confirm search updates
* Review

# Workflows
* config: 'hide sections'
* search
* save

# Sites configuration
* 

# Version
- [ ] Has version information been added to http://staging.clinwiki.org/release
