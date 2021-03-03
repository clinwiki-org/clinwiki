class AddNotifyDefaultToSavedSearches < ActiveRecord::Migration[5.2]
  def change
    change_column_default :saved_searches, :is_subscribed, true
  end
end
