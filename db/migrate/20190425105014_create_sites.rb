class CreateSites < ActiveRecord::Migration[5.2]
  def change
    create_table :sites do |t|
      t.string :name
      t.string :subdomain

      t.timestamps
    end
    add_index :sites, :subdomain, unique: true
  end
end
