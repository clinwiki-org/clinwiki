module Types
  class ConditionType < Types::BaseObject

    field :id, Int, null: false
    field :name, String, null:false
    field :downcase_name, String, null:false
  end

end
