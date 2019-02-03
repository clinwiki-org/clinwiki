require 'reindexes_study'
class Review < ReindexesStudy
  include WikiModelHelper

  alias_method :stars, :front_matter

  belongs_to :user

  def default_content
    "Add your review!"
  end

  def to_json
    result = {
      id: id,
      nct_id: nct_id,
      created_at: created_at,
      updated_at: updated_at,
      text: content,
      overall_rating: overall_rating,
      # text_html: text_html,
    }

    if front_matter.present?
      result[:stars] = front_matter
    else
      result[:stars] = { "Overall Rating" => overall_rating }
    end

    if parsed&.content
      result[:text] = parsed.content
    end

    result
  end

end
