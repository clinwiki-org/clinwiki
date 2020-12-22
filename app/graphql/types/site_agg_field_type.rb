module Types
  class SiteAggFieldType < Types::BaseObject
    field :name, String, null: false
    field :rank, Integer, null: true
    field :auto_suggest, Boolean, null: false
    field :display, FieldDisplayType, null: false
    field :display_name, String,null: false
    field :agg_sublabel, String, null: true
    field :preselected, SiteSelectType, null: false
    field :visible_options, SiteSelectType, null: false
    field :order, SiteOrderType, null:true
    field :range_start_label, String, null: true
    field :range_end_label, String, null: true
    field :bucket_key_value_pairs, [BucketKeyValuePairsType], null: true
    field :show_allow_missing,  Boolean, null: true
    field :show_filter_toolbar,  Boolean, null: true
    field :default_to_open, Boolean, null: true
    field :dropdown_open, Boolean, null: true
    field :layout, String, null: true



    def display
      object[:display]
    end
    def display_name
      object[:displayName]
    end

    def agg_sublabel
      object[:aggSublabel]
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

    def bucket_key_value_pairs
      object[:bucketKeyValuePairs]
    end
    
    def show_allow_missing
      object[:showAllowMissing]
    end
    def show_filter_toolbar
      object[:showFilterToolbar]
    end

    def default_to_open
      object[:defaultToOpen]
    end 
    
    def dropdown_open
      object[:dropdownOpen]
    end

    def layout
      object[:layout]
    end

  end
end
