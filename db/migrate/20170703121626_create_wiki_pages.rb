class CreateWikiPages < ActiveRecord::Migration[5.2]
  def change
    create_table :wiki_pages do |t|
      t.string :nct_id
      t.text :text

      t.timestamps null: false
    end
    add_index :wiki_pages, :nct_id, unique: true
  end
end
