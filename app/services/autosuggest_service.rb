require 'autosuggest'

class AutosuggestService
  def initialize
    # we might have to limit this to prefix matched words because right now we're just sending all the data to
    # the front end
    top_queries = Hash[WordFrequency.pluck(:name, :frequency)]
    @autosuggest = Autosuggest.new(top_queries)
  end

  def suggestions
    @autosuggest.suggestions
    OpenStruct.new(`something here somehow returning [SuggestionType]?`)
  end
end
