module Mutations
  class UpdateSiteView < BaseMutation
    field :site_view, Types::SiteViewType, null: true
    field :errors, [String], null: true

    argument :name, String, required: false
    argument :default, Boolean, required: false
    argument :url, String, required: false
    argument :type, String, required: false
    argument :description, String, required: false
    argument :id, Int, required: true
    argument :mutations, [Types::SiteViewMutationInputType], required: true

    def resolve(args)
      view = site_view(args[:id])
      view.attributes = args.slice(:name,:url,:description,:default, :type)
      mutations = args[:mutations].clone.map do |mutation|
        begin
          mutation[:payload] = JSON.parse(mutation[:payload])
        rescue StandardError # rubocop:disable Lint/HandleExceptions
          # use payload as string if it's not a json
        end
        mutation.to_h
      end
      view.updates = SiteViewUpdaterService.compact(view.mutations + mutations)
      if view.save
        { site_view: view, errors: nil }
      else
        { site_view: nil, errors: view.errors.full_messages }
      end
    end

    def authorized?(args)
      view = site_view(args[:id])
      site = view&.site
      return false if site.blank?

      current_user.present? && (
        current_user.has_role?(:admin) ||
        current_user.has_role?(:site_owner, site) ||
        current_user.has_role?(:site_editor, site)
      )
    end

    private

    def site_view(site_view_id)
      @site_view ||= SiteView.find_by(id: site_view_id)
    end
  end
end
