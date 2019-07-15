module Types
  class AutosuggestType < BaseObject
    description "A list of suggested words"
    field :words, [SuggestionType], "List of autosuggested words", null: false

   	def words
      autosuggest = AutosuggestService.new
      autosuggest.words
    end

  end
end
