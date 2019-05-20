module Types
  class SiteAggFieldType < Types::BaseObject
    field :name, String, null: false
    field :rank, Integer, null: true
    field :display, FieldDisplayType, null: false
    field :preselected, SiteSelectType, null: false

    def display
      object[:display]
    end
  end
end
