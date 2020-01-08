class CreateFacilityLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :facility_locations, id: false do |t|
      t.string :name
      t.string :city
      t.string :state
      t.string :zip
      t.string :country
      t.float  :latitude
      t.float  :longitude
      t.string :status
    end
    execute %Q{ ALTER TABLE "facility_locations" ADD PRIMARY KEY("name", "city", "state", "zip", "country")}
  end
end
