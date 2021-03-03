class AddNotifyToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :search_notification_criteria, :string
    add_column :users, :search_last_notification, :datetime
    add_column :users, :search_notification_frequency, :integer
  end
end
