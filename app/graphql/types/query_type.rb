require_relative './search_result_type'
module Types
  class QueryType < BaseObject
    field :search, Types::SearchResultSetType, null: false do
      argument :params, type: Types::SearchInputType, required: true
    end
    def search(args)
      SearchService.new(args[:params], self.context).search_studies
    end
    field :agg_buckets, Types::SearchResultSetType, null: false do
      argument :params, type: Types::SearchInputType, required: true
    end
    def agg_buckets(args)
      SearchService.new(args[:params], self.context).get_agg_buckets
    end
  end
end
