class CreatePageViews < ActiveRecord::Migration[5.2]
  def change
    create_table :page_views do |t|
      t.references :site, foreign_key: true
      t.string :title
      t.text :template
      t.jsonb :updates, default: [], null: false
      t.string :page_type, default: "study"
      t.timestamps
    end
  end
end
