class WikiPageController < ApplicationController
  include WikiHelper
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!, only: [:get]

  def get
    page = WikiPage.find_by(nct_id: params[:study_id])
    if page.nil?
      render json: { exists: false }
    else
      render json: { exists: true }.merge(page.to_json)
    end
  end

  def post
    if (! params[:study_id] || params[:text])
      return status 400
    end
    create_or_update_wiki_page_for_study
    render json: { exists: true }.merge(@wiki_page.to_json)
  end

end
