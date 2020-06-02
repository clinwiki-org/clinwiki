module Types
  class ExpressionCountType < BaseObject
    field :name, String, null: false
    field :count, Int, null: false
    def name
      object.first
    end
    def count
      object.second
    end
  end
end
