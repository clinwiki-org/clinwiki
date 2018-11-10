module Types
  SearchResultType = GraphQL::ObjectType.define do
    name "SearchResult"

    field :field, types.String, "An arbitrary search result field" do
      argument :name, !types.String, "The field we're requesting"
      resolve -> (obj, args, context) do
        obj.fetch(args.name.to_sym, nil)
      end
    end
  end

  SearchResultAggBucketType = GraphQL::ObjectType.define do
    name "AggBucket"
    field :key, types.String, hash_key: "key"
    field :docCount, types.Int, hash_key: "doc_count"
  end

  SearchResultAggType = GraphQL::ObjectType.define do
    name "Agg"
    field :name do
      type types.String
    end
    field :buckets do
      type types[SearchResultAggBucketType]
    end
    field :docCountErrorUpperBound do
      type types.Int
      hash_key :doc_count_error_upper_bound
    end
    field :sumDocOtherCount do
      type types.Int
      hash_key :sum_other_doc_count
    end
  end

  SearchResultSetType = GraphQL::ObjectType.define do
    name "SearchResultSet"
    field :data, types[SearchResultType], description: "Search Result Data", hash_key: :data
    field :recordsTotal, types.Int, description: "Total results", hash_key: :recordsTotal
    field :aggs do
      type types[SearchResultAggType]
      resolve -> (obj, args, context) do
        obj.fetch(:aggs, []).map do |key, val|
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

  class AggFilterType < Types::BaseInputObject
    description "An Agg Filter"
    argument :field, String, description: "The field we are filtering on", required: true
    argument :values, [String], description: "The values we are filtering for that field", required: false, default_value: []
  end


  class SortDirection < Types::BaseEnum
    value "ASC", "Ascending"
    value "DESC", "Descending"
  end

  class SortType < Types::BaseInputObject
    description "Column to sort by"
    argument :id, String, description: "Column to sort by", required: true
    argument :desc, Boolean, description: "Sort in descending order if true", required: false, default_value: false
  end

  class SearchInputType < Types::BaseInputObject
    description "Attributes for performing a search"
    argument :q, String, 'an optional query -- defaults to current user default query', required: false
    argument :page, Int, 'which page of search results we want', required: false, default_value: 1
    argument :pageSize, Int, 'how many results we want', required: false, default_value: 25
    argument :sorts, [SortType], 'which fields to sort by', required: false, default_value: [ { :field => 'nct_id' }]
    argument :aggFilters, [AggFilterType], 'the aggs we are filtering on', required: false
    argument :crowdAggFilters, [AggFilterType], 'the crowd aggs we should filter on', required: false
    argument :agg, String, 'an agg to query for, used when retrieving all buckets for an agg', required: false
  end
end
