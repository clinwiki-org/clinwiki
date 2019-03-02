module Types
  class QueryType < BaseObject
    field :search, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end

    field :agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end

    field :crowd_agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end

    field :health, HealthType, null: false

    field :study, StudyType, null: true do
      argument :nct_id, type: String, required: true
    end

    field :intervention, InterventionType, null: true do
      argument :id, type: Integer, required: true
    end

    field :feed, FeedType, null: true do
      argument :id, type: Integer, required: true
    end

    field :me, UserType, "Current logged in user", null: true

    def search(args)
      SearchService.new(args[:params], context).search_studies
    end

    def agg_buckets(args)
      SearchService.new(args[:params], context).agg_buckets
    end

    def crowd_agg_buckets(args)
      # we do this to accommodate crowd_agg_buckets returning a different structure in the old impl
      { aggs: SearchService.new(args[:params], context).crowd_agg_buckets }
    end

    def health
      ActiveRecord::Base.establish_connection
      ActiveRecord::Base.connection
      {
        healthy: ActiveRecord::Base.connected?,
      }
    end

    def study(nct_id:)
      Study.find_by(nct_id: nct_id)
    end

    def intervention(id:)
      Intervention.find_by(id: id)
    end

    def feed(id:)
      Feed.find_by(id: id)
    end

    def me
      context[:current_user]
    end
  end
end
