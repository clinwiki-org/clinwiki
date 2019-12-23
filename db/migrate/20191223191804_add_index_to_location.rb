class AddIndexToLocation < ActiveRecord::Migration[5.2]
  def change
    add_index :locations, :name, unique: true
  end
end
