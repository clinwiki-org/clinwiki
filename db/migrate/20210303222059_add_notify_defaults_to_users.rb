class AddNotifyDefaultsToUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_default :users, :search_last_notification, DateTime.now
  end
end
