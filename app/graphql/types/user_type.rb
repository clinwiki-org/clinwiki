module Types
  class UserType < BaseObject
    field :email, String, "Email", null: false
    field :first_name, String, "First name", null: false
    field :last_name, String, "Last name", null: false
    field :default_query_string, String, "Default query for user", null: true

    field :feeds, [FeedType], "Feed list. Available only for current user", null: false

    def feeds
      return [] unless context[:current_user]&.id == object.id

      object.feeds
    end
  end
end
