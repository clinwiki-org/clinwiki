class StudiesController < ApplicationController
  before_action :get_study, only: [:show, :edit]

  def search
    @search = params.fetch('q', current_user.default_query_string)
    query_args = {
      page: params[:start] ? (params[:start].to_i / params[:length].to_i).floor : 1,
      per_page: params[:length],
      load: false,
      order: ordering
    }
    orig_studies = Study.search(@search, query_args)
    if params['search'] && params['search']['value']
      @studies = Study.search("#{@search} #{params['search']['value']}", query_args)
    else
      @studies = orig_studies
    end
    render json: {
      :draw => params[:draw],
      :recordsTotal => orig_studies.total_entries,
      :recordsFiltered => @studies.total_entries,
      :data => @studies.map{|s| study_result_to_json(s)}
    }
  end

  def index
    @search = params.fetch('q', current_user.default_query_string)
  end

  private

  def get_study
    @study=Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end

  COLUMNS_TO_ORDER_FIELD = [
    :nct_id, :rating, :overall_status, :brief_title, :start_date, :completion_date
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
