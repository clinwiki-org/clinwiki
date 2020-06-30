module Types
  class ReactionKindType < BaseObject
    field :id, Int, "Id", null: false
    field :name, String,"Name of reaction example is like or dislike", null:false
    field :unicode, String, "Unicode for emoji used in reaction", null:false
  end
end
