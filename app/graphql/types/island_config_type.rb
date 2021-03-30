module Types
  class IslandConfigType < Types::BaseObject
    field :id, Integer, null: false
    field :config, String, null: false
    field :island_type, String, null: false
  end
  
end