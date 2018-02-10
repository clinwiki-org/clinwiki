class AddSelectedColumns < ActiveRecord::Migration
  def change
    add_column :users, :search_result_columns, :json
  end
end
