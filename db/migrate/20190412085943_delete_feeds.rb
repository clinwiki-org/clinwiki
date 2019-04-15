class DeleteFeeds < ActiveRecord::Migration[5.2]
  def up
    drop_table :feeds
  end

  def down
    create_table :feeds do |t|
      t.string :name, null: false
      t.string :kind, null: false
      t.string :user_id, null: false
      t.jsonb :params, null: false, default: "{}"

      t.timestamps
    end
  end
end
