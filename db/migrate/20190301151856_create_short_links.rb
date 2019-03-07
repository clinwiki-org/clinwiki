class CreateShortLinks < ActiveRecord::Migration[5.2]
  def change
    create_table :short_links do |t|
      t.string :short, null: false
      t.string :long, null: false

      t.timestamps
    end
    add_index :short_links, :short, unique: true
    add_index :short_links, :long, unique: true
  end
end
