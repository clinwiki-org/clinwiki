module Types
  class SiteStudyPageType < Types::BaseObject
    field :all_fields, [String], null: false
    field :basic_sections, [SiteStudyBasicGenericSectionType], null: false
    field :extended_sections, [SiteStudyExtendedGenericSectionType], null: false

    def basic_sections
      object[:basicSections]
    end

    def extended_sections
      object[:extendedSections]
    end

    def all_fields
      SiteView.new.all_fields
    end
  end
end
