module Mutations
  class UpsertReview < BaseMutation
    field :review, Types::ReviewType, null: true
    field :errors, [String], null: true

    argument :id, Int, required: false
    argument :nctId, String, required: true
    argument :meta, String, "Json key value pairs of meta information.", required: true
    argument :content, String, "Markdown version of the text", required: true

    def resolve(id: nil, nct_id:, meta:, content:)
      review = Review.find_or_initialize_by(id: id)
      review.nct_id = nct_id
      review.front_matter = JSON.parse(meta)
      review.content = content
      # Internal field for calculating averages
      review.overall_rating = review.front_matter["Overall Rating"].to_i
      review.user = current_user
      if review.save
        { review: review, errors: nil }
      else
        { review: nil, errors: review.errors.full_messages }
      end
    end
  end
end
