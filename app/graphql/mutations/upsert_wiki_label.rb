module Mutations
  class UpsertWikiLabel < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :key, String, "Label key", required: true
    argument :value, String, "Label value", required: true

    def resolve(nct_id:, key:, value:)
      serializable do
        wiki_page = WikiPage.find_or_initialize_by(nct_id: nct_id)
        front_matter = wiki_page.front_matter
        front_matter[key] = value
        wiki_page.front_matter = front_matter
        wiki_page.updater = current_user
        if wiki_page.save
          { wiki_page: wiki_page, errors: nil }
        else
          { wiki_page: nil, errors: wiki_page.errors.full_messages }
        end
      end
    end
  end
end
