class WikiPage < ReindexesStudy

  has_many :wiki_page_edits

  def from_markdown
    Kramdown::Document.new(text)
  end

  def text_html
    from_markdown.to_html
  end

  def to_json
    {
      text: text,
      text_html: text_html,
      created_at: created_at,
      updated_at: updated_at,
      history: wiki_page_edits.order(created_at: :desc).map(&:to_json)
    }
  end
end
