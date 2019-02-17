MAX_AGGREGATION_LIMIT = 1_000_000
DEFAULT_PAGE_SIZE = 25

# TODO: make module smaller
module SearchHelper # rubocop:disable Metrics/ModuleLength
  def search_query
    s = params.fetch("q", current_user&.default_query_string)
    s = "*" if s.blank?
    @search_query ||= s
  end

  # Retrieves search params from request, performs the search, transforms the result to a response hash
  # @return [Hash] the JSON response
  def search_studies
    if search_query.match?(/\.analyzed:/)
      # supports lucene-style query
      result = Searchkick.client.search(lucene_params)
      {
        recordsTotal: result["hits"]["total"],
        data: result["hits"]["hits"].map { |x| x["_source"] },
      }
    else
      @studies = Study.search(search_query, query_args)
      {
        recordsTotal: @studies.total_entries,
        data: @studies.map { |s| study_result_to_json(s) },
        aggs: @studies.aggs,
      }
    end
  end

  # transforms qargs in searchkick to lucene params
  # @return [Hash]
  def lucene_params
    qargs = query_args
    {
      index: Study.search_index.name,
      q: "_type:study AND #{search_query}",
      sort: qargs[:order].to_a.map { |a| a.join(":") }.join(","),
      from: (qargs[:page] - 1) * qargs[:per_page],
      size: qargs[:page] * qargs[:per_page],
    }
  end

  # Caveat - use only both page + pageSize params, or none of them
  # @return [Hash]
  # TODO: refactor
  def agg_buckets # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
    agg = params["agg"]
    if params["agg_options_filter"].present?
      # We don"t need to keep filters of the same agg, we want broader results
      # But we need to respect all other filters
      params["agg_filters"]&.delete_if { |filter_entry| filter_entry&.field == agg }
      params["agg_filters"] ||= []
      regex = case_insensitive_regex_emulation(".*#{params['agg_options_filter']}.*")
      filter = OpenStruct.new("field": agg, "values": [regex])
      params["agg_filters"] << filter
    end

    qargs = query_args(agg)
    qargs[:aggs] = {
      agg => AGGS[agg.to_sym].deep_dup,
    }
    qargs[:aggs][agg][:limit] = MAX_AGGREGATION_LIMIT
    qargs[:per_page] = 0
    qargs[:smart_aggs] = true

    @studies = Study.search(search_query, qargs)

    # Some of the values are multivalue => the doc will have aggs not matching
    # the actual regex and we need to filter it again
    if params["agg_options_filter"].present?
      regex = Regexp.new("^.*#{params['agg_options_filter'].downcase}.*$", "i")
      @studies
        .aggs[agg]["buckets"]
        .keep_if { |entry| entry["key"] =~ regex }
    end

    page = params[:page] || 0
    page_size = params[:page_size] || DEFAULT_PAGE_SIZE
    @studies.aggs[agg]["buckets"] = @studies
      .aggs[agg]["buckets"]
      .drop(page * page_size)
      .first(page_size)
    {
      aggs: @studies.aggs,
    }
  end

  # @return [Hash]
  def crowd_agg_buckets # rubocop:disable Metrics/AbcSize
    agg = params["agg"]
    if params["agg_options_filter"].present?
      # We don"t need to keep filters of the same agg, we want broader results
      # But we need to respect all other filters
      params["crowd_agg_filters"]&.delete_if { |filter_entry| filter_entry&.field == agg }
      params["crowd_agg_filters"] ||= []
      regex = case_insensitive_regex_emulation(".*#{params['agg_options_filter']}.*")
      filter = OpenStruct.new("field": agg, "values": [regex])
      params["crowd_agg_filters"] << filter
    end
    qargs = query_args(agg)
    qargs[:aggs] = {
      "fm_#{agg}": { limit: MAX_AGGREGATION_LIMIT },
    }
    qargs[:per_page] = 0
    qargs[:smart_aggs] = true
    @studies = Study.search(search_query, qargs)

    # Some of the values are multivalue => the doc will have aggs not matching
    # the actual regex and we need to filter it again
    if params["agg_options_filter"].present?
      regex = Regexp.new("^.*#{params['agg_options_filter'].downcase}.*$", "i")
      @studies
        .aggs["fm_#{agg}"]["buckets"]
        .keep_if { |entry| entry["key"] =~ regex }
    end

    page = params[:page] || 0
    page_size = params[:page_size] || DEFAULT_PAGE_SIZE
    @studies.aggs["fm_#{agg}"]["buckets"] = @studies
      .aggs["fm_#{agg}"]["buckets"]
      .drop(page * page_size)
      .first(page_size)

    {
      agg: @studies.aggs["fm_#{agg}"],
    }
  end

  # Transforms the study result to the expected format
  # This is useful for minimizing the size of the response as well
  # @param [Hash] result a searchkick raw elasticsearch result
  # @return [Hash] the expected format for the response
  def study_result_to_json(result)
    # TODO: allow for requested keys here
    return Hash[params["selectedColumns"].map { |col| [col.to_sym, result[col.to_sym]] }] if params["selectedColumns"]

    response = {
      nct_id: result[:nct_id],
      average_rating: result[:average_rating],
      title: result[:brief_title],
      overall_status: result[:overall_status],
      start_date: result[:start_date],
      completion_date: result[:completion_date],
    }

    if result.key?(:rating_dimensions)
      response = response.merge(Hash[result[:rating_dimensions].map { |dim| [dim, result[dim]] }])
    end
    response
  end

  # Manipulates the filter params to the expected value matching a "where" key
  # @return [Hash]
  # TODO: refactor to reduce complexity
  def agg_where(curr_agg = nil) # rubocop:disable Metrics/CyclomaticComplexity
    agg_filters = params.fetch(:aggFilters, params.fetch(:agg_filters, {}))
    where = { _and: [] }
    if agg_filters.is_a?(Array)
      agg_filters.reject { |filter| filter.field == curr_agg }.each do |filter|
        if filter.field && !filter.values.empty?
          where[:_and] << { _or: filter.values.map { |val| { filter.field => val } } }
        end
      end
    end

    # note: the snake case is the one that actually has the data. Not sure who"s transforming it though.
    crowd_agg_filters = params.fetch(:crowdAggFilters, params.fetch(:crowd_agg_filters, {}))
    if crowd_agg_filters.is_a?(Array)
      crowd_agg_filters.each do |filter|
        if filter.field && !filter.values.empty?
          key = "fm_" + filter.field
          where[:_and] << { _or: filter.values.map { |val| { key => val } } }
        end
      end
    end

    ["start_date", "completion_date"].select { |key| where.key?(key) }.each do |key|
      unix_milliseconds_string = where[key].first # only doing one!
      year = Time.at(unix_milliseconds_string.to_i / 1000).utc.year
      where[key] = {
        gte: "#{year}||/y",
        lte: "#{year}||/y",
      }
    end
    where
  end

  DESC_TO_SYM = { false => :asc, true => :desc }.freeze
  ORDERING_MAP = { "title" => "brief_title" }.freeze

  # Transforms ordering params from datatables to what"s expected by searchkick
  # @return [Hash]
  def ordering
    if params[:order]
      Hash[params[:order].values.map do |ordering|
        [COLUMNS_TO_ORDER_FIELD[ordering["column"].to_i], ordering["dir"].to_sym]
      end]
    elsif params[:sorted]
      Hash[params[:sorted].map do |ordering|
        [ORDERING_MAP.fetch(ordering["id"], ordering["id"]), DESC_TO_SYM[ordering["desc"]]]
      end]
    elsif params[:sort]
      params[:sort]
    elsif params[:sorts]
      # the graphql case
      Hash[params[:sorts].map { |x| [ORDERING_MAP.fetch(x.id, x.id), x.desc ? "desc" : "asc"] }]
    else
      { _score: :desc }
    end
  end

  def page_params
    if params.key?(:page) && (params.key?(:pageSize) || params.key?(:page_size))
      {
        page: params[:page] + 1,
        per_page: params.fetch(:pageSize, params.fetch(:page_size, 25)),
      }
    else
      {
        page: params[:start] ? (params[:start].to_i / params[:length].to_i).floor + 1 : 1,
        per_page: params[:length],
      }
    end
  end

  # Transforms controller params into query args for a search
  # @return [Hash]
  def query_args(curr_agg = nil)
    page_params.merge(
      load: false,
      order: ordering,
      aggs: enabled_aggs,
      where: agg_where(curr_agg),
      smart_aggs: false,
    )
  end

  # @return [Hash]
  def enabled_aggs
    Hash[AGGS
      .select { |x, _| ENABLED_AGGS.include?(x) }
      .map do |k, v|
        # don"t include the "where" for the current agg
        this_where = agg_where.reject { |x, _| x.to_s == k.to_s }
        if this_where.blank?
          [k, v]
        else
          [k, v.merge(
            where: this_where,
          )]
        end
      end]
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

  COLUMNS_TO_ORDER_FIELD = %i[
    nct_id average_rating overall_status brief_title start_date completion_date
  ].freeze

  ENABLED_AGGS = %i[
    average_rating tags overall_status facility_states
    facility_cities facility_names study_type sponsors
    browse_condition_mesh_terms phase rating_dimensions
    browse_interventions_mesh_terms interventions_mesh_terms
    front_matter_keys
  ].freeze

  # aggregations
  AGGS = {
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
end
