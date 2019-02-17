class AddUserDefaultQueryTerm < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :default_query_string, :string
  end
end
