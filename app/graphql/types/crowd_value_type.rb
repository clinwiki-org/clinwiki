module Types
  class CrowdValueType < BaseObject
    field :crowd_value, String, null: true

    def crowd_value
      object[:crowd_value]
    end
  end
end
