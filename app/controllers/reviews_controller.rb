class ReviewsController < ApplicationController
  before_action :authenticate_user!
  before_action :check_user, only: [:edit, :update, :destroy]

  def new
    get_study
    @review = Review.new({:nct_id=>@nct_id})
  end

  def index
    get_study
  end

  def create
    get_study
    @review = Review.new(review_params)
    @review.user_id = current_user.id
    @review.nct_id = @nct_id

    respond_to do |format|
      if @review.save
        format.html { redirect_to :action => 'index', notice: 'Review was successfully created.', nct_id: @nct_id }
        format.json { render :show, status: :created, location: @review }
      else
        format.html { render :new }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    @review = Review.find(params['id'])
    @nct_id=@review.nct_id
    get_study
  end

  def update
    get_study
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

  def get_study
    @nct_id=params['nct_id']
    @study=Retriever.get_study(@nct_id)
    @reviews = Review.where('nct_id = ?',@nct_id)
    @reviews = [] if @reviews.nil?
    @study.reviews = @reviews
    @tags=Tag.where('nct_id=?',@nct_id)
    @study.tags=@tags
    @study.average_rating = (@study.reviews.size == 0 ? 0 : @study.reviews.average(:rating).round(2))
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
