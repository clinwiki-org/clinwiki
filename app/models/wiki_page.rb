class WikiPage < ApplicationRecord
  include FrontMatterHelper
  include TriggersStudyReindex
  include HasOneStudy

  has_many :wiki_page_edits, dependent: :destroy
  attr_writer :updater

  before_save :create_edit

  def default_content
    <<~CONTENT
      ## Lay Summary
      #{study&.brief_summary&.description&.gsub(/^\s+/, '')}

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

  def should_create_edit?
    WikiPageEdit.where(wiki_page: self).count == 0 || text_was != text
  end

  def create_edit
    return unless should_create_edit?
    raise "Cannot update WikiPage with updater not specified" if @updater.blank?
    diff = Diffy::Diff.new(text_was, text)
    wiki_page_edits << WikiPageEdit.new(
      user: @updater,
      diff: diff.to_s,
      diff_html: diff.to_s(:html_simple),
    )
  end

  def update_section(name, value)
    sects = sections.map do |section|
      res = section
      res[2] = value if section[0] == name
      section
    end

    self.sections = sects
    self
  end

  private

  def sections
    regex = /^\s*##?\s*([^#\s].*)/i
    lines = content.split("\n", -1)
    section_match = ""
    section_name = ""
    section_contents = []
    result = []
    lines.each do |line|
      matches = line.match(regex)
      if matches && matches[1] && matches[1].strip.present?
        result.push([section_name, section_match, section_contents.join("\n")])
        section_name = matches[1].strip
        section_match = matches[0]
        section_contents = []
      else
        section_contents.push(line)
      end
    end
    result.push([section_name, section_match, section_contents.join("\n")])

    result
  end

  def sections=(sects)
    self.content = sects.map do |section|
      [section[1], section[2]].join("\n")
    end.join("\n")
  end
end
