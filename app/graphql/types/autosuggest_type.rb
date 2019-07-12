# WARNING: Don't use this. It's already inside of query_type.rb done inline. I'll keep this here if needed later,
# but I will delete this sooner or later.

module Types
  class AutoSuggestType < Types::BaseObject
    description "A list of suggested words"
    field :words, [SuggestionType], "List of autosuggested words", null: false

    def words
      autosuggest = AutosuggestService.new
      autosuggest.suggestions
    end
  end
end
