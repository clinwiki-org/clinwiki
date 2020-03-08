import { JsonSchema } from './SchemaSelector';

const studySchema: JsonSchema = {
  type: 'object',
  properties: {
    acronym: { type: 'string' },
    ages: { type: 'string' },
    averageRating: { type: 'number' },
    baselinePopulation: { type: 'string' },
    biospecDescription: { type: 'string' },
    biospecRetention: { type: 'string' },
    briefSummary: { type: 'string' },
    briefTitle: { type: 'string' },
    collaborators: { type: 'string' },
    completionDate: { type: 'string' },
    completionDateType: { type: 'string' },
    completionMonthYear: { type: 'string' },
    conditions: { type: 'string' },
    contacts: { type: 'string' },
    createdAt: { type: 'string' },
    design: { type: 'string' },
    detailedDescription: { type: 'string' },
    dispositionFirstPostedDate: { type: 'string' },
    dispositionFirstPostedDateType: { type: 'string' },
    dispositionFirstSubmittedDate: { type: 'string' },
    dispositionFirstSubmittedQcDate: { type: 'string' },
    eligibilityCriteria: { type: 'string' },
    eligibilityGender: { type: 'string' },
    eligibilityHealthyVolunteers: { type: 'string' },
    enrollment: { type: 'string' },
    enrollmentType: { type: 'string' },
    expandedAccessTypeIndividual: { type: 'string' },
    expandedAccessTypeIntermediate: { type: 'string' },
    expandedAccessTypeTreatment: { type: 'string' },
    firstReceivedDate: { type: 'string' },
    hasDataMonitoringCommittee: { type: 'boolean' },
    hasDmc: { type: 'boolean' },
    hasExpandedAccess: { type: 'boolean' },
    investigators: { type: 'string' },
    ipdAccessCriteria: { type: 'string' },
    ipdTimeFrame: { type: 'string' },
    ipdUrl: { type: 'string' },
    isFdaRegulated: { type: 'boolean' },
    isFdaRegulatedDevice: { type: 'boolean' },
    isFdaRegulatedDrug: { type: 'boolean' },
    isPpsd: { type: 'boolean' },
    isUnapprovedDevice: { type: 'boolean' },
    isUsExport: { type: 'boolean' },
    lastChangedDate: { type: 'string' },
    lastKnownStatus: { type: 'string' },
    lastUpdatePostedDate: { type: 'string' },
    lastUpdatePostedDateType: { type: 'string' },
    lastUpdateSubmittedDate: { type: 'string' },
    lastUpdateSubmittedQcDate: { type: 'string' },
    limitationsAndCaveats: { type: 'string' },
    listedLocationCountries: { type: 'string' },
    nctId: { type: 'string' },
    nlmDownloadDateDescription: { type: 'string' },
    numberOfArms: { type: 'string' },
    numberOfGroups: { type: 'string' },
    officialTitle: { type: 'string' },
    otherStudyIds: { type: 'string' },
    overallStatus: { type: 'string' },
    phase: { type: 'string' },
    planToShareIpd: { type: 'string' },
    planToShareIpdDescription: { type: 'string' },
    primaryCompletionDate: { type: 'string' },
    primaryCompletionDateType: { type: 'string' },
    primaryCompletionMonthYear: { type: 'string' },
    primaryMeasures: { type: 'string' },
    publications: { type: 'string' },
    removedLocationCountries: { type: 'string' },
    responsibleParty: { type: 'string' },
    resultsFirstPostedDate: { type: 'string' },
    resultsFirstPostedDateType: { type: 'string' },
    resultsFirstSubmittedDate: { type: 'string' },
    resultsFirstSubmittedQcDate: { type: 'string' },
    reviewsCount: { type: 'string' },
    secondaryMeasures: { type: 'string' },
    source: { type: 'string' },
    sponsor: { type: 'string' },
    startDate: { type: 'string' },
    startDateType: { type: 'string' },
    startMonthYear: { type: 'string' },
    studyArms: { type: 'string' },
    studyFirstPostedDate: { type: 'string' },
    studyFirstPostedDateType: { type: 'string' },
    studyFirstSubmittedDate: { type: 'string' },
    studyFirstSubmittedQcDate: { type: 'string' },
    studyType: { type: 'string' },
    targetDuration: { type: 'string' },
    type: { type: 'string' },
    updatedAt: { type: 'string' },
    verificationDate: { type: 'string' },
    verificationMonthYear: { type: 'string' },
    whyStopped: { type: 'string' },
    reviews: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          content: { type: 'string' },
          createdAt: { type: 'string', format: 'date' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
            },
          },
        },
      },
    },
  },
};

const searchSchema : JsonSchema = {
  type: 'object',
  properties: {
    averageRating: { type: 'number' },
    completionDate: { type: 'string' },
    nctId: { type: 'string' },
    overallStatus: { type: 'string' },
    startDate: { type: 'string' },
    briefTitle: { type: 'string' },
    reviewsCount: { type: 'number' },
    nlmDownloadDateDescription: { type: 'string' },
    studyFirstSubmittedDate: { type: 'string' },
    resultsFirstSubmittedDate: { type: 'string' },
    dispositionFirstSubmittedDate: { type: 'string' },
    lastUpdateSubmittedDate: { type: 'string' },
    studyFirstSubmittedQcDate: { type: 'string' },
    studyFirstPostedDate: { type: 'string' },
    studyFirstPostedDateType: { type: 'string' },
    resultsFirstSubmittedQcDate: { type: 'string' },
    resultsFirstPostedDate: { type: 'string' },
    resultsFirstPostedDateType: { type: 'string' },
    dispositionFirstSubmittedQcDate: { type: 'string' },
    dispositionFirstPostedDate: { type: 'string' },
    dispositionFirstPostedDateType: { type: 'string' },
    lastUpdateSubmittedQcDate: { type: 'string' },
    lastUpdatePostedDate: { type: 'string' },
    lastUpdatePostedDateType: { type: 'string' },
    startMonthYear: { type: 'string' },
    startDateType: { type: 'string' },
    verificationMonthYear: { type: 'string' },
    verificationDate: { type: 'string' },
    completionMonthYear: { type: 'string' },
    completionDateType: { type: 'string' },
    primaryCompletionMonthYear: { type: 'string' },
    primaryCompletionDateType: { type: 'string' },
    primaryCompletionDate: { type: 'string' },
    targetDuration: { type: 'string' },
    studyType: { type: 'string' },
    acronym: { type: 'string' },
    baselinePopulation: { type: 'string' },
    officialTitle: { type: 'string' },
    lastKnownStatus: { type: 'string' },
    phase: { type: 'string' },
    enrollment: { type: 'number' },
    enrollmentType: { type: 'string' },
    source: { type: 'string' },
    limitationsAndCaveats: { type: 'string' },
    numberOfArms: { type: 'string' },
    numberOfGroups: { type: 'string' },
    whyStopped: { type: 'string' },
    hasExpandedAccess: { type: 'string' },
    expandedAccessTypeIndividual: { type: 'string' },
    expandedAccessTypeIntermediate: { type: 'string' },
    expandedAccessTypeTreatment: { type: 'string' },
    hasDmc: { type: 'string' },
    isFdaRegulatedDrug: { type: 'string' },
    isFdaRegulatedDevice: { type: 'string' },
    isUnapprovedDevice: { type: 'string' },
    isPpsd: { type: 'string' },
    isUsExport: { type: 'string' },
    biospecRetention: { type: 'string' },
    biospecDescription: { type: 'string' },
    ipdTimeFrame: { type: 'string' },
    ipdAccessCriteria: { type: 'string' },
    ipdUrl: { type: 'string' },
    planToShareIpd: { type: 'string' },
    planToShareIpdDescription: { type: 'string' },
  },
};

export { studySchema, searchSchema };
