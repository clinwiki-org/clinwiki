module Mutations
  class DeleteStudyView < BaseMutation
    field :study_view, Types::StudyViewType, null: true
    field :error, String, null: true

    argument :id, Integer, "Id of the site view to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      study_view = StudyView.find { |s| s.id == id }
      return nil unless study_view
      if current_user.has_role?(:site_owner, study_view.site) || current_user.has_role?(:admin)
          study_view.destroy!
      else
        return nil
      end
      { study_view: study_view }
    end
  end
end
