module Mutations
  class CreateReaction < BaseMutation
    field :reaction, Types::ReactionType, null: true
    field :errors, [String], null: true

    argument :reaction_kind_id, Integer, required: true
    argument :nct_id, String, required: true


    def resolve(attrs)
      reaction = Reaction.new(attrs.to_h)
      reaction.user_id = current_user.id
      ActiveRecord::Base.transaction do
        reaction.save
        { reaction: reaction, errors: reaction.errors.full_messages }
      end

    end

    def authorized?(_)
      current_user.present?
    end

  end
end
