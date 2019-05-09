class CreateSiteViews < ActiveRecord::Migration[5.2]
  def change
    create_table :site_views do |t|
      t.jsonb :updates, null: false, default: []
      t.references :site, foreign_key: true

      t.timestamps
    end
  end
end
