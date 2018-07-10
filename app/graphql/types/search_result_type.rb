module Types
  SearchResultType = GraphQL::ObjectType.define do
    name "SearchResult"

    field :field, !types.String, "An arbitrary search result field" do
      argument :name, !types.String, "The field we're requesting"
      resolve -> (obj, args, context) do
        obj.fetch(args.name.to_sym, nil)
      end
    end
  end

  SearchResultAggBucketType = GraphQL::ObjectType.define do
    name "AggBucket"
    field :key do
      type String
    end
    field :doc_count do
      type Integer
    end
  end

  SearchResultAggType = GraphQL::ObjectType.define do
    name "Agg"
    field :name do
      type String
    end
    field :buckets do
      type [SearchResultAggBucketType]
    end
    field :doc_count_error_upper_bound do
      type Integer
    end
    field :sum_other_doc_count do
      type Integer
    end
  end

  SearchResultSetType = GraphQL::ObjectType.define do
    name "SearchResultSet"
    field :data, types[SearchResultType], description: "Search Result Data", hash_key: :data
    field :recordsTotal, types.Int, description: "Total results", hash_key: :recordsTotal
    # field :aggs do
    #   type [SearchResultAggType]
    # end
  end
end
