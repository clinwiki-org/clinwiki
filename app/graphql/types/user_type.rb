module Types
  class UserType < BaseObject
    field :id, Int, "Id", null: false
    field :email, String, "Email", null: false
    field :first_name, String, "First name", null: true
    field :last_name, String, "Last name", null: true
    field :default_query_string, String, "Default query for user", null: true

    field :feeds, [FeedType], "Feed list. Available only for current user", null: false

    def feeds
      return [] unless context[:current_user]&.id == object.id

      object.feeds
    end
  end
end
