module Types
  class AutoSuggestType < Types::BaseObject
    description "A list of suggested words"
    field :id, Integer, "Id", null: false
  end
end
