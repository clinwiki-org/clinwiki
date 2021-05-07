class CreateFacetConfigs < ActiveRecord::Migration[5.2]
    def change
      create_table :facet_configs do |t|
        t.json :main_config
        t.timestamps
      end
    end
  end