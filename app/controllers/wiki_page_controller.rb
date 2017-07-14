class WikiPageController < ApplicationController
  include WikiHelper
  skip_before_filter :verify_authenticity_token
  skip_before_filter :authenticate_user!, only: [:get, :history]

  def get
    page = WikiPage.find_by(nct_id: params[:study_id])
    if page.nil?
      render json: { exists: true }.merge(WikiPage.new(nct_id: params[:study_id]).to_json)
    else
      render json: { exists: true }.merge(page.to_json)
    end
  end

  def post
    if (! params[:study_id])
      return status 400
    end
    create_or_update_wiki_page_for_study
    render json: { exists: true }.merge(@wiki_page.to_json)
  end

  def history
    wiki_page = get_study!.wiki_page
    if wiki_page.nil?
      return status 404
    end

    render json: {
      history: wiki_page.wiki_page_edits.order(created_at: :desc).map(&:to_json)
    }
  end

end
