class WikiPage < ApplicationRecord
  include FrontMatterHelper
  include TriggersStudyReindex
  include HasOneStudy

  has_many :wiki_page_edits, dependent: :destroy
  attr_writer :updater

  before_save :create_edit

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

  def create_edit
    return if text_was == text
    raise "Cannot update WikiPage with updater not specified" if @updater.blank?

    diff = Diffy::Diff.new(text_was, text)
    WikiPageEdit.create(
      user: @updater,
      wiki_page_id: id,
      diff: diff.to_s,
      diff_html: diff.to_s(:html_simple),
    )
  end
end
