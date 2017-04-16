class CreateReviewsTable < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.string   :nct_id
      t.integer  :rating
      t.text     :comment
      t.timestamps null: false
    end

    add_column :reviews, :user_id, :integer, references: :users
    add_index "reviews", ["nct_id"], name: "reviews_nct_id", using: :btree
    add_index "reviews", ["user_id"], name: "reviews_user_id", using: :btree
  end
end
