class AddUserDefaultQueryTerm < ActiveRecord::Migration
  def change
    add_column :users, :default_query_string, :string
  end
end
