module Types
  class SiteStudyBasicGenericSectionType < Types::BaseObject
    field :hide, Boolean, null: false
    field :kind, String, null: false
    field :title, String, null: false
    field :name, String, null: false

    def hide
      return object[:hide] == "true" if object[:hide].is_a?(String)

      object[:hide]
    end
  end
end
