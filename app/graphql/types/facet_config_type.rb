module Types
  class FacetConfigType < Types::BaseObject
    field :id, Integer, null: false
    field :main_config, String, null: false
  end
end