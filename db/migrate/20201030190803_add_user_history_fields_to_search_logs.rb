class AddUserHistoryFieldsToSearchLogs < ActiveRecord::Migration[5.2]
  def change
    add_column :search_logs, :is_saved, :boolean, default: false, null:false
    add_column :search_logs, :is_subscribed, :boolean, default: false, null:false
    add_column :search_logs, :name_default, :string
    add_column :search_logs, :name_label, :string
  end
end
