module Mutations
  class CreateStudyView < BaseMutation
    field :study_view, Types::StudyViewType, null: true
    field :errors, [String], null: true

    argument :title, String, required: true
    argument :template, String, required: true
    # argument :mutations,[Types::SiteViewMutationInputType],required: true
    argument :site_id, Integer, required: true

    def resolve(args)
      site = Site.find_by(id: args[:site_id])
      if site.nil?
        return   { site_view: nil, errors: ["Site not found"] }
      end
      study_view = site.study_views.new()
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
      site = Site.find_by(id: args[:site_id])
      return false if site.blank?

      current_user.present? && (
        current_user.has_role?(:admin) ||
        current_user.has_role?(:site_owner, site) ||
        current_user.has_role?(:site_editor, site)
      )
    end
  end
end
