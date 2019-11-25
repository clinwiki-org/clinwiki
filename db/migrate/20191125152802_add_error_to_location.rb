class AddErrorToLocation < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :last_error, :string
  end
end
