class Review < ApplicationRecord
  include FrontMatterHelper
  include TriggersStudyReindex
  include BelongsToStudy

  alias stars front_matter

  belongs_to :user
  belongs_to :study, foreign_key: :nct_id

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
    }

    result[:stars] = front_matter.presence || { "Overall Rating" => overall_rating }
    result[:text] = parsed.content if parsed&.content
    result
  end
end
