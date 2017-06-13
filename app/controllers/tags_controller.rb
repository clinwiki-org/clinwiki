class TagsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_user, only: [:edit, :update, :destroy]

  def index
    @tags=Tag.where('nct_id=?',params['id'])
  end

  def create
    @tags=Tag.where('nct_id=?', params['nct_id'])
    @tag=Tag.create_from(params,current_user)
    render :json => @tag
  end

  def destroy
    if params.has_key?('id')
      tag_id=params['id']
      @tag=Tag.find(tag_id)
    else
      @tag=Tag.find_by(value: params['tag'], nct_id: params['nctId'])
    end
    @tag.destroy
    @tags=Tag.where('nct_id=?',params['nct_id'])
    render :json => @tags
  end

  private

  def check_user
    if params['id'].include?('tag')
      tag_id=params['id'].split('_', 2).last
    else
      tag_id=params['id']
    end
    @tag=Tag.find(tag_id) if @tag.nil?
    @study=Study.find(@tag.nct_id)
    unless (@tag.user == current_user) || (current_user.admin?)
      redirect_to root_url, alert: "Sorry, this tag belongs to someone else"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def tag_params
    params.require(:nct_id).permit(:value, :user_id)
  end
end
