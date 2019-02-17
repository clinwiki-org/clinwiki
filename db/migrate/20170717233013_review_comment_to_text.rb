class ReviewCommentToText < ActiveRecord::Migration[5.2]
  def change
    rename_column :reviews, :comment, :text
    rename_column :reviews, :rating, :overall_rating
  end
end
