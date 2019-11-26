class AddCheckedToLocation < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :checked, :datetime
  end
end
