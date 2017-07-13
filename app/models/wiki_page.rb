class WikiPage < ReindexesStudy

  attr :front_matter, :parsed

  has_many :wiki_page_edits

  def parsed
    @parsed ||= FrontMatterParser::Parser.new(FrontMatterParser::SyntaxParser::Md.new).call(text)
  end

  def from_markdown
    Kramdown::Document.new(parsed.content)
  end

  def text_html
    from_markdown.to_html
  end

  def front_matter
    @front_matter = parsed.front_matter
  end

  def method_missing(field)
    front_matter[field.to_s]
  end

  def respond_to?(field)
    super(field) || front_matter.has_key?(field.to_s)
  end

  def to_json
    {
      meta: parsed.front_matter,
      text: parsed.content,
      text_html: text_html,
      created_at: created_at,
      updated_at: updated_at,
      history: wiki_page_edits.order(created_at: :desc).map(&:to_json)
    }
  end
end
