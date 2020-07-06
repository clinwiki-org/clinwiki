module Mutations
  class UpdatePageView < BaseMutation
    field :page_view, Types::PageViewType, null: true
    field :errors, [String], null: true

    argument :title, String, required: false
    argument :template, String, required: false
    argument :page_type, String, required: false
    argument :url, String, required: false
    # argument :mutations,[Types::SiteViewMutationInputType],required: true
    argument :id, Integer, required: true

    def resolve(args)
      page_view = page_view(args[:id])
      page_view.attributes = args.slice(:title,:template,:url,:page_type)
      # mutations = args[:mutations].clone.map do |mutation|
      #   begin
      #     mutation[:payload] = JSON.parse(mutation[:payload])
      #   rescue StandardError # rubocop:disable Lint/HandleExceptions
      #     # use payload as string if it's not a json
      #   end
      #   mutation.to_h
      # end
      # page_view.updates = SiteViewUpdaterService.compact(view.mutations + mutations)
      if page_view.save
        { page_view: page_view, errors: nil }
      else
        { page_view: nil, errors: page_view.errors.full_messages }
      end
    end

    def authorized?(args)
      page_view = page_view(args[:id])
      site = page_view&.site
      return false if site.blank?

      current_user.present? && (
        current_user.has_role?(:admin) ||
        current_user.has_role?(:site_owner, site) ||
        current_user.has_role?(:site_editor, site)
      )
    end

    private

    def page_view(page_view_id)
      @page_view ||= PageView.find_by(id: page_view_id)
    end
  end
end
