class StudiesController < ApplicationController
  include SearchHelper
  before_action :get_study, only: [:show, :edit]
  skip_before_filter :verify_authenticity_token, only: [:search]
  skip_before_filter :authenticate_user!  # todo -- figure out

  def search
    render json: search_studies
  end

  def index
    @search = params.fetch('q', current_user.default_query_string)
  end

  def json
    study = Study.find(params[:study_id])
    render json: study.to_json
  end

  def administrative
    render json: Study.find(params[:study_id]).administrative_info
  end

  def recruitment
    render json: Study.find(params[:study_id]).recruitment_info
  end

  def tracking
    render json: Study.find(params[:study_id]).tracking_info
  end

  def descriptive
    render json: Study.find(params[:study_id]).descriptive_info
  end

  def crowd
    render json: Study.find(params[:study_id]).crowd_source_info
  end

  private

  def get_study
    @study = Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end
end
