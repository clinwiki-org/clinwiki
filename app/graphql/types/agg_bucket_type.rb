module Types
  class AggBucketType < BaseObject
    field :key, String, hash_key: "key", null: true
    field :docCount, Int, hash_key: "doc_count", null: true
  end
end
