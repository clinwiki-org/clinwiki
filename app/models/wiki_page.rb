class WikiPage < ApplicationRecord
  include WikiModelHelper
  include TriggersStudyReindex
  include HasOneStudy

  has_many :wiki_page_edits, dependent: :destroy

  def default_content
    <<-CONTENT
  ## Lay Summary
  #{study.brief_summary.description.gsub(/^\s+/, '')}

  ## Pros
  * Add a pro here

  ## Cons
  * Add a con here

  ## Ideal Patient
  * Add descriptions here

  ## Contraindicated Patient
  * Add descriptions here

  ## References
  * Add links here

  ## Requests
  * Post open questions about study here (temporary)

    CONTENT
  end

  def to_json
    {
      meta: meta,
      text: content,
      # text_html: text_html,
      created_at: created_at,
      updated_at: updated_at,
      history: wiki_page_edits.order(created_at: :desc).map(&:to_json),
    }
  end
end
