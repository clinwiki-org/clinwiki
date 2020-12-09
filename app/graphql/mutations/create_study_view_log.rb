module Mutations
    class CreateStudyViewLog < BaseMutation
      argument :user_id, Int, required: false
      argument :nct_id, String, required: true
      
      field :study_view_log, Types::StudyViewLogType, null: false
      field :errors, [String], null: true

      def resolve(user_id: nil, nct_id:)
        user = user_id ? user_id : (current_user&.id || nil)
        hash = { user_id: user, nct_id: nct_id }
        study_view_log = StudyViewLog.new(hash)
        if study_view_log.save
          { study_view_log: study_view_log, errors: nil }
        else
          { study_view_log: nil, errors: study_view_log.errors.full_messages }
        end
      end
    end
  end