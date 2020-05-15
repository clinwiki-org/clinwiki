module Types
  class WorkflowAggFieldType < Types::BaseObject
    field :name, String, null: false
    field :rank, Integer, null: true
    field :display, FieldDisplayType, null: false
    field :visible_options, SiteSelectType, null: false
    field :order, SiteOrderType, null:true

    def display
      object[:display]
    end

    def auto_suggest
      object[:autoSuggest]
    end

    def visible_options
      object[:visibleOptions]
    end
  end
end
