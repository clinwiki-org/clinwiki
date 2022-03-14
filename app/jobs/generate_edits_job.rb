class GenerateEditsJob < ApplicationJob
  queue_as :default

  def generate_edit(wiki_page:, wiki_text:, user:)
    diff = Diffy::Diff.new(wiki_page.text, wiki_text)
    diff_s = diff.to_s
    diff_html = diff.to_s(:html_simple)
    wp = {
      user_id: user.id,
      wiki_page_id: wiki_page.id,
      diff: diff_s,
      diff_html: diff_html,
    }
    wp
  end

  def perform(edits)
    wiki_edits = []
    edits.each do |edit|
      wiki_edits << generate_edit(wiki_page: edit[:wiki_page], wiki_text: edit[:wiki_text], user: edit[:user])
    end
    WikiPageEdit.import wiki_edits
  end
end
