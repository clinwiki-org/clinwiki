module Types
  class ReactionType < BaseObject
    field :id, Int, "Id", null: false
    field :reaction_kind, ReactionKindType ,"Type of reaction such as downvote", null:false
    field :user ,UserType, null: false
    field :study,StudyType, null: false
    field :reaction_name, String, null: false

    def reaction_name
      object.reaction_kind.name
    end
  end
end
