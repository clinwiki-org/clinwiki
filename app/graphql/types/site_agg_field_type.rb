module Types
  class SiteAggFieldType < Types::BaseObject
    field :name, String, null: false
    field :rank, Integer, null: true
    field :auto_suggest, Boolean, null: false
    field :display, FieldDisplayType, null: false
    field :display_name, String,null: false
    field :preselected, SiteSelectType, null: false
    field :visible_options, SiteSelectType, null: false
    field :order, SiteOrderType, null:true
    field :range_start_label, String, null: true
    field :range_end_label, String, null: true

    def display
      object[:display]
    end
    def display_name
      object[:displayName]
    end

    def auto_suggest
      object[:autoSuggest]
    end

    def visible_options
      object[:visibleOptions]
    end
    def range_start_label
      object[:rangeStartLabel]
    end
    def range_end_label
      object[:rangeEndLabel]
    end
  end
end
