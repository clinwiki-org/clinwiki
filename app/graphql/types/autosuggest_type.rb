module Types
  class AutoSuggestType < Types::BaseObject
    description "A list of suggested words"
    field :words, [SuggestionType], "List of autosuggested words", null: false

  end
end
