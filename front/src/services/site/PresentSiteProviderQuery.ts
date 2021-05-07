
const SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT = `
    fragment SiteStudyExtendedGenericSectionFragment on SiteStudyExtendedGenericSection {
        template
        hide
        order
        title
        name
    }
`;

const SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT =  `
    fragment SiteStudyBasicGenericSectionFragment on SiteStudyBasicGenericSection {
        hide
        title
        name
    }
`;

const SITE_STUDY_PAGE_FRAGMENT = `
    fragment SiteStudyPageFragment on SiteStudyPage {
        allFields
        basicSections {
            ...SiteStudyBasicGenericSectionFragment
        }
        extendedSections {
            ...SiteStudyExtendedGenericSectionFragment
        }
    }

    ${SITE_STUDY_BASIC_GENERIC_SECTION_FRAGMENT}
    ${SITE_STUDY_EXTENDED_GENERIC_SECTION_FRAGMENT}
`;

export const SITE_VIEW_FRAGMENT = `
    fragment SiteViewFragment on SiteView {
        name
        url
        id
        default
        description
        study {
            ...SiteStudyPageFragment
        }
        search {
            type
            template
            autoSuggest {
                aggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        autoSuggest
                        rank
                    }
                    selected {
                        kind
                        values
                    }
                }
                crowdAggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        rank
                        autoSuggest
                    }
                    selected {
                        kind
                        values
                    }
                }
            }
            results {
                type
                buttons {
                    items {
                        icon
                        target
                    }
                    location
                }
            }
            crumbs {
                search
            }
            presearch {
                aggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        displayName
                        aggSublabel
                        defaultToOpen
                        layout
                        maxCrumbs
                        bucketKeyValuePairs {
                            key
                            label
                          }
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        autoSuggest
                        rank
                        rangeStartLabel
                        rangeEndLabel
                        showFilterToolbar
                        showAllowMissing
                    }
                    selected {
                        kind
                        values
                    }
                }
                crowdAggs {
                    fields {
                        order {
                            sortKind
                            desc
                        }
                        name
                        display
                        displayName
                        aggSublabel
                        defaultToOpen
                        layout
                        maxCrumbs
                        bucketKeyValuePairs {
                            key
                            label
                          }
                        preselected {
                            kind
                            values
                        }
                        visibleOptions {
                            kind
                            values
                        }
                        rank
                        autoSuggest
                        rangeStartLabel
                        rangeEndLabel
                        showFilterToolbar
                        showAllowMissing
                    }
                    selected {
                        kind
                        values
                    }
                }
                button {
                    name
                    target
                }
                instructions
                showResults
            }
            sortables
            fields
            config {
                fields {
                    showPresearch
                    showFacetBar
                    showAutoSuggest
                    showBreadCrumbs
                    showResults
                }
            }

            aggs {
                fields {
                    order {
                        sortKind
                        desc
                    }
                    name
                    display
                    displayName
                    aggSublabel
                    defaultToOpen
                    layout
                    maxCrumbs
                    bucketKeyValuePairs {
                        key
                        label
                      }
                    preselected {
                        kind
                        values
                    }
                    visibleOptions {
                        kind
                        values
                    }
                    autoSuggest
                    rank
                    rangeStartLabel
                    rangeEndLabel
                    showFilterToolbar
                    showAllowMissing
                }
                selected {
                    kind
                    values
                }
            }
            crowdAggs {
                fields {
                    order {
                        sortKind
                        desc
                    }
                    name
                    display
                    displayName
                    aggSublabel
                    defaultToOpen
                    layout
                    maxCrumbs
                    bucketKeyValuePairs {
                        key
                        label
                    }
                    preselected {
                        kind
                        values
                    }
                    visibleOptions {
                        kind
                        values
                    }
                    rank
                    autoSuggest
                    rangeStartLabel
                    rangeEndLabel
                    showFilterToolbar
                    showAllowMissing
                }
                selected {
                    kind
                    values
                }
            }
        }
    }

    ${SITE_STUDY_PAGE_FRAGMENT}
`;

export const PAGE_VIEW_FRAGMENT = `
    fragment PageViewFragment on PageView {
        id
        url
        title
        default
        template
        pageType
    }
`;

export const PRESENT_SITE_FRAGMENT = `
    fragment PresentSiteFragment on Site {
        id
        editors {
            email
        }
        name
        skipLanding
        subdomain
        defaultHash
        defaultSearchPage
        themes
        reactionsConfig
        userRank
        owners {
            email
        }
        siteView(url: $url) {
            ...SiteViewFragment
        }
        pageView{
           ...PageViewFragment
        }
    }

    ${SITE_VIEW_FRAGMENT}
    ${PAGE_VIEW_FRAGMENT}
`;

export const PRESENT_SITE_QUERY = `
    query PresentSiteProviderQuery($id: Int, $url: String) {
        site(id: $id) {
            ...PresentSiteFragment
        }
    }

    ${PRESENT_SITE_FRAGMENT}
`;

export default PRESENT_SITE_QUERY
