module Types
  class SuggestionType < Types::BaseObject
    description "A suggestion"
    field :word, String, "Word", null: false
    field :frequency, Integer, "Word count of the word", null: false
  end
end
