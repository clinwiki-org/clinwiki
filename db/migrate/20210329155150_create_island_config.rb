class CreateIslandConfig < ActiveRecord::Migration[5.2]
  def change
    create_table :island_configs do |t|
      t.string :config
      t.string :type
    end
  end
end
