class TagsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  before_action :authenticate_user!
  before_action :check_user, only: [:edit, :update, :destroy]

  def create
    puts "================================ create tag"
    t=Tag.new({:nct_id=>params['nct_id'],:value=>params[:new_tag],:user=>current_user}).save!
    puts t.inspect
    head :ok
  end

  def destroy
    @tag=Tag.where('nct_id=? and value=?',params['id'],params[:selected_tag])
    @tag.destroy
    respond_to do |format|
      format.html { redirect_to :action => 'index', notice: 'Tag was removed.', nct_id: @tag.nct_id }
      format.json { head :no_content }
    end
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
