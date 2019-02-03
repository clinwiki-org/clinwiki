module Types
  class SearchResultSetType < BaseObject
    field :data, [SearchResultType], description: "Search Result Data", hash_key: :data, null: true
    field :recordsTotal, Int, description: "Total results", hash_key: :recordsTotal, null: true
    field :aggs, [AggType], null: true

    def aggs
      object.fetch(:aggs, []).map do |key, val|
        Hashie::Mash.new({
          name: key,
          buckets: val.fetch("buckets", []),
          doc_count_error_upper_bound: val.fetch("doc_count_error_upper_bound", 0),
          sum_other_doc_count: val.fetch("sum_other_doc_count", 0),
        })
      end
    end
  end
end