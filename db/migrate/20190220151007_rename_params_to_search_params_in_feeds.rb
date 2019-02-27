class RenameParamsToSearchParamsInFeeds < ActiveRecord::Migration[5.2]
  def change
    rename_column :feeds, :params, :search_params
  end
end
