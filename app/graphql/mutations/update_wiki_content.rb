module Mutations
  class UpdateWikiContent < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :content, String, "Markdown version of the text", required: true

    def resolve(nct_id:, content:)
      wiki_page = WikiPage.find_or_initialize_by(nct_id: nct_id)
      wiki_page.content = content
      wiki_page.updater = current_user
      if wiki_page.save
        { wiki_page: wiki_page, errors: nil }
      else
        { wiki_page: nil, errors: wiki_page.errors.full_messages }
      end
    end
  end
end
