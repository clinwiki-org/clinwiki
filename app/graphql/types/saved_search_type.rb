module Types
    class SavedSearchType < Types::BaseObject
      field :id, Integer, null: false
      field :user_id, Integer, null: false
      field :url, String, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null:false
      field :created_at, GraphQL::Types::ISO8601DateTime, null:false
      field :short_link, ShortLinkType, null:false
      field :name_label, String, null:true
      field :is_subscribed, Boolean, null:false
    end
  end