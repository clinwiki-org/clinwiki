class NameDefaultSiteView < ActiveRecord::Migration[5.2]
  def change
    add_column :site_views, :name, :string
    add_column :site_views, :default, :boolean, default: false, null:false
  end
end
