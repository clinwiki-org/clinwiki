module Mutations
  class DeletePageView < BaseMutation
    field :page_view, Types::PageViewType, null: true
    field :error, String, null: true

    argument :id, Integer, "Id of the site view to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      page_view = PageView.find { |s| s.id == id }
      return nil unless page_view
      if current_user.has_role?(:site_owner, page_view.site) || current_user.has_role?(:admin)
          page_view.destroy!
      else
        return nil
      end
      { page_view: page_view }
    end
  end
end
