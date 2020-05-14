class ResetTokenUrl < ActiveRecord::Migration[5.2]
  def change
      add_column :users,:reset_token_url, :string
  end
end
