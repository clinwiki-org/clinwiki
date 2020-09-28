class AddHideDonationToSite < ActiveRecord::Migration[5.2]
  def change
    add_column :sites, :hide_donation, :boolean
  end
end
