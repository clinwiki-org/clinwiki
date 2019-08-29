module Types
  class UserType < BaseObject
    field :id, Int, "Id", null: false
    field :email, String, "Email", null: false
    field :first_name, String, "First name", null: true
    field :last_name, String, "Last name", null: true
    field :default_query_string, String, "Default query for user", null: true
    field :own_sites, [SiteType], null: false
    field :editor_sites, [SiteType], null: false
    field :roles, [String], null: false

    field :feeds, [FeedType], "Feed list. Available only for current user", null: false

    def own_sites
      return [] if current_user.blank?

      Site.with_role(:site_owner, current_user)
    end

    def editor_sites
      return [] if current_user.blank?

      res = Site.with_role(:site_editor, current_user).to_a
      res.push(Site.default) if current_user.has_role?(:admin)
      res
    end

    def feeds
      return [] unless context[:current_user]&.id == object.id

      object.feeds
    end

    def roles
      object.roles.map(&:name)
    end
  end
end
