class StudiesController < ApplicationController
  include SearchHelper
  before_action :get_study, only: [:show, :edit]
  skip_before_filter :verify_authenticity_token, only: [:search, :index, :agg_buckets]
  skip_before_filter :authenticate_user!  # todo -- figure out

  def search
    render json: search_studies
  end

  def agg_buckets
    render json: get_agg_buckets
  end

  def index
    @search = '*'
    render json: search_studies
  end

  def json
    study = Study.find(params[:study_id])
    study.exclude_wiki_data if params[:wiki_override] != "true"  # grr
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

  private

  def get_study
    @study = Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end
end
