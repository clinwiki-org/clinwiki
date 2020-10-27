module Types
  class StudyViewLogType < Types::BaseObject
    field :user_id, Integer, null: true
    field :updated_at, GraphQL::Types::ISO8601DateTime, null:false
    field :created_at, GraphQL::Types::ISO8601DateTime, null:false
    field :study, StudyType,null:false
  end
end
