module Types
  class MetaType < BaseObject
    field :crowd_key, String, null: false
    field :crowd_value, CrowdValueType, null: true


    def key
      object[:crowd_key]
    end
    def value
      object[:crowd_value]
    end
  end
end
