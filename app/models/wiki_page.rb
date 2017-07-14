class WikiPage < ReindexesStudy

  attr :front_matter, :parsed

  has_many :wiki_page_edits

  def default_content
    <<-END
## Lay Summary
#{study.brief_summary.description}

## Pros
* Add a pro here

## Cons
* Add a con here
END
  end

  def parsed
    return nil unless text
    @parsed ||= FrontMatterParser::Parser.new(FrontMatterParser::SyntaxParser::Md.new).call(text)
  end

  def from_markdown
    Kramdown::Document.new(content)
  end

  def text_html
    from_markdown.to_html
  end

  def front_matter
    @front_matter = parsed && parsed.front_matter || {}
  end

  def content
    @content = parsed && parsed.content || default_content
  end

  def method_missing(field)
    front_matter[field.to_s]
  end

  def respond_to?(field)
    super(field) || front_matter.has_key?(field.to_s)
  end

  def meta
    return {} if parsed.nil?
    front_matter.select{|key, val| !(val.is_a?(Array) || val.is_a?(Hash))}
  end

  def to_json
    {
      meta: meta,
      text: content,
      text_html: text_html,
      created_at: created_at,
      updated_at: updated_at,
      history: wiki_page_edits.order(created_at: :desc).map(&:to_json)
    }
  end
end
