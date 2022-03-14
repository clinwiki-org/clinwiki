module Types
  class QueryType < BaseObject
    field :search,
          SearchResultSetType,
          "Searches params by searchHash on server and `params` argument into it",
          null: true do
      argument :search_hash, String, required: false
      argument :params, type: SearchInputType, required: false
    end
    # aggs bucket, crowd_agg_buckets, autocomplete need urls, index url
    # Site needs to have unique site_views urls
    field :agg_buckets, SearchResultSetType, null: false do
      argument :search_hash, String, required: false
      argument :params, type: SearchInputType, required: false
      argument :url, type: String, required: false
      argument :config_type, String, required: false
      argument :return_all, Boolean, required: false
    end

    field :autocomplete, SearchResultSetType, null: false do
      argument :search_hash, String, required: false
      argument :aggFields, [String], required: true
      argument :crowdAggFields, [String], required: true
      argument :params, type: SearchInputType, required: false
      argument :url, type: String, required: false
    end

    field :crowd_agg_buckets, SearchResultSetType, null: false do
      argument :params, type: SearchInputType, required: true
      argument :url, type: String, required: false
      argument :config_type, String, required: false
      argument :return_all, Boolean, required: false
    end

    field :crowd_agg_facets, SearchResultSetType, null: false do
       argument :crowd_buckets_wanted, [String], required: false
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
    field :reaction_kinds, [ReactionKindType], "All reaction Types", null: true

    field :search_params, SearchParamsType, "Search params from hash", null: true do
      argument :hash, type: String, required: false
    end
    field :user, PublicUserType, "Public Profile User", null:false do
      argument :user_id, type: Integer, required: true
    end

    field :workflows_view, WorkflowsViewType, "Workflows config", null: false

    field :search_export, SearchExportType, "Retrieve an export by ID", null: true do
      argument :search_export_id, type: Integer, required: true
    end

    field :search_log, [SearchLogType], "Single search log", null: true do
      argument :user_id, type: Integer, required: false
    end

    field :saved_search, [SavedSearchType], "Single saved search", null: true do
      argument :user_id, type: Integer, required: false
    end

    field :island_config, [IslandConfigType], "Island Config", null: true 

    DISPLAY_NAMES = {
      "browse_condition_mesh_terms" => "Browse Condition Mesh Terms",
      "browse_interventions_mesh_terms" => "Browse Intervention Mesh Terms",
      "facility_countries" => "Countries",

    }.freeze

    def location_search
      puts "location search called"
    end

    def search(search_hash: nil, params: nil)
      context[:search_params] = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      link = ShortLink.from_long( context[:search_params])
#      saved = is_saved? from params if present (or if name_label present?)
#      subscribed = is_subscribed? from params if present
#      name_label = name_label from params if present
#      name_default = context[:search_params][:agg_filters][0][:values].join('|')
#       name_default = build_name_default context[:search_params]
#       name_default.delete_suffix!('|')
#       hash = { user_id: context[:current_user]&.id, short_link_id:link.id, name_default: name_default }
# #      SearchLog.create(user_id: context[:current_user]&.id, short_link_id:link.id, name_default: name_default )
#       SearchLog.find_or_create_by hash
      search_service = SearchService.new(context[:search_params])
      search_service.search
    end
 

    def build_name_default(search_info)
      result = ""
      rDescription = ""
      lDescription = ""  #always radius    "xxx miles from" if no zipcode then "current location" else " this _zipcode_"
      if search_info[:q][:children].present?
        search_term = search_info[:q][:children][0][:key].humanize
        result = result + "#{search_term} |"
      end
      if search_info[:crowd_agg_filters].present?
        search_info[:crowd_agg_filters].each do |filter|

          if filter[:gte].present? && filter[:lte].present?
            rDescription =( "#{filter[:field]} #{filter[:gte]} - #{filter[:lte]} |")
            result = (result + rDescription)
          end
          if filter[:gte].present? && filter[:lte].blank?
            rDescription = "#{filter[:field]} ≥ #{filter[:gte]} |"
            result = (result + rDescription)
          end
          if filter[:lte].present? && filter[:gte].blank?
            rDescription = "#{filter[:field]} ≤ #{filter[:lte]} |"
            result = (result + rDescription)
          end

          if filter[:radius].present?
            lDescription = "#{filter[:radius]} miles from "
            lDescription = filter[:zipcode].present? ?  (lDescription + "#{filter[:zipcode]} |") : (lDescription + "current location |")
            result = (result + lDescription)
          end
          filter[:values].each do |value|
            crowd_agg = value.humanize
            result = result + "#{crowd_agg} |"
          end
        end
      end
      if search_info[:agg_filters].present?
        search_info[:agg_filters].each do |filter|

          if filter[:gte].present? && filter[:lte].present?
            rDescription =( "#{filter[:field]} #{filter[:gte]} - #{filter[:lte]} |")
            result = (result + rDescription)
          end
          if filter[:gte].present? && filter[:lte].blank?
            rDescription = "#{filter[:field]} ≥ #{filter[:gte]} |"
            result = (result + rDescription)
          end
          if filter[:lte].present? && filter[:gte].blank?
            rDescription = "#{filter[:field]} ≤ #{filter[:lte]} |"
            result = (result + rDescription)
          end

          if filter[:radius].present?
            lDescription = "#{filter[:radius]} miles from "
            lDescription = filter[:zipcode].present? ?  (lDescription + "#{filter[:zipcode]} |") : (lDescription + "current location |")
            result = (result + lDescription)
          end
          filter[:values].each do |value|
            agg = value.humanize
            result = result + "#{agg} |" 
          end
        end
        result.delete_suffix!('|')
      end
      result
    end



    

    def agg_buckets(search_hash: nil, params: nil, url: nil, config_type: nil, return_all: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(params)
      Hashie::Mash.new(
        aggs: search_service.agg_buckets_for_field(field: params[:agg], current_site: context[:current_site], url: url, config_type: config_type, return_all: return_all),
      )
    end

    def crowd_agg_buckets(search_hash: nil, params: nil, url: nil, config_type: nil, return_all: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(params)
      Hashie::Mash.new(
        aggs: search_service.agg_buckets_for_field(field: params[:agg], current_site: context[:current_site], is_crowd_agg: true, url: url, config_type: config_type, return_all: return_all),
      )
    end

    def crowd_agg_facets(search_hash: nil, params: nil, crowd_buckets_wanted: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)

      params[:crowd_buckets_wanted] = crowd_buckets_wanted
      params[:page_size] = 999999
      search_service = SearchService.new(params)
      Hashie::Mash.new(
        aggs: search_service.crowd_agg_facets(site: context[:current_site]),
      )
    end

    def autocomplete(search_hash: nil, params: nil, agg_fields: [], crowd_agg_fields: [], url: nil)
      params = fetch_and_merge_search_params(search_hash: search_hash, params: params)
      search_service = SearchService.new(params)
      list = []
      agg_fields.each do |field_name|
        result = search_service.agg_buckets_for_field(field: field_name, current_site: context[:current_site], url: url)
        list << Hashie::Mash.new(
          name: field_name,
          results: result[field_name.to_sym][:buckets],
          is_crowd: false,
        )
      end
      crowd_agg_fields.each do |field_name|
        result = search_service.agg_buckets_for_field(field: field_name, current_site: context[:current_site], is_crowd_agg: true, url: url)
        list << Hashie::Mash.new(
          name: field_name,
          results: result["fm_#{field_name}".to_sym][:buckets],
          is_crowd: true,
        )
      end
      Hashie::Mash.new(autocomplete: list)
    end

    def reaction_kinds
      ReactionKind.all
    end

    def user(user_id: nil)
      user = User.find_by_id(user_id)
      return user
    end

    # autocomplete {
    #   key
    #   docCount
    #   type
    # }

    #   aggs {
    #     name
    #     buckets {
    #       key
    #       docCount
    #       __typename
    #     }
    #     __typename
    #   }
    #   __typename
    # }

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

    def search_params(hash: nil)
      return nil if hash.nil?

      link = ShortLink.from_short(hash)
      return nil if link.nil?

      JSON.parse(link.long).deep_symbolize_keys
    end

    def workflows_view
      WorkflowsView.instance.view
    end

    def search_export(search_export_id:)
      return nil if current_user.nil?

      SearchExport.where(user: current_user, id: search_export_id).first
    end
  
    def search_log(user_id: nil)
      user = user_id ? User.find(user_id) : current_user
      return nil if user.nil?
      user.search_logs
    end 
    
    def saved_search(user_id: nil)
      user = user_id ? User.find(user_id) : current_user
      return nil if user.nil?
      user.saved_searches
    end

    def island_config
      all_islands = IslandConfig.all
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
