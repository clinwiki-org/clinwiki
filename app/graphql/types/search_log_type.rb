module Types
  class SearchLogType < Types::BaseObject
    field :user_id, Integer, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null:false
    field :created_at, GraphQL::Types::ISO8601DateTime, null:false
    field :short_link, ShortLinkType, null:false
  end
end
