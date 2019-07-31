require 'autosuggest'
require_relative '../../config/initializers/function_words'

class AutosuggestService
  def initialize
    # we might have to limit this to prefix matched words because right now we're just sending all the data to
    # the front end
    top_queries = Hash[WordFrequency.pluck(:name, :frequency)]
    @autosuggest = Autosuggest.new(top_queries)
    @autosuggest.blacklist_words FUNCTION_WORDS
  end

  def words
    result = []
    @autosuggest.suggestions.each do |suggestion|
      puts suggestion
      unless suggestion.nil? or suggestion[:blacklisted]
        result.push Hash[suggestion[:query], suggestion[:score]]
      end
    end
    result
  end

  def autocomplete
    render json: Movie.search(params[:query], {
        fields: ["name^5"],
        match: :word_start,
        limit: 10,
        load: false,
        misspellings: {below: 5}
    }).map(&:title)
  end
end

