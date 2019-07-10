module FrontMatterHelper
  def parsed
    return nil unless text

    @parsed ||= FrontMatterParser::Parser.new(FrontMatterParser::SyntaxParser::Md.new).call(text)
  end

  def text=(txt)
    super(txt)
    @parsed = nil
  end

  def content=(content)
    self.text = combined_markdown(content, front_matter)
  end

  def front_matter=(front_matter)
    self.text = combined_markdown(content, front_matter)
  end

  def front_matter
    @front_matter = parsed&.front_matter || {}
  end

  def content
    @content = parsed&.content || default_content
  end

  # TODO: see the usage and fix unlimited # of methods
  def method_missing(field) # rubocop:disable Style/MethodMissingSuper, Style/MissingRespondToMissing
    front_matter[field.to_s]
  end

  def respond_to?(field)
    super(field) || front_matter.key?(field.to_s)
  end

  def meta
    return {} if parsed.nil?

    front_matter
  end

  # Where wiki search data lives for future extensibility
  # @return [Hash]
  def search_data
    result = {
      wiki_text: text, # for now, just parse the markdown
      front_matter_keys: front_matter.keys,
    }
    front_matter.each do |key, val|
      result["fm_#{key}"] = val.is_a?(String) ? val.split("|") : val
    end

    result
  end

  def combined_markdown(content, front_matter = {})
    front_matter_string = front_matter.blank? ? "---\n" : front_matter.to_yaml
    "#{front_matter_string}---\n#{content}"
  end
end
