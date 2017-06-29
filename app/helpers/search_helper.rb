module SearchHelper

  def search_query
    @search ||= params.fetch('q', (current_user && current_user.default_query_string) || "*")
  end

  # Retrieves search params from request, performs the search, transforms the result to a response hash
  # @return [Hash] the JSON response
  def search_studies
    @studies = Study.search(search_query, query_args)
    return {
      :recordsTotal => @studies.total_entries,
      :data => @studies.map{|s| study_result_to_json(s)},
      :aggs => @studies.aggs
    }
  end

  def get_agg_buckets
    qargs = query_args
    agg = params["agg"]
    qargs[:aggs] = {
      agg => AGGS[agg.to_sym]
    }
    qargs[:aggs][agg].delete(:limit)
    qargs[:per_page] = 0
    @studies = Study.search(search_query, qargs)
    {
      :aggs => @studies.aggs
    }
  end

  # Transforms the study result to the expected format
  # This is useful for minimizing the size of the response as well
  # @param [Hash] result a searchkick raw elasticsearch result
  # @return [Hash] the expected format for the response
  def study_result_to_json(result)
    {
      nct_id: result[:nct_id],
      rating: result[:average_rating],
      title: result[:brief_title],
      status: result[:overall_status],
      started: result[:start_date],
      completed: result[:completion_date],

      # datatables identifier
      DT_RowId: result[:nct_id],
    }
  end

  # Manipulates the filter params to the expected value matching a "where" key
  # @return [Hash]
  def agg_where
    agg_filters = params.fetch(:agg_filters, {})
    if agg_filters.is_a?(String)
      agg_filters = JSON.parse(agg_filters)
    end
    where = Hash[agg_filters.map{|key, val|
      [key, val]
    }.reject{|x| x[1].empty? }.map{|x| [x[0], x[1].keys]}]

    ["start_date", "completion_date"].each do |key|
      if where.has_key?(key)
        unix_milliseconds_string = where[key].first  # only doing one!
        year = Time.at(unix_milliseconds_string.to_i / 1000).year
        where[key] = {
          gte: "#{year}||/y",
          lte: "#{year}||/y",
        }
      end
    end
    where
  end

  # Transforms ordering params from datatables to what's expected by searchkick
  # @return [Hash]
  def ordering
    if params[:order]
      Hash[params[:order].values.map{ |ordering|
        [COLUMNS_TO_ORDER_FIELD[ordering["column"].to_i], ordering["dir"].to_sym]
      }]
    elsif params[:sort]
      params[:sort]
    else
      {_score: :desc}
    end
  end

  # Transforms controller params into query args for a search
  # @return [Hash]
  def query_args
    {
      page: params[:start] ? (params[:start].to_i / params[:length].to_i).floor + 1 : 1,
      per_page: params[:length],
      load: false,
      order: ordering,
      aggs: enabled_aggs,
      where: agg_where,
      smart_aggs: false
    }
  end

  # @return [Hash]
  def enabled_aggs
    AGGS.select{|x,_| ENABLED_AGGS.include?(x) }
  end

  COLUMNS_TO_ORDER_FIELD = [
    :nct_id, :average_rating, :overall_status, :brief_title, :start_date, :completion_date
  ]

  ENABLED_AGGS = [
    :average_rating, :tags, :overall_status, :facility_states,
    :facility_cities, :facility_names, :study_type, :sponsors,
    :browse_condition_mesh_terms, :phase
  ]

  # aggregations
  AGGS = {
    average_rating: {
      order: {_term: :desc},
    },
    tags: {
      limit: 10
    },
    overall_status: {
      limit: 10
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
      limit: 10
    },
    facility_states: {
      limit: 10,
    },
    facility_cities: {
      limit: 10,
    },
    facility_names: {
      limit: 10,
    },
    study_type: {
      limit: 10,
    },
    sponsors: {
      limit: 10,
    },
    phase: {
      limit: 10,
    },
    browse_condition_mesh_terms: {
      limit: 10,
    },
  }
end
