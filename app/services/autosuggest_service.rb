require_relative '../../config/initializers/function_words'

class AutosuggestService
  def initialize(params)
    @params = params.deep_dup.freeze
  end

  def autocomplete
    fields = {
        fields: ["name"],
        match: :word_start,
        limit: 10,
        load: false,
        misspellings: {below: 5}
    }
    results = WordFrequency.search(@params, fields)
    results.map(&:name)
  end
end

