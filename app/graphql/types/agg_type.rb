module Types
  class AggType < BaseObject
    field :name, String, null: false
    field :buckets, [AggBucketType], null: false
    field :doc_count_error_upper_bound, Int, null: false
    field :sum_other_doc_count, Int, null: false
  end
end
