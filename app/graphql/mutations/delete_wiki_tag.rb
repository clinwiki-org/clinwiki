module Mutations
  class DeleteWikiTag < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :value, String, "Tag value", required: true

    def resolve(nct_id:, value:)
      wiki_page = WikiPage.find_or_initialize_by(nct_id: nct_id)
      front_matter = wiki_page.front_matter
      tags = front_matter["tags"]
      return { wiki_page: wiki_page, errors: nil } unless tags.include?(value)

      tags.reject! { |tag| tag == value }
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
