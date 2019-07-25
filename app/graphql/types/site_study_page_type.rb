module Types
  class SiteStudyPageType < Types::BaseObject
    field :wiki, SiteStudyBasicGenericSectionType, null: false
    field :crowd, SiteStudyBasicGenericSectionType, null: false
    field :reviews, SiteStudyBasicGenericSectionType, null: false
    field :tags, SiteStudyBasicGenericSectionType, null: false
    field :facilities, SiteStudyBasicGenericSectionType, null: false

    field :descriptive, SiteStudyExtendedGenericSectionType, null: false
    field :administrative, SiteStudyExtendedGenericSectionType, null: false
    field :recruitment, SiteStudyExtendedGenericSectionType, null: false
    field :interventions, SiteStudyExtendedGenericSectionType, null: false
    field :tracking, SiteStudyExtendedGenericSectionType, null: false

    def search
      object.view[:search]
    end

    def workflow
      object.view[:workflow]
    end

  end
end
