class TagsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_user, only: [:edit, :update, :destroy]

  def index
    @tags=Tag.where('nct_id=?',params['id'])
  end

  def create
    Tag.new({:nct_id=>params['nct_id'],:value=>params[:new_tag],:user=>current_user}).save!
    @tags=Tag.where('nct_id=?',params['nct_id'])
    head :ok
  end

  def destroy
    @tag=Tag.find(params['id'])
    @tag.destroy
    head :ok
  end

  private

  def check_user
    @tag=Tag.find(params['id']) if @tag.nil?
    @study=Study.retrieve(@tag.nct_id).first
    unless (@tag.user == current_user) || (current_user.admin?)
      redirect_to root_url, alert: "Sorry, this tag belongs to someone else"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def tag_params
    params.require(:nct_id).permit(:value, :user_id)
  end
end
