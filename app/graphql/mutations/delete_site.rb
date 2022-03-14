module Mutations
  class DeleteSite < BaseMutation
    field :site, Types::SiteType, null: true

    argument :id, Integer, "Id of the site to delete", required: true

    def resolve(id:)
      current_user = context[:current_user]
      return nil unless current_user

      site = Site.with_role(:site_owner, current_user).find { |s| s.id == id }
      return nil unless site

      site.destroy!
      { site: site }
    end
  end
end
