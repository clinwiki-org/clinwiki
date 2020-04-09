module Types
  class ResultsButtonType < Types::BaseObject
    field :location, String, null:false
    field :items,[ResultButtonItemsType], null: false
  end
end
