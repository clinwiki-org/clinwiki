class CreateFacilityLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :facility_locations do |t|
      t.string :name
      t.string :city
      t.string :state
      t.string :zip
      t.string :country
      t.float  :latitude
      t.float  :longitude
      t.string :status
    end
    add_index :facility_locations, [:name, :city, :state, :zip, :country], name: 'facility_locations_idx', unique: true, using: :btree
  end
end
