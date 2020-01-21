class NameDefaultSiteView < ActiveRecord::Migration[5.2]
  def change
    add_column :site_views, :name, :string
    add_column :site_views, :default, :boolean, default: false, null:false
    add_column :site_views, :description, :string, default: ""
    add_column :site_views, :url, :string, default: ""
  end
end
