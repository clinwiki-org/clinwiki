class CreateSearchExports < ActiveRecord::Migration[5.2]
  def change
    create_table :search_exports do |t|
      t.integer :short_link_id, null: false
      t.integer :user_id
      t.integer :site_view_id
      t.string :s3_url
      t.timestamps
    end
  end
end
