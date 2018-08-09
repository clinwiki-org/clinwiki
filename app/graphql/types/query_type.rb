require_relative './health_type'
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
    field :crowd_agg_buckets, Types::SearchResultSetType, null: false do
      argument :params, type: Types::SearchInputType, required: true
    end
    def crowd_agg_buckets(args)
      # we do this to accommodate get_crowd_agg_buckets returning a different structure in the old impl
      { aggs: SearchService.new(args[:params], self.context).get_crowd_agg_buckets }
    end
    field :health, Types::HealthCheckType, null: false
    def health()
      ActiveRecord::Base.establish_connection
      ActiveRecord::Base.connection
      return {
        healthy: ActiveRecord::Base.connected?
      }
    end

  end
end
