module Mutations
  class UpdateStudyView < BaseMutation
    field :study_view, Types::StudyViewType, null: true
    field :errors, [String], null: true

    argument :title, String, required: false
    argument :template, String, required: false
    # argument :mutations,[Types::SiteViewMutationInputType],required: true
    argument :id, Integer, required: true

    def resolve(args)
      study_view = study_view(args[:id])
      study_view.attributes = args.slice(:title,:template)
      # mutations = args[:mutations].clone.map do |mutation|
      #   begin
      #     mutation[:payload] = JSON.parse(mutation[:payload])
      #   rescue StandardError # rubocop:disable Lint/HandleExceptions
      #     # use payload as string if it's not a json
      #   end
      #   mutation.to_h
      # end
      # study_view.updates = SiteViewUpdaterService.compact(view.mutations + mutations)
      if study_view.save
        { study_view: study_view, errors: nil }
      else
        { study_view: nil, errors: study_view.errors.full_messages }
      end
    end

    def authorized?(args)
      study_view = study_view(args[:id])
      site = study_view&.site
      return false if site.blank?

      current_user.present? && (
        current_user.has_role?(:admin) ||
        current_user.has_role?(:site_owner, site) ||
        current_user.has_role?(:site_editor, site)
      )
    end

    private

    def study_view(study_view_id)
      @study_view ||= StudyView.find_by(id: study_view_id)
    end
  end
end
