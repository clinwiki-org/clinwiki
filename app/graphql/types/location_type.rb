module Types
  class LocationType < Types::BaseObject
    field :status, String, null: false
    field :latitude, Float, null: true
    field :longitude, Float, null: true
  end
end
