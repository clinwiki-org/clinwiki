class StudiesController < ApplicationController
  include SearchHelper
  before_action :get_study, only: [:show, :edit]
  skip_before_filter :verify_authenticity_token, only: [:search]

  def search
    render json: search_studies
  end

  def index
    @search = params.fetch('q', current_user.default_query_string)
  end

  private

  def get_study
    @study = Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end
end
