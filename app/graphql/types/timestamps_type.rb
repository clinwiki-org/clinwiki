module Types
  module TimestampsType
    include Types::BaseInterface
    field :created_at, DateTimeType, null: false
    field :updated_at, DateTimeType, null: false
  end
end
