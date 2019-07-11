module Mutations
  class UpdateWikiSections < BaseMutation
    field :wiki_page, Types::WikiPageType, null: true
    field :errors, [String], null: true

    argument :nctId, String, required: true
    argument :sections, [Types::WikiSectionInputType], required: true

    def resolve(nct_id:, sections:)
      wiki_page = WikiPage.find_or_initialize_by(nct_id: nct_id)
      sections.each do |section|
        wiki_page.update_section(section.name, section.content)
      end
      wiki_page.updater = current_user
      if wiki_page.save
        { wiki_page: wiki_page, errors: nil }
      else
        { wiki_page: nil, errors: wiki_page.errors.full_messages }
      end
    end
  end
end
