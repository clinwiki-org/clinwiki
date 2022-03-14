module Types
  class MetaType < BaseObject
    field :crowd_key, String, null: true
    field :crowd_value_list, [CrowdValueType], null: true


    def crowd_key
      object[:crowd_key]
    end
    def crowd_value_list
      object[:crowd_value_list]
    end
  end
end
