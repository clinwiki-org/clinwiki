class CreateStudyViews < ActiveRecord::Migration[5.2]
  def change
    create_table :study_views do |t|
      t.references :site, foreign_key: true
      t.string :title
      t.text :template
      t.jsonb :updates, default: [], null: false
      t.timestamps
    end
  end
end
