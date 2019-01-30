class ReviewsController < ApplicationController
  skip_before_action  :verify_authenticity_token
  before_action :authenticate_user!, except: [:index]

  include WikiHelper

  def index
    render json: Review.where(nct_id: params['nct_id']).map{ |r|
      p r.text
      {
        review: r.to_json,
        user: r.user,
      }
    }
  end

  def create
    @review = Review.new(
      nct_id: params[:nct_id],
      user_id: current_user.id,
      text: combined_markdown(params[:review], params[:stars].as_json)
    )

    if (params[:stars]["Overall Rating"])
      @review.overall_rating = params[:stars]["Overall Rating"]
    end

    respond_to do |format|
      if @review.save
        format.json { render json: @review.to_json }
      else
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @review = Review.find(params['id'])
    @review.text = combined_markdown(params[:review], params[:stars].as_json)
    respond_to do |format|
      if @review.save
        format.json { render json: @review.to_json }
      else
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

  def delete
    Review.find(params[:id]).destroy
    respond_to do |format|
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
end
