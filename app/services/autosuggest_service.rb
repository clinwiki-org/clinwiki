require 'autosuggest'

class AutosuggestService
  def initialize(query)
    @query = query
    top_queries = WordFrequency.group("LOWER(query)").having("")
    @autosuggest = Autosuggest.new(@database)
  end

  def suggestions
    @autosuggest.suggestions
  end
end
