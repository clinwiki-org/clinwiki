module Types
  class AggBucketType < BaseObject
    field :key, String, null: false
    field :docCount, Int, null: false
  end
end
