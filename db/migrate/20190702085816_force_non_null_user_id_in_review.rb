class ForceNonNullUserIdInReview < ActiveRecord::Migration[5.2]
  def up
    execute "UPDATE reviews SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL"
    change_column :reviews, :user_id, :integer, null: false
  end

  def down
    change_column :reviews, :user_id, :integer, null: true
  end
end
