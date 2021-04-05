class DropFacetConfigs < ActiveRecord::Migration[5.2]
  def change
    drop_table :facet_configs
  end
end
