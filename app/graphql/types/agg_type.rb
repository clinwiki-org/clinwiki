module Types
  class AggType < BaseObject
    field :name, String, null: true
    field :buckets, [AggBucketType], null: true
    field :docCountErrorUpperBound, Int, hash_key: :doc_count_error_upper_bound, null: true
    field :sumDocOtherCount, Int, hash_key: :sum_other_doc_count, null: true
  end
end