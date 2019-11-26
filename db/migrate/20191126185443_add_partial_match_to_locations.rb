class AddPartialMatchToLocations < ActiveRecord::Migration[5.2]
  def change
    unless column_exists? :locations, :location_type
      add_column :locations, :location_type, :string
    end
    unless column_exists? :locations, :partial_match
      add_column :locations, :partial_match, :string
    end
  end
end
