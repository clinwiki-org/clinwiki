/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Diff } from "./globalTypes";

// ====================================================
// GraphQL query operation: StudyPagePrefetchQuery
// ====================================================

export interface StudyPagePrefetchQuery_study_reactionsCount {
  __typename: "ExpressionCount";
  name: string;
  count: number;
}

export interface StudyPagePrefetchQuery_study_wikiPage_edits_user {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Email
   */
  email: string;
}

export interface StudyPagePrefetchQuery_study_wikiPage_edits_changeSet_editLines {
  __typename: "WikiPageEditLine";
  /**
   * The type of diff line.
   */
  status: Diff;
  /**
   * The content of the line.
   */
  content: string;
  /**
   * Whether the line is in the front matter.
   */
  frontMatter: boolean;
  /**
   * Whether the line is in the body.
   */
  body: boolean;
}

export interface StudyPagePrefetchQuery_study_wikiPage_edits_changeSet {
  __typename: "WikiPageEdits";
  bodyChanged: boolean;
  frontMatterChanged: boolean;
  editLines: StudyPagePrefetchQuery_study_wikiPage_edits_changeSet_editLines[];
}

export interface StudyPagePrefetchQuery_study_wikiPage_edits {
  __typename: "WikiPageEdit";
  user: StudyPagePrefetchQuery_study_wikiPage_edits_user | null;
  createdAt: any;
  id: number;
  comment: string | null;
  diff: string | null;
  diffHtml: string | null;
  changeSet: StudyPagePrefetchQuery_study_wikiPage_edits_changeSet;
}

export interface StudyPagePrefetchQuery_study_wikiPage {
  __typename: "WikiPage";
  content: string;
  edits: StudyPagePrefetchQuery_study_wikiPage_edits[];
  nctId: string;
  /**
   * Json key value pairs of meta information
   */
  meta: string;
}

export interface StudyPagePrefetchQuery_study_reviews_user {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Email
   */
  email: string;
}

export interface StudyPagePrefetchQuery_study_reviews {
  __typename: "Review";
  id: number;
  /**
   * Json key value pairs of meta information.
   */
  meta: string;
  content: string;
  createdAt: any;
  user: StudyPagePrefetchQuery_study_reviews_user;
}

export interface StudyPagePrefetchQuery_study_interventions {
  __typename: "Intervention";
  /**
   * Intervention id
   */
  id: number;
  /**
   * Intervention description
   */
  description: string | null;
  /**
   * Intervention name
   */
  name: string | null;
  /**
   * Intervention type
   */
  type: string | null;
}

export interface StudyPagePrefetchQuery_study_facilities_location {
  __typename: "Location";
  latitude: number | null;
  longitude: number | null;
  status: string;
}

export interface StudyPagePrefetchQuery_study_facilities_contacts {
  __typename: "FacilityContact";
  contactType: string;
  email: string | null;
  id: number;
  name: string | null;
  nctId: string;
  phone: string | null;
}

export interface StudyPagePrefetchQuery_study_facilities {
  __typename: "Facility";
  city: string;
  country: string;
  id: number;
  name: string | null;
  nctId: string;
  state: string;
  status: string;
  location: StudyPagePrefetchQuery_study_facilities_location | null;
  zip: string;
  contacts: StudyPagePrefetchQuery_study_facilities_contacts[];
}

export interface StudyPagePrefetchQuery_study {
  __typename: "Study";
  acronym: string | null;
  ages: string;
  averageRating: number;
  baselinePopulation: string | null;
  biospecDescription: string | null;
  biospecRetention: string | null;
  briefSummary: string | null;
  briefTitle: string;
  collaborators: string;
  completionDate: any | null;
  completionDateType: string | null;
  completionMonthYear: string | null;
  conditions: string | null;
  contacts: string;
  createdAt: any;
  detailedDescription: string | null;
  dislikesCount: number;
  dispositionFirstPostedDate: string | null;
  dispositionFirstPostedDateType: string | null;
  dispositionFirstSubmittedDate: string | null;
  dispositionFirstSubmittedQcDate: string | null;
  eligibilityCriteria: string;
  eligibilityGender: string;
  eligibilityHealthyVolunteers: string;
  enrollment: number | null;
  enrollmentType: string | null;
  expandedAccessTypeIndividual: string | null;
  expandedAccessTypeIntermediate: string | null;
  expandedAccessTypeTreatment: string | null;
  firstReceivedDate: any | null;
  hasDataMonitoringCommittee: boolean;
  hasDmc: string | null;
  hasExpandedAccess: string | null;
  investigators: string;
  ipdAccessCriteria: string | null;
  ipdTimeFrame: string | null;
  ipdUrl: string | null;
  isFdaRegulated: boolean;
  isFdaRegulatedDevice: string | null;
  isFdaRegulatedDrug: string | null;
  isPpsd: string | null;
  isUnapprovedDevice: string | null;
  isUsExport: string | null;
  lastChangedDate: any | null;
  lastKnownStatus: string | null;
  lastUpdatePostedDate: string | null;
  lastUpdatePostedDateType: string | null;
  lastUpdateSubmittedDate: string | null;
  lastUpdateSubmittedQcDate: string | null;
  likesCount: number;
  limitationsAndCaveats: string | null;
  listedLocationCountries: string;
  nctId: string;
  nlmDownloadDateDescription: string | null;
  numberOfArms: string | null;
  numberOfGroups: string | null;
  officialTitle: string | null;
  otherStudyIds: string;
  overallStatus: string;
  phase: string | null;
  planToShareIpd: string | null;
  planToShareIpdDescription: string | null;
  primaryCompletionDate: any | null;
  primaryCompletionDateType: string | null;
  primaryCompletionMonthYear: string | null;
  primaryMeasures: string | null;
  publications: string;
  removedLocationCountries: string;
  responsibleParty: string;
  resultsFirstPostedDate: string | null;
  resultsFirstPostedDateType: string | null;
  resultsFirstSubmittedDate: string | null;
  resultsFirstSubmittedQcDate: string | null;
  reviewsCount: number;
  reactionsCount: StudyPagePrefetchQuery_study_reactionsCount[] | null;
  secondaryMeasures: string | null;
  source: string;
  sponsor: string;
  startDate: any | null;
  startDateType: string | null;
  startMonthYear: string | null;
  studyArms: string;
  studyFirstPostedDate: string | null;
  studyFirstPostedDateType: string | null;
  studyFirstSubmittedDate: string | null;
  studyFirstSubmittedQcDate: string | null;
  studyType: string;
  targetDuration: string | null;
  type: string;
  updatedAt: any;
  verificationDate: any | null;
  verificationMonthYear: string | null;
  whyStopped: string | null;
  wikiPage: StudyPagePrefetchQuery_study_wikiPage | null;
  reviews: StudyPagePrefetchQuery_study_reviews[];
  interventions: StudyPagePrefetchQuery_study_interventions[];
  facilities: StudyPagePrefetchQuery_study_facilities[];
}

export interface StudyPagePrefetchQuery_me {
  __typename: "User";
  /**
   * Id
   */
  id: number;
  /**
   * Email
   */
  email: string;
  /**
   * First name
   */
  firstName: string | null;
  /**
   * Last name
   */
  lastName: string | null;
  /**
   * Default query for user
   */
  defaultQueryString: string | null;
}

export interface StudyPagePrefetchQuery {
  study: StudyPagePrefetchQuery_study | null;
  /**
   * Current logged in user
   */
  me: StudyPagePrefetchQuery_me | null;
}

export interface StudyPagePrefetchQueryVariables {
  nctId: string;
}
