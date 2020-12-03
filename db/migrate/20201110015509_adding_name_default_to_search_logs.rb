class AddingNameDefaultToSearchLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :search_logs, :name_default, :string
  end
end
