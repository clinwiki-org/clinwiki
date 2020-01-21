module Mutations
  class DeleteSiteView < BaseMutation
    field :site_view, Types::SiteType, null: true
    field :error, String, null: true

    argument :id, Integer, "Id of the site view to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      site_view = SiteView.find { |s| s.id == id }
      return nil unless site_view
      if current_user.has_role?(:site_owner, site_view.site)
        if !site_view.default
          site_view.destroy!
        else
        return   {  error: "Can not delete default site view"}
        end
      else
        return nil
      end
      { site_view: site_view }
    end
  end
end
