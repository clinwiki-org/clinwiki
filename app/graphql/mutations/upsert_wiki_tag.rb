module Mutations
  class UpsertWikiTag < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :value, String, "Tag value", required: true

    def resolve(nct_id:, value:)
      serializable do
        wiki_page = WikiPage.find_or_initialize_by(nct_id: nct_id)
        front_matter = wiki_page.front_matter
        tags = front_matter["tags"]&.split("|") || []
        return { wiki_page: wiki_page, errors: nil } if tags.include?(value)

        tags.push(value)
        front_matter["tags"] = tags.join("|")
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
