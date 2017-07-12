class WikiPage < ReindexesStudy

  attr :front_matter

  has_many :wiki_page_edits

  def parsed
    @front_matter ||= FrontMatterParser::Parser.new(FrontMatterParser::SyntaxParser::Md.new).call(text)
  end

  def from_markdown
    Kramdown::Document.new(parsed.content)
  end

  def text_html
    from_markdown.to_html
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
