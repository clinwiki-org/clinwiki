class CreateWorkflowsViews < ActiveRecord::Migration[5.2]
  def change
    create_table :workflows_views do |t|
      t.jsonb :updates, default: [], null: false

      t.timestamps
    end
  end
end
