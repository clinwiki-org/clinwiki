module Types
  class SearchLogType < Types::BaseObject
    field :id, Int, null: false
    field :user_id, Integer, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null:false
    field :created_at, GraphQL::Types::ISO8601DateTime, null:false
    field :short_link, ShortLinkType, null:false
    field :name_default, String, null:true
  end
end
