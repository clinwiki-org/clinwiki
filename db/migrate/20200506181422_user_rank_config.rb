class UserRankConfig < ActiveRecord::Migration[5.2]
    def change
      add_column :sites, :user_rank, :text, default: "#{[
      {rank:"default", gte:0},
      {rank:"bronze",gte:26},
      {rank:"silver",gte:51},
      {rank:"gold",gte:75},
      {rank:"platinum",gte:101}
    ].to_json} "
    end
  end