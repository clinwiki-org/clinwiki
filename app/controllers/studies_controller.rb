class StudiesController < ApplicationController
  before_action :get_study, only: [:show, :edit]

  def search
    if params[:search].present?
      search_studies
    else
      get_studies
    end
  end

  def show
    @sections=DisplayConfiguration.sections
    get_study
  end

  def index
    get_studies
  end

  private

  def get_study
    @study=Study.find(params[:id])
    @study.init_annotations if @study.annotations.empty?
  end

  def get_studies
    session_studies=UserSessionStudy.where('user_id=?',current_user.id).uniq.pluck(:nct_id)
    if session_studies.size==0
      set_default_query_string
      search_studies
    else
      @studies=Study.find(session_studies)
    end
  end

  def search_studies
    @studies=Retriever.get(params['search'])
    set_session_studies
  end

  def set_session_studies
    Spawnling.new do
      UserSessionStudy.where('user_id=?',current_user.id).destroy_all
      @studies.each{|s|
        UserSessionStudy.new({:user_id=>current_user.id,:nct_id=>s.nct_id,:serialized_study=>s.to_json}).save!
      }
    end
  end

  def set_default_query_string
    params['search']=current_user.default_query_string if params['search'].nil? and !current_user.default_query_string.nil?
  end

end
