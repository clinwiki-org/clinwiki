class ReactionIndexFix < ActiveRecord::Migration[5.2]
  def change
    remove_index :reactions, [:user_id, :nct_id]
    add_index :reactions,[ :user_id, :nct_id, :reaction_kind_id]
  end
end
