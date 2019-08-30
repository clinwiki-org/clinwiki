module Types
  class SiteStudyExtendedGenericSectionType < Types::BaseObject
    field :hide, Boolean, null: false
    field :kind, String, null: false
    field :title, String, null: false
    field :order, Int, null: true
    field :fields, [String], null: false
    field :selected, SiteSelectType, null: false
    field :name, String, null: false

    def hide
      return object[:hide] == "true" if object[:hide].is_a?(String)

      object[:hide]
    end

    def fields
      object[:fields] || SiteView.new.all_fields
    end
  end
end
