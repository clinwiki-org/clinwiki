class AddTags < ActiveRecord::Migration[5.2]
  def change
    create_table :tags do |t|
      t.string   :nct_id
      t.string   :value
      t.timestamps null: false
    end
    add_column :tags, :user_id, :integer, references: :users
  end
end
