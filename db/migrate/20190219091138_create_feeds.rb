class CreateFeeds < ActiveRecord::Migration[5.2]
  def change
    create_table :feeds do |t|
      t.string :name, null: false
      t.string :kind, null: false
      t.string :user_id, null: false
      t.jsonb :params, null: false, default: "{}"

      t.timestamps
    end
  end
end
