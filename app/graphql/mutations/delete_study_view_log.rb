module Mutations
  class DeleteStudyViewLog < BaseMutation
    field :study_view_log, Types::StudyViewLogType, null: true

    argument :id, Integer, "Id of the study_view log  to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      study_view_log = current_user.study_view_logs.find_by_id(id)
      return nil unless study_view_log
      study_view_log.update(user_id: nil)

      
      { study_view_log: study_view_log}
    end
  end
end
