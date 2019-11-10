class AddSkipLandingToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :skip_landing, :boolean
  end
end
