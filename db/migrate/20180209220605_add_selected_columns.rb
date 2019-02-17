class AddSelectedColumns < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :search_result_columns, :json
  end
end
