class RenameTypeToIslandType < ActiveRecord::Migration[5.2]
  def change
    rename_column :island_configs, :type, :island_type
  end
end
