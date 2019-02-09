module Types
  class QueryType < BaseObject
    field :search, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end
    def search(args)
      SearchService.new(args[:params], context).search_studies
    end
    field :agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end
    def agg_buckets(args)
      SearchService.new(args[:params], context).agg_buckets
    end
    field :crowd_agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end
    def crowd_agg_buckets(args)
      # we do this to accommodate crowd_agg_buckets returning a different structure in the old impl
      { aggs: SearchService.new(args[:params], context).crowd_agg_buckets }
    end
    field :health, HealthType, null: false
    def health
      ActiveRecord::Base.establish_connection
      ActiveRecord::Base.connection
      {
        healthy: ActiveRecord::Base.connected?,
      }
    end

    field :study, StudyType, null: true do
      argument :nct_id, type: String, required: true
    end

    def study(nct_id:)
      Study.find_by(nct_id: nct_id)
    end
  end
end
