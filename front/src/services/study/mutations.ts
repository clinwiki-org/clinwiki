export const CREATE_STUDY_VIEW_LOG_MUTATION =`
mutation CreateStudyViewLogMutation($nctId: String!){
    createStudyViewLog(input: {
      nctId: $nctId
    }) {
        errors
        }
    }
  `;