class ReviewsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  before_action :authenticate_user!, except: [:index]
  before_action :check_user, only: [:edit, :update, :destroy]

  def new
    get_study
    @review = Review.new({:nct_id=>@nct_id})
  end

  def index
    respond_to do |format|
      format.html do
        get_study
        render :index
      end
      format.json do
        render json: Review.where(nct_id: params['nct_id']).map{ |r|
          {
            review: r,
            user: r.user,
          }
        }
      end
    end
  end

  def create
    get_study
    @review = Review.new(review_params)
    @review.user_id = current_user.id
    @review.nct_id = @nct_id

    respond_to do |format|
      if @review.save
        format.html { redirect_to :action => 'index', notice: 'Review was successfully created.', nct_id: @nct_id }
        format.json { render json: { status: :created, id: @review.id } }
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
        format.json { render json: { status: :updated, id: @review.id } }
      else
        format.html { render :edit }
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    respond_to do |format|
      format.json do
        render json: Review.find(params['id']).to_json
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
    if params['nct_id']
      @nct_id=params['nct_id']
    else
      @nct_id=@review.nct_id
    end
    @study=Study.find(@nct_id)
  end

  def check_user
    @review=Review.find(params['id']) if @review.nil?
    @study=Study.find(@review.nct_id)
    unless (@review.user == current_user) || (current_user.admin?)
      redirect_to root_url, alert: "Sorry, this review belongs to someone else"
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def review_params
    params.require(:review).permit(:rating, :comment, :nct_id)
  end
end
