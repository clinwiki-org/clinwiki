class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user, only: [:edit, :update, :destroy]

  def new
    set_study
    @review = Review.new({:nct_id=>@study.nct_id})
  end

  def index
    set_study
  end

  def create
    @review = Review.new(review_params)
    @review.user_id = current_user.id
    @review.nct_id = params['nct_id']
    set_study

    respond_to do |format|
      if @review.save
        format.html { redirect_to :action => 'index', notice: 'Review was successfully created.', nct_id: @review.nct_id }
        format.json { render :show, status: :created, location: @review }
      else
        format.html { render :new }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @review.update(review_params)
        format.html { redirect_to :action => 'index', notice: 'Review was successfully updated.', nct_id: @review.nct_id }
        format.json { render :show, status: :ok, location: @review }
      else
        format.html { render :edit }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @review.destroy
    respond_to do |format|
      format.html { redirect_to :action => 'index', notice: 'Review was successfully removed.', nct_id: @review.nct_id }
      format.json { head :no_content }
    end
  end

  private

  def set_study
    @study=Retriever.get(params[:nct_id]).first
    @tags=Tag.where('nct_id=?',params[:nct_id])
  end

  def check_user
    @review=Review.find(params['id']) if @review.nil?
    @study=Retriever.get(@review.nct_id).first
    unless (@review.user == current_user) || (current_user.admin?)
      redirect_to root_url, alert: "Sorry, this review belongs to someone else"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def review_params
    params.require(:review).permit(:rating, :comment)
  end
end
