class WikiPage < ReindexesStudy
  include WikiModelHelper

  has_many :wiki_page_edits

  def default_content
    <<-END
## Lay Summary
#{study.brief_summary.description.gsub(/^\s+/, '')}

## Pros
* Add a pro here

## Cons
* Add a con here
END
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
