class AddUrlToSavedSearch < ActiveRecord::Migration[5.2]
  def change
    add_column :saved_searches, :url, :string 
  end
end
