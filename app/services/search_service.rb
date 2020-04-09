# frozen_string_literal: true

MAX_AGGREGATION_LIMIT = 1_000_000
ORDERING_MAP = { "title" => "brief_title" }.freeze
DEFAULT_PAGE_SIZE = 25
DEFAULT_SORT = "asc"
MAX_WINDOW_SIZE = 10_000
# we're duck typing string to number for now
STRING_MISSING_IDENTIFIER = "-99999999999"
DATE_MISSING_IDENTIFIER = "1500-01-01"

# aggregations
DEFAULT_AGG_SORT = {
  id: "key",
  asc: true,
}.freeze
DEFAULT_AGG_OPTIONS = {
  average_rating: {
    order: { _term: :desc },
  },
  tags: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  overall_status: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  start_date: {
    date_histogram: {
      field: :start_date,
      interval: :year,
      # this should work, but it isn't
      # https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-datehistogram-aggregation.html
      missing: DATE_MISSING_IDENTIFIER,
    },
    limit: 10,
  },
  completion_date: {
    date_histogram: {
      field: :completion_date,
      interval: :year,
      missing: DATE_MISSING_IDENTIFIER,
    },
    limit: 10,
  },
  browse_interventions_mesh_terms: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  interventions_mesh_terms: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  facility_states: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  facility_cities: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  facility_names: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  facility_countries: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  study_type: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  sponsors: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  phase: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  browse_condition_mesh_terms: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  rating_dimensions: {
    limit: 10,
    order: { "_term" => "asc" },
  },
  front_matter_keys: {
    limit: 10,
    order: { "_term" => "asc" },
  },
}.freeze

class SearchService
  ENABLED_AGGS = %i[
    average_rating overall_status facility_states
    facility_cities facility_names facility_countries study_type sponsors
    browse_condition_mesh_terms phase rating_dimensions
    browse_interventions_mesh_terms interventions_mesh_terms
    front_matter_keys start_date
  ].freeze

  attr_reader :params

  # @param params - hash representing SearchInputType with symbols as keys.
  def initialize(params)
    @params = params.deep_dup.freeze
  end

  # Search results from params
  # @return [Hash] the JSON response
  def search(search_after: nil, reverse: false, includes: [])
    crowd_aggs = agg_buckets_for_field(field: "front_matter_keys")
      &.dig(:front_matter_keys, :buckets)
      &.map { |bucket| "fm_#{bucket[:key]}" } || []

    aggs = (crowd_aggs + ENABLED_AGGS).map { |agg| [agg, { limit: 10 }] }.to_h

    options = search_kick_query_options(aggs: aggs, search_after: search_after, reverse: reverse)
    options[:includes] = includes
    search_result = Study.search("*", options) do |body|
      body[:query][:bool][:must] = { query_string: { query: search_query } }
    end
    {
      recordsTotal: search_result.total_entries,
      studies: search_result.results,
      aggs: search_result.aggs,
    }
  end

  def agg_buckets_for_field(field:, current_site: nil, is_crowd_agg: false, url:nil,config_type: nil, return_all: false) # rubocop:disable Metrics/MethodLength
    params = self.params.deep_dup
    key_prefix = is_crowd_agg ? "fm_" : ""
    key = "#{key_prefix}#{field}".to_sym
    # We don't need to keep filters of the same agg, we want broader results
    # But we need to respect all other filters

    params[:agg_filters]&.delete_if { |filter_entry| filter_entry[:field] == field }

    options = search_kick_query_options(
      aggs: { key => DEFAULT_AGG_OPTIONS[key]&.deep_dup || {} },
      skip_filters: [],
    )
    options[:aggs][key][:limit] = MAX_AGGREGATION_LIMIT
    options[:per_page] = 0
    options[:smart_aggs] = true
    options[:load] = false

    page = params[:page] || 0
    page_size = params[:page_size] || DEFAULT_PAGE_SIZE
    bucket_sort = params[:agg_options_sort] || []

    search_results = Study.search("*", options) do |body|
      body[:query][:bool][:must] = { query_string: { query: search_query } }
      body[:aggs][key][:aggs][key][:aggs] =
        (body[:aggs][key][:aggs][key][:aggs] || {}).merge(
          agg_bucket_sort: {
            bucket_sort: {
              from: page * page_size,
              size: page_size,
              sort: bucket_sort.map { |s| bucket_agg_sort(s) },
            },
          },
        )

      unless key == :average_rating || body[:aggs][key][:aggs][key][:date_histogram].present?
        body[:aggs][key][:aggs][key][:terms][:missing] = missing_identifier_for_key(key)
      end

        visibile_options = find_visibile_options(key, is_crowd_agg, current_site, url, config_type, return_all)
        visible_options_regex = one_of_regex(visibile_options)
        regex = visible_options_regex
        if params[:agg_options_filter].present?
          filter_regex = case_insensitive_regex_emulation(".*#{params[:agg_options_filter]}.*")
          regex = visible_options_regex.blank? ? filter_regex : "(#{filter_regex})&(#{visible_options_regex})"
        end
        body[:aggs][key][:aggs][key][:terms][:include] = regex if regex.present?
    end

    aggs = search_results.aggs.to_h.deep_symbolize_keys

    aggs
  end

  def crowd_agg_facets(site:)
    params = self.params.deep_dup
    search_results = Study.search("*", aggs: [:front_matter_keys])

    aggs = search_results.aggs.to_h.deep_symbolize_keys
    keys = aggs[:front_matter_keys][:buckets]
      .map { |x| (x[:key]).to_s }
    facets = {}
    keys.each do |key|
      field_agg = agg_buckets_for_field(field: key, current_site: site, is_crowd_agg: true)
      field_agg.each do |name, agg|
        facets[name] = agg
      end
    end
    facets
  end

  private

  def missing_identifier_for_key(key)
    return DATE_MISSING_IDENTIFIER if key.to_s =~ /\b?date\b?/

    STRING_MISSING_IDENTIFIER
  end

  def bucket_agg_sort(sort)
    order = sort[:desc] ? "desc" : "asc"
    field = sort[:id] == "count" ? :_count : :_key
    { field => { order: order } }
  end

  def search_query
    @search_query ||= begin
      ast = (params[:q].presence || { key: "*" }).deep_symbolize_keys
      query_ast_to_query_string(ast)
    end
  end

  def query_ast_to_query_string(node)
    res =
      case node[:key]&.downcase
      when "and"
        (node[:children] || [])
          .map { |child_node| "(#{query_ast_to_query_string(child_node)})" }
          .join(" AND ")
      when "or"
        (node[:children] || [])
          .map { |child_node| "(#{query_ast_to_query_string(child_node)})" }
          .join(" OR ")
      else
        value = node[:key]&.downcase
        value&.split(" ")&.join(" AND ")
      end

    res.presence || "*"
  end

  def search_kick_query_options(aggs:, search_after: nil, reverse: false, skip_filters: [])
    body_options = { search_after: search_after }.delete_if { |_, v| v.blank? }
    {
      page: (params[:page] || 0) + 1,
      per_page: params[:page_size] || DEFAULT_PAGE_SIZE,
      order: search_kick_order_options(reverse: reverse),
      aggs: aggs,
      where: search_kick_where_options(skip_filters: skip_filters),
      smart_aggs: true,
      body_options: body_options,
    }
  end

  def search_kick_order_options(reverse: false)
    res = (params[:sorts] || []).map { |x| { x[:id].to_sym => (x[:desc] ^ reverse ? "desc" : "asc") } }
    res.push(nct_id: reverse ? "desc" : "asc") unless res.any? { |x| x.keys.first.to_sym == :nct_id }
    res
  end

  def search_kick_where_options(skip_filters: [])
    agg_filters = params[:agg_filters] || []
    crowd_agg_filters = params[:crowd_agg_filters] || []
    search_kick_agg_filters = search_kick_where_from_filters(filters: agg_filters, skip_filters: skip_filters)
    search_kick_crowd_agg_filters =
      search_kick_where_from_filters(
        filters: crowd_agg_filters,
        skip_filters: skip_filters,
        is_crowd_agg: true,
      )
    {
      _and: search_kick_agg_filters + search_kick_crowd_agg_filters,
    }
  end

  def key_for(filter:, is_crowd_agg: false)
    "#{is_crowd_agg ? 'fm_' : ''}#{filter[:field]}".to_sym
  end

  def scalars_filter(key, filter)
    return nil if filter.dig(:values).nil?

    selected_scalar_values = filter[:values].map { |val| { key => val } }
    selected_scalar_values << { key => nil } if filter.fetch(:include_missing_fields, false)
    { _or: selected_scalar_values }
  end

  def range_filter(key, filter)
    range_hash = filter.slice(:gte, :lte)
    return nil if range_hash.empty?

    select_for_range = { key => Hash[range_hash.map { |k, v| [k, cast(v)] }] }
    return { _or: [select_for_range, { key => nil }] } if filter.fetch(:include_missing_fields, false)

    select_for_range
  end

  # Returns an array of
  # [
  #   { or: [{"tag": "123"}, {"tag": "345"}]},
  #   { or: [{"state": "NY"}] },
  # ]
  def search_kick_where_from_filters(filters: [], skip_filters: [], is_crowd_agg: false)
    filters.map do |filter|
      key = key_for(filter: filter, is_crowd_agg: is_crowd_agg)
      next if skip_filters.include?(key)

      [
        scalars_filter(key, filter),
        range_filter(key, filter),
      ]
    end.compact.flatten
  end

  def find_visibile_options(agg_name, is_crowd_agg, current_site, url, config_type, return_all)
    return [] if current_site.blank? || return_all

    if !url || url.empty?
      view = current_site.site_views.find_by(default: true).view
    else

      view = current_site.site_views.find_by(url: url).view
    end
    case config_type ? config_type.downcase : config_type
      when nil , "facetbar"
        fields = view.dig(:search, is_crowd_agg ? :crowdAggs : :aggs, :fields)
      when "presearch"
        fields = view.dig(:search,:presearch, is_crowd_agg ? :crowdAggs : :aggs, :fields)
      when "autosuggest"
        fields = view.dig(:search,:autoSuggest, is_crowd_agg ? :crowdAggs : :aggs, :fields)
    end

    field = fields.find { |f| f[:name] == agg_name }
    field&.dig(:visibleOptions, :values) || []


  end

  def case_insensitive_regex_emulation(text)
    text.chars.map do |char|
      letter?(char) ? "[#{char.upcase}#{char.downcase}]" : char
    end.join("")
  end

  def one_of_regex(values)
    return nil if values.blank?

    values.join("|")
  end

  def letter?(char)
    char =~ /[[:alpha:]]/
  end

  def cast(val)
    return val unless val.is_a?(String)

    begin
      return Integer(val)
    rescue ArgumentError
    end

    begin
      return Float(val)
    rescue ArgumentError
    end

    parsed_time = Timeliness.parse(val)

    return parsed_time.utc unless parsed_time.nil?

    # default to string, which we split against pipe separator
    val
  end
end
