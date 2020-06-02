module Mutations
  class DeleteReaction < BaseMutation
    field :reaction, Types::ReactionType, null: false
    field :errors, [String], null: true

    argument :id, Integer,"ID of reaction", required: true



    def resolve(attrs)
      reaction = Reaction.find(attrs[:id])
      if current_user.id == reaction.user_id
        reaction.destroy
        { reaction: reaction, errors: nil }
      else
        {reaction:nil, errors: ["#{current_user.email} does not have this reaction"]}
      end

      rescue ActiveRecord::RecordNotFound
          {reaction:nil, errors: ["Reaction not found"]}
    end

    def authorized?(_)
      current_user.present?
    end

  end
end
