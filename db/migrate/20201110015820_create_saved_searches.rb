class CreateSavedSearches < ActiveRecord::Migration[5.2]
  def change
    create_table :saved_searches do |t|
      t.references :user
      t.references :short_link
      t.string :name_label
      t.boolean :is_subscribed, :default => false
      t.timestamps
    end
  end
end
