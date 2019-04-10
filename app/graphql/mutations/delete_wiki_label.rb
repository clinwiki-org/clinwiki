module Mutations
  class DeleteWikiLabel < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :key, String, "Label key", required: true

    def resolve(nct_id:, key:)
      wiki_page = WikiPage.find_by(nct_id: nct_id)
      return { wiki_page: nil, errors: ["Wikipage not found"] } if wiki_page.blank?

      front_matter = wiki_page.front_matter
      return { wiki_page: nil, errors: ["Key not found"] } unless front_matter[key]

      front_matter.delete(key)
      front_matter.delete(key.to_sym)

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
