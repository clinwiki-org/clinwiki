module SearchHelper

  def search_query
    s = params.fetch('q', (current_user && current_user.default_query_string))
    s = "*" if s.blank?
    @search ||= s
  end

  # Retrieves search params from request, performs the search, transforms the result to a response hash
  # @return [Hash] the JSON response
  def search_studies
    if search_query =~ /\.analyzed:/
      # supports lucene-style query
      result = Searchkick.client.search(lucene_params)
      return {
        recordsTotal: result['hits']['total'],
        data: result['hits']['hits'].map{|x| x['_source']}
      }
    else
      @studies = Study.search(search_query, query_args)
      return {
        :recordsTotal => @studies.total_entries,
        :data => @studies.map{|s| study_result_to_json(s)},
        :aggs => @studies.aggs
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
      sort: qargs[:order].to_a.map{|a| a.join(':')}.join(','),
      from: (qargs[:page] - 1) * qargs[:per_page],
      size: qargs[:page] * qargs[:per_page]
    }
  end

  # @return [Hash]
  def get_agg_buckets
    agg = params["agg"]
    qargs = query_args(agg)
    qargs[:aggs] = {
      agg => AGGS[agg.to_sym]
    }
    qargs[:aggs][agg].delete(:limit)
    qargs[:per_page] = 0
    qargs[:smart_aggs] = true
    @studies = Study.search(search_query, qargs)
    {
      :aggs => @studies.aggs
    }
  end

  # @return [Hash]
  def get_crowd_agg_buckets
    agg = params["agg"]
    qargs = query_args(agg)
    qargs[:aggs] = {
      "fm_#{agg}" => {}
    }
    qargs[:per_page] = 0
    qargs[:smart_aggs] = true
    @studies = Study.search(search_query, qargs)
    {
      agg => @studies.aggs["fm_#{agg}"]
    }
  end

  # Transforms the study result to the expected format
  # This is useful for minimizing the size of the response as well
  # @param [Hash] result a searchkick raw elasticsearch result
  # @return [Hash] the expected format for the response
  def study_result_to_json(result)
    # todo: allow for requested keys here
    if params["selectedColumns"]
      return Hash[params["selectedColumns"].map{|col| [col.to_sym, result[col.to_sym]]}]
    end
    response = {
      nct_id: result[:nct_id],
      average_rating: result[:average_rating],
      title: result[:brief_title],
      overall_status: result[:overall_status],
      start_date: result[:start_date],
      completion_date: result[:completion_date],
    }
    if result.has_key?(:rating_dimensions)
      response = response.merge(Hash[result[:rating_dimensions].map{|dim| [dim, result[dim]]}])
    end
    response
  end

  # Manipulates the filter params to the expected value matching a "where" key
  # @return [Hash]
  def agg_where(curr_agg = nil)
    agg_filters = params.fetch(:aggFilters, {})
    if agg_filters.is_a?(String)
      agg_filters = JSON.parse(agg_filters)
    end

    new_agg_filters = params.fetch(:aggFilters, params.fetch(:agg_filters, {}))
    if new_agg_filters.is_a?(Array)
      where = {_and: []}
      new_agg_filters.each do |filter|
        if filter.field && !filter.values.empty?
          where[:_and] << {:_or => filter.values.map{ |val| { filter.field => val } } }
        end
      end
    else
      if new_agg_filters && !new_agg_filters.empty?
        where = {_and: []}
        new_agg_filters.each do |key, vals|
          next if (!curr_agg.nil?) && curr_agg == key
          conjs = []
          unless vals.nil? || vals.empty?
            vals.each do |val|
              conjs << {key => val}
            end
          end
          where[:_and] << {:_or => conjs} unless conjs.empty?
        end
      else
        where = Hash[agg_filters.map{|key, val|
          [key, val]
        }.reject{|x| x[1].empty? }.map{|x| [x[0], x[1].keys]}]
      end
    end

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

  DESC_TO_SYM = { false => :asc, true => :desc }
  ORDERING_MAP = { "title" => "brief_title" }

  # Transforms ordering params from datatables to what's expected by searchkick
  # @return [Hash]
  def ordering
    if params[:order]
      Hash[params[:order].values.map{ |ordering|
        [COLUMNS_TO_ORDER_FIELD[ordering["column"].to_i], ordering["dir"].to_sym]
      }]
    elsif params[:sorted]
      Hash[params[:sorted].map{ |ordering|
        [ORDERING_MAP.fetch(ordering["id"], ordering["id"]), DESC_TO_SYM[ordering["desc"]]]
      }]
    elsif params[:sort]
      params[:sort]
    elsif params[:sorts]
      Hash[params[:sorts].map{|x| x.split(' ')}]
    else
      {_score: :desc}
    end
  end

  def get_page_params
    if params.has_key?(:page) && (params.has_key?(:pageSize) || params.has_key?(:page_size))
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
    get_page_params.merge({
      load: false,
      order: ordering,
      aggs: enabled_aggs,
      where: agg_where(curr_agg),
      smart_aggs: false,
    })
  end

  # @return [Hash]
  def enabled_aggs
    Hash[AGGS
      .select{|x,_| ENABLED_AGGS.include?(x) }
      .map{|k,v|
        # don't include the "where" for the current agg
        this_where = agg_where.select{|x,_| x.to_s != k.to_s}
        if this_where.blank?
          [k, v]
        else
          [k, v.merge({
            where: this_where
            })]
        end
      }]
  end

  COLUMNS_TO_ORDER_FIELD = [
    :nct_id, :average_rating, :overall_status, :brief_title, :start_date, :completion_date
  ]

  ENABLED_AGGS = [
    :average_rating, :tags, :overall_status, :facility_states,
    :facility_cities, :facility_names, :study_type, :sponsors,
    :browse_condition_mesh_terms, :phase, :rating_dimensions,
    :browse_interventions_mesh_terms, :front_matter_keys,
  ]

  # aggregations
  AGGS = {
    average_rating: {
      order: {_term: :desc},
    },
    tags: {
      limit: 10,
      order: {"_term" => "asc"}
    },
    overall_status: {
      limit: 10,
      order: {"_term" => "asc"}
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
    browse_interventions_mesh_terms: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    facility_states: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    facility_cities: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    facility_names: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    study_type: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    sponsors: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    phase: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    browse_condition_mesh_terms: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    rating_dimensions: {
      limit: 10,
      order: {"_term" => "asc"},
    },
    front_matter_keys: {
      limit: 10,
      order: {"_term" => "asc"},
    }
  }
end
