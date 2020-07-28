class DefaultPageView < ActiveRecord::Migration[5.2]
  def change
      add_column :page_views, :default, :boolean, default: false, null:false
  end
end
