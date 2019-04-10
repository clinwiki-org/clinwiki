module Mutations
  class DeleteReview < BaseMutation
    field :success, Boolean, null: false
    field :errors, [String], null: true

    argument :id, Int, required: true

    def resolve(id:)
      review = Review.find_by(id: id)
      return { success: false, errors: ["Review not found"] } if review.blank?

      if review.destroy
        { success: true, errors: nil }
      else
        { success: false, errors: review.errors.full_messages }
      end
    end
  end
end
