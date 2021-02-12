export const PAGE_VIEW_FRAGMENT = `
fragment PageViewFragment on PageView {
    id
    pageType
    template
    title
    url
    default
  }
`;
export const PAGE_VIEWS_QUERY = `
  query PageViewsQuery($id: Int) {
    site(id: $id) {
      id
      pageViews {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;


export const PAGE_VIEW_QUERY = `
  query PageViewQuery($id: Int, $url: String) {
    site(id: $id) {
      id
      pageView(url: $url) {
        ...PageViewFragment
      }
    }
  }
  ${PAGE_VIEW_FRAGMENT}
`;

export const getSampleStudyQuery = (name: string, frag: string) => {
  frag = frag || `fragment ${name} on Study { nctId }`;
  return `
  query SampleStudyQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...${name}
    }
  }
  ${frag}
`;
};
export const SEARCH_STUDY_PAGE_QUERY =`
query SearchStudyPageQuery($hash: String!, $id: String!) {
  search(searchHash: $hash) {
    studyEdge(id: $id) {
      nextId
      prevId
      firstId
      lastId
      isWorkflow
      workflowName
      study {
        nctId
      }
      recordsTotal
      counterIndex
      firstId
      lastId
    }
  }
}
`;

export const WORKFLOW_PAGE_QUERY = `
  query WorkflowPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        nctId
        meta
        content
      }
      nctId
    }
  }
`;

export const FRAGMENT = `
  fragment CrowdPageFragment on WikiPage {
    nctId
    meta
  }
`;
export const STUDY_SUMMARY_FRAGMENT = `
  fragment StudySummaryFragment on Study {
    acronym
    ages
    averageRating
    baselinePopulation
    biospecDescription
    biospecRetention
    briefSummary
    briefTitle
    collaborators
    completionDate
    completionDateType
    completionMonthYear
    conditions
    contacts
    createdAt
    detailedDescription
    dislikesCount
    dispositionFirstPostedDate
    dispositionFirstPostedDateType
    dispositionFirstSubmittedDate
    dispositionFirstSubmittedQcDate
    eligibilityCriteria
    eligibilityGender
    eligibilityHealthyVolunteers
    enrollment
    enrollmentType
    expandedAccessTypeIndividual
    expandedAccessTypeIntermediate
    expandedAccessTypeTreatment
    firstReceivedDate
    hasDataMonitoringCommittee
    hasDmc
    hasExpandedAccess
    investigators
    ipdAccessCriteria
    ipdTimeFrame
    ipdUrl
    isFdaRegulated
    isFdaRegulatedDevice
    isFdaRegulatedDrug
    isPpsd
    isUnapprovedDevice
    isUsExport
    lastChangedDate
    lastKnownStatus
    lastUpdatePostedDate
    lastUpdatePostedDateType
    lastUpdateSubmittedDate
    lastUpdateSubmittedQcDate
    likesCount
    limitationsAndCaveats
    listedLocationCountries
    nctId
    nlmDownloadDateDescription
    numberOfArms
    numberOfGroups
    officialTitle
    otherStudyIds
    overallStatus
    phase
    planToShareIpd
    planToShareIpdDescription
    primaryCompletionDate
    primaryCompletionDateType
    primaryCompletionMonthYear
    primaryMeasures
    publications
    removedLocationCountries
    responsibleParty
    resultsFirstPostedDate
    resultsFirstPostedDateType
    resultsFirstSubmittedDate
    resultsFirstSubmittedQcDate
    reviewsCount
    reactionsCount {
      name
      count
    }
    secondaryMeasures
    source
    sponsor
    startDate
    startDateType
    startMonthYear
    studyArms
    studyFirstPostedDate
    studyFirstPostedDateType
    studyFirstSubmittedDate
    studyFirstSubmittedQcDate
    studyType
    studyViewCount
    targetDuration
    type
    updatedAt
    verificationDate
    verificationMonthYear
    whyStopped
}
`;
export const CROWD_PAGE_QUERY = `
  query CrowdPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      ...StudySummaryFragment
      wikiPage {
        ...CrowdPageFragment
      }
      nctId
    }
    me {
      id
    }
  }
  ${STUDY_SUMMARY_FRAGMENT}
  ${FRAGMENT}
`;

const WIKI_PAGE_EDIT_FRAGMENT = `
  fragment WikiPageEditFragment on WikiPageEdit {
    user {
      id
      firstName
      lastName
      email
    }
    createdAt
    id
    comment
    diff
    diffHtml
    changeSet {
      bodyChanged
      frontMatterChanged
      editLines {
        status
        content
        frontMatter
        body
      }
    }
  }
`;


export const WIKI_PAGE_FRAGMENT =`
  fragment WikiPageFragment on WikiPage {
    content
    edits {
      ...WikiPageEditFragment
    }
    nctId
    meta
  }
`;

export const WIKI_PAGE_QUERY =`
  query WikiPageQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        ...WikiPageFragment
      }
      nctId
    }
    me {
      id
    }
  }
  ${WIKI_PAGE_EDIT_FRAGMENT}
  ${WIKI_PAGE_FRAGMENT}
`;
export const REVIEW_FRAGMENT = `
  fragment ReviewsPageFragment on Review {
    id
    meta
    content
    createdAt
    user {
      id
      firstName
      lastName
      email
    }
  }
`;
export const REVIEW_PAGE_QUERY =`
query ReviewPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    reviews {
      ...ReviewsPageFragment
    }
    nctId
  }
  me {
    id
  }
}
${REVIEW_FRAGMENT}
`;
export const STUDY_EDITS_HISTORY_QUERY = `
  query StudyEditsHistoryQuery($nctId: String!) {
    study(nctId: $nctId) {
      wikiPage {
        edits {
          id
          createdAt
          changeSet {
            frontMatterChanged
            bodyChanged
            editLines {
              body
              content
              frontMatter
              status
            }
          }
          comment
          diff
          diffHtml
          user {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  }
`;
export const FACILITY_FRAGMENT = `
  fragment FacilityFragment on Facility {
    city
    country
    id
    name
    nctId
    state
    status
    location {
      latitude
      longitude
      status
    }
    zip
    contacts {
      contactType
      email
      id
      name
      nctId
      phone
    }
  }
`;
export const FACILITIES_PAGE_QUERY =`
query FacilitiesPageQuery($nctId: String!) {
  study(nctId: $nctId) {
    facilities {
      ...FacilityFragment   } 
    nctId 
  } 
  me { 
    id 
  } 
}
${FACILITY_FRAGMENT}
`;
export const SUGGESTED_LABELS_QUERY = `
query SuggestedLabelsQuery($nctId: String!, $crowdBucketsWanted: [String!]) {
  crowdAggFacets(crowdBucketsWanted: $crowdBucketsWanted) { 
    aggs {
      name
      buckets {
        key
        keyAsString
        docCount
      }
    }
  }
  study(nctId: $nctId) {
    nctId
    wikiPage {
      nctId
      meta
    }
  }
}
`;

const WORKFLOW_VIEW_PROVIDER_FRAGMENT = `
  fragment WorkflowsViewFragment on WorkflowsView {
    id
    workflows {
      ...WorkflowConfigFragment
    }
  }
  fragment WorkflowConfigFragment on WorkflowConfig {
    allSuggestedLabels
    allWikiSections
    allSummaryFields
    disableAddRating
    hideReviews
    name
    summaryTemplate
    suggestedLabelsFilter {
      kind
      values
    }
    suggestedLabelsConfig {
      name
      rank
      display
      order {
        desc
        sortKind
      }
      visibleOptions {
        kind
        values
      }
    }
    wikiSectionsFilter {
      kind
      values
    }
    summaryFieldsFilter {
      kind
      values
    }
  }
`;
export const WORKFLOW_VIEW_PROVIDER =`
  query WorkflowsViewProviderQuery {
    workflowsView {
      ...WorkflowsViewFragment
    }
  }
  ${WORKFLOW_VIEW_PROVIDER_FRAGMENT}
`;

export const REACTIONS_ISLAND_QUERY =`
query ReactionsIslandQuery($nctId: String!) {
  study(nctId: $nctId) {
    reactionsCount {
      name
      count
    }
    nctId
  }
}

`;
export const REACTION_KINDS =`
query ReactionKinds {
  reactionKinds {
    id
    name
    unicode
  }
}
`;
export const STUDY_REACTIONS =`
  query StudyReactions($nctId: String!) {
    me {
        id
        email
        firstName
        lastName
        reactions(nctId: $nctId){
          id
          reactionKindId
          reactionKind{
            id
            name
            unicode
          }
          study{
            briefTitle
          }
          nctId
        }
    }
  }

`;
export const REACTIONS_QUERY = `
  query ReactionsById($reactionKindId: String!) {
    me {
        id
        email
        firstName
        lastName
        reactions(reactionKindId: $reactionKindId){
          reactionKindId
          reactionKind{
            id
            name
          }
          study{
            briefTitle
          }
          nctId
        }
    }
  }

`;

