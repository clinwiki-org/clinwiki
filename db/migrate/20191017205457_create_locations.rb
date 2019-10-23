class CreateLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :locations do |t|
      t.string "name"
      t.string :location_type
      t.boolean :partial_match
      t.float :latitude
      t.float :longitude
    end
  end
end
