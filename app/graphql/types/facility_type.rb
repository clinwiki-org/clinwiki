module Types
  class FacilityType < Types::BaseObject
    field :id, Int, null: false
    field :nct_id, String, null: false
    field :status, String, null: false
    field :name, String, null: false
    field :city, String, null: false
    field :state, String, null: false
    field :zip, String, null: false
    field :country, String, null: false
    field :latitude, Float, null: true
    field :longitude, Float, null: true

    field :contacts, [FacilityContactType], null: false

    def contacts
      Loaders::Association.for(Facility, :facility_contacts).load(object)
    end
  end
end
