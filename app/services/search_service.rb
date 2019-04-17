MAX_AGGREGATION_LIMIT = 1_000_000
ORDERING_MAP = { "title" => "brief_title" }.freeze
DEFAULT_PAGE_SIZE = 25
ENABLED_AGGS = %i[
  average_rating tags overall_status facility_states
  facility_cities facility_names study_type sponsors
  browse_condition_mesh_terms phase rating_dimensions
  browse_interventions_mesh_terms interventions_mesh_terms
  front_matter_keys
].freeze

# aggregations
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
      field: :completion_date,
      interval: :year,
    },
    limit: 10,
  },
  completion_date: {
    date_histogram: {
      field: :completion_date,
      interval: :year,
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

class SearchService # rubocop:disable Metrics/ClassLength
  attr_reader :params

  # @param params - hash representing SearchInputType with symbols as keys.
  def initialize(params)
    @params = params.deep_dup.freeze
  end

  # Search results from params
  # @return [Hash] the JSON response
  def search(search_after: nil, reverse: false)
    options = search_kick_query_options(params: params, search_after: search_after, reverse: reverse)
    # options[:includes] = [:wiki_page, :reviews]

    search_result = Study.search("*", options) do |body|
      body[:query][:bool][:must] = { query_string: { query: search_query } }
    end
    {
      recordsTotal: search_result.total_entries,
      studies: search_result.results,
      aggs: search_result.aggs,
    }
  end

  def agg_buckets_for_field(field:, is_crowd_agg: false) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/LineLength
    params = self.params.deep_dup
    key_prefix = is_crowd_agg ? "fm_" : ""
    key = "#{key_prefix}#{field}".to_sym

    has_options_filter = params[:agg_options_filter].present?
    if has_options_filter
      # We don't need to keep filters of the same agg, we want broader results
      # But we need to respect all other filters
      params[:agg_filters]&.delete_if { |filter_entry| filter_entry[:field] == field }
      params[:agg_filters] ||= []
      regex = case_insensitive_regex_emulation(".*#{params[:agg_options_filter]}.*")
      params[:agg_filters] << { field: key.to_s, values: [regex] }
    end

    options = search_kick_query_options(
      params: params,
      aggs: { key => DEFAULT_AGG_OPTIONS[key]&.deep_dup || {} },
      skip_filters: [key],
    )
    options[:aggs][key][:limit] = MAX_AGGREGATION_LIMIT
    options[:per_page] = 0
    options[:smart_aggs] = true
    options[:load] = false

    aggs = Study.search(search_query, options).aggs.to_h.deep_symbolize_keys

    # Some of the values are multivalue => the doc will have aggs not matching
    # the actual regex and we need to filter it again
    if has_options_filter
      regex = Regexp.new("^.*#{params[:agg_options_filter].downcase}.*$", "i")
      aggs[key][:buckets]
        .keep_if { |entry| entry[:key] =~ regex }
    end

    page = params[:page] || 0
    page_size = params[:page_size] || DEFAULT_PAGE_SIZE
    aggs[key][:buckets] =
      aggs[key][:buckets]
      .drop(page * page_size)
      .first(page_size)

    aggs
  end

  private

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

  def search_kick_query_options(params:, aggs: ENABLED_AGGS, search_after: nil, reverse: false, skip_filters: [])
    body_options = { search_after: search_after }.delete_if { |_, v| v.blank? }
    {
      page: (params[:page] || 0) + 1,
      per_page: params[:page_size] || DEFAULT_PAGE_SIZE,
      order: search_kick_order_options(params: params, reverse: reverse),
      aggs: aggs,
      where: search_kick_where_options(params: params, skip_filters: skip_filters),
      smart_aggs: true,
      body_options: body_options,
    }
  end

  def search_kick_order_options(params:, reverse: false)
    res = (params[:sorts] || []).map { |x| { x[:id].to_sym => (x[:desc] ^ reverse ? "desc" : "asc") } }
    res.push(nct_id: reverse ? "desc" : "asc") unless res.any? { |x| x.keys.first.to_sym == :nct_id }
    res
  end

  def search_kick_where_options(params:, skip_filters: [])
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

  # Returns an array of
  # [
  #   { or: [{"tag": "123"}, {"tag": "345"}]},
  #   { or: [{"state": "NY"}] },
  # ]
  def search_kick_where_from_filters(filters: [], skip_filters: [], is_crowd_agg: false)
    cleaned_filters =
      filters
        .select { |filter| filter[:field] && !filter.values.empty? }
        .reject do |filter|
          key_prefix = is_crowd_agg ? "fm_" : ""
          key = "#{key_prefix}#{filter[:field]}".to_sym
          skip_filters.include?(key)
        end

    cleaned_filters.map do |filter|
      key_prefix = is_crowd_agg ? "fm_" : ""
      key = "#{key_prefix}#{filter[:field]}"
      { _or: filter[:values].map { |val| { key => val } } }
    end
  end

  def case_insensitive_regex_emulation(text)
    regex_string = text.chars.map do |char|
      letter?(char) ? "[#{char.upcase}#{char.downcase}]" : char
    end.join("")
    Regexp.new(regex_string)
  end

  def letter?(char)
    char =~ /[[:alpha:]]/
  end
end
