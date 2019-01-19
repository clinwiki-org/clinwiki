module WikiModelHelper
  attr :front_matter, :parsed

  def parsed
    return nil unless text
    @parsed ||= FrontMatterParser::Parser.new(FrontMatterParser::SyntaxParser::Md.new).call(text)
  end

  # def from_markdown
  #   Kramdown::Document.new(content)
  # end

  # def text_html
  #   from_markdown.to_html
  # end

  def front_matter
    @front_matter = parsed && parsed.front_matter || {}
  end

  def content
    @content = parsed && parsed.content || default_content
  end

  def method_missing(field, *args)
    front_matter[field.to_s]
  end

  def respond_to?(field)
    super(field) || front_matter.has_key?(field.to_s)
  end

  def meta
    return {} if parsed.nil?
    front_matter.select{|key, val| !(val.is_a?(Array) || val.is_a?(Hash))}
  end

  # Where wiki search data lives for future extensibility
  # @return [Hash]
  def search_data
    result = {
      wiki_text: text,  # for now, just parse the markdown
      front_matter_keys: front_matter.keys
    }
    front_matter.each do |key, val|
      result["fm_#{key}"] = val.is_a?(String) ? val.split('|') : val
    end
    return result
  end

end
