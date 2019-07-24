module Types
  class QueryType < BaseObject
    field :search,
          SearchResultSetType,
          "Searches params by searchHash on server and `params` argument into it",
          null: true do
      argument :search_hash, String, required: false
      argument :params, type: SearchInputType, required: false
    end

    field :agg_buckets, SearchResultSetType, null: false do
      argument :search_hash, String, required: false
      argument :params, type: SearchInputType, required: false
    end

    field :crowd_agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
    end

    field :health, HealthType, null: false
    field :site, SiteType, "If id is missing, returns current site. If id == 0, returns default site", null: true do
      argument :id, type: Int, required: false
    end

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
    field :search_hash, String, "Search hash for search params", null: false do
      argument :params, type: SearchInputType, required: true
    end

    field :search_params, SearchParamsType, "Search params from hash", null: true do
      argument :hash, type: String, required: false
    end
    field :autosuggestions, [SuggestionType], "List of all words with frequencies", null: false
    # field :freq_words, [FreqwordType], 'All words', null:false
    #
    # # field :user, UserType, '1 User', null:true do
    # #   argument :first_name, type: String, required:true
    # # end
    #
    # # def user(first_name:)
    # #   User.find_by(first_name: first_name)
    # # end
    #
    # # field :users, [UserType], 'All Users', null:false
    #
    # def users
    #   User.all
    # end
    #
    # def freq_words
    #   all = WordFrequency.all
    #   all.sort_by{|x| x[:frequency] }.reverse
    # end

    field :workflows_view, WorkflowsViewType, "Workflows config", null: false

    def search(search_hash: nil, params: nil)
      context[:search_params] = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(context[:search_params])
      search_service.search
    end

    def agg_buckets(search_hash: nil, params: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(params)
      Hashie::Mash.new(
        aggs: search_service.agg_buckets_for_field(field: params[:agg]),
      )
    end

    def crowd_agg_buckets(search_hash: nil, params: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(params)
      Hashie::Mash.new(
        aggs: search_service.agg_buckets_for_field(field: params[:agg], is_crowd_agg: true),
      )
    end

    def health
      ActiveRecord::Base.establish_connection
      ActiveRecord::Base.connection
      {
        healthy: ActiveRecord::Base.connected?,
      }
    end

    def site(id: nil)
      case id
      when nil
        context[:current_site]
      when 0
        Site.default
      else
        Site.find_by(id: id)
      end
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

    def search_hash(params:)
      params_hash = params.to_h.deep_symbolize_keys
      ShortLink.from_long(params_hash).short
    end

    def search_params(hash: nil)
      return nil if hash.nil?

      link = ShortLink.from_short(hash)
      return nil if link.nil?

      JSON.parse(link.long).deep_symbolize_keys
    end

    def autosuggestions
      autosuggest = AutosuggestService.new
      autosuggest.suggestions
      
    def workflows_view
      WorkflowsView.instance.view
    end

    private

    def fetch_and_merge_search_params(search_hash: nil, params: nil)
      if search_hash
        link = ShortLink.from_short(search_hash)
        return if link.nil?

        res = JSON.parse(link.long).deep_symbolize_keys
        res = res.merge(params.to_h) if params.present?
        res
      else
        params.to_h
      end
    end
  end
end
