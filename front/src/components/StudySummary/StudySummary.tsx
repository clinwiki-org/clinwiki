import * as React from 'react';
import { gql } from 'apollo-boost';
import { StudySummaryFragment } from 'types/StudySummaryFragment';
import { Helmet } from 'react-helmet';
import CollapsiblePanel from 'components/CollapsiblePanel';
import { WorkflowsViewFragment } from 'types/WorkflowsViewFragment';
import { WorkflowConfigFragment } from 'types/WorkflowConfigFragment';
import { prop } from 'ramda';
import { sentanceCaseFromCamelCase } from 'utils/helpers';
import { MailMergeView } from 'components/MailMerge';

interface StudySummaryProps {
  study: StudySummaryFragment;
  template?: string|null;
  workflow: WorkflowConfigFragment | null;
  workflowsView: WorkflowsViewFragment;
}

class StudySummary extends React.PureComponent<StudySummaryProps> {
  static fragment = gql`
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
      targetDuration
      type
      updatedAt
      verificationDate
      verificationMonthYear
      whyStopped
    }
  `;

  render() {
    const template = this.props.workflow
      ? this.props.workflow.summaryTemplate
      : this.props.template || `
<table class='table table-striped table-bordered table-condensed'>
  <tbody>
    <tr> <th>NCT ID</th> <td>{{nctId}}</td> </tr>
    <tr> <th>type</th> <td>{{type}}</td> </tr>
    <tr> <th>Overall Status</th> <td>{{overallStatus}}</td> </tr>
    <tr> <th>Completion Date</th> <td>{{completionDate}}</td> </tr>
    <tr> <th>Enrollment</th> <td>{{enrollment}}</td> </tr>
    <tr> <th>Source</th> <td>{{source}}</td> </tr>
  </tbody>
</table> `;

    return (
      <div className="container">
        <Helmet>
          <title>{`Wiki - ${this.props.study.briefTitle}`}</title>
        </Helmet>

        <CollapsiblePanel header={this.props.study.briefTitle || ''}>
          <MailMergeView 
            template={template}
            context={this.props.study}
          />
        </CollapsiblePanel>
      </div>
    );
  }
}

export default StudySummary;
