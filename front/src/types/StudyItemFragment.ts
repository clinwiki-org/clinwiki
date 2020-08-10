/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StudyItemFragment
// ====================================================

export interface StudyItemFragment {
  __typename: "ElasticStudy";
  averageRating: number;
  completionDate: any | null;
  nctId: string;
  overallStatus: string;
  startDate: any | null;
  briefTitle: string;
  reviewsCount: number | null;
  interventions: string[];
  facilityStates: string[];
  interventionsMeshTerms: string[];
  studyFirstSubmittedDate: string | null;
  resultsFirstSubmittedDate: string | null;
  dispositionFirstSubmittedDate: string | null;
  lastUpdateSubmittedDate: string | null;
  studyFirstSubmittedQcDate: string | null;
  studyFirstPostedDate: string | null;
  studyFirstPostedDateType: string | null;
  resultsFirstSubmittedQcDate: string | null;
  resultsFirstPostedDate: string | null;
  resultsFirstPostedDateType: string | null;
  dispositionFirstSubmittedQcDate: string | null;
  dispositionFirstPostedDate: string | null;
  dispositionFirstPostedDateType: string | null;
  lastUpdateSubmittedQcDate: string | null;
  lastUpdatePostedDate: string | null;
  lastUpdatePostedDateType: string | null;
  studyType: string;
  acronym: string | null;
  baselinePopulation: string | null;
  officialTitle: string | null;
  lastKnownStatus: string | null;
  phase: string | null;
  enrollment: number | null;
  enrollmentType: string | null;
  source: string;
  numberOfArms: string | null;
  numberOfGroups: string | null;
  whyStopped: string | null;
  hasExpandedAccess: string | null;
  expandedAccessTypeTreatment: string | null;
  isFdaRegulatedDrug: string | null;
  isFdaRegulatedDevice: string | null;
  ipdTimeFrame: string | null;
  ipdAccessCriteria: string | null;
  ipdUrl: string | null;
  planToShareIpd: string | null;
  planToShareIpdDescription: string | null;
}
