module Types
  class AggBucketType < BaseObject
    field :key, String, null: false
    field :key_as_string, String, null: true
    field :docCount, Int, null: false
  end
end
