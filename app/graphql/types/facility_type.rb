module Types
  class FacilityType < Types::BaseObject
    field :id, Int, null: false
    field :nct_id, String, null: false
    field :status, String, null: false
    field :name, String, null: true
    field :city, String, null: false
    field :state, String, null: false
    field :zip, String, null: false
    field :country, String, null: false

    field :location, LocationType, null: true
    field :contacts, [FacilityContactType], null: false

    def contacts
      Loaders::Association.for(Facility, :facility_contacts).load(object)
    end

    def location
      object.facility_location
    end
  end
end
