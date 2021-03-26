class ChangeFacetConfigToBeString < ActiveRecord::Migration[5.2]
  def change
    change_column :facet_configs, :main_config, :string
  end
end
