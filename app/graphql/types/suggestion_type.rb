module Types
  class SuggestionType < Types::BaseObject
    description "A suggestion"
    field :id, Integer, "Id", null: false
  end
end
