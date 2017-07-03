class CreateWikiPageEdits < ActiveRecord::Migration
  def change
    create_table :wiki_page_edits do |t|
      t.references :wiki_page, index: true, foreign_key: true
      t.references :user, index: true, foreign_key: true
      t.text :diff
      t.text :diff_html
      t.text :comment

      t.timestamps null: false
    end
  end
end
