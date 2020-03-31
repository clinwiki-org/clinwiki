module Mutations
  class CreateSiteView < BaseMutation
    field :site_view, Types::SiteViewType, null: true
    field :errors, [String], null: true

    argument :name, String, required: true
    argument :url, String, required: false
    argument :description, String, required: false
    argument :default, Boolean, required: true
    argument :type, String, required: false
    argument :mutations,[Types::SiteViewMutationInputType],required: true
    argument :site_id, Integer, required: true

    def resolve(args)
      site = Site.find_by(id: args[:site_id])
      if site.nil?
        return   { site_view: nil, errors: ["Site not found"] }
      end
      view = site.site_views.new()
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
