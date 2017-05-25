class StudiesController < ApplicationController
  before_action :get_study, only: [:show, :edit]

  # aggregations
  AGGS = {
    average_rating: {
      order: {_term: :desc},
    },
    tags: {
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
  }

  def search
    @search = params.fetch('q', current_user.default_query_string)
    query_args = {
      page: params[:start] ? (params[:start].to_i / params[:length].to_i).floor : 1,
      per_page: params[:length],
      load: false,
      order: ordering,
      aggs: AGGS
    }
    # this is what you get for a blank search
    if !@search.blank?
      orig_studies = Study.search(@search, query_args)
      if params['search'] && params['search']['value']
        @studies = Study.search("#{@search} #{params['search']['value']}", query_args)
      else
        @studies = orig_studies
      end
    else
      orig_studies = Study.search("*", query_args)
      @studies = orig_studies
    end
    render json: {
      :draw => params[:draw],
      :recordsTotal => orig_studies.total_entries,
      :recordsFiltered => @studies.total_entries,
      :data => @studies.map{|s| study_result_to_json(s)},
      :aggs => @studies.aggs
    }
  end

  def index
    @search = params.fetch('q', current_user.default_query_string)
    p @search.inspect
  end

  private

  def get_study
    @study = Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end

  COLUMNS_TO_ORDER_FIELD = [
    :nct_id, :average_rating, :overall_status, :brief_title, :start_date, :completion_date
  ]

  # Transforms ordering params from datatables to what's expected by searchkick
  # @return [Hash]
  def ordering
    if params[:order]
      Hash[params[:order].values.map{ |ordering|
        [COLUMNS_TO_ORDER_FIELD[ordering["column"].to_i], ordering["dir"].to_sym]
      }]
    else
      {_score: :desc}
    end
  end

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

end
