class CreateSearchLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :search_logs do |t|
      t.references :user
      t.references :shortlink
      t.timestamps
    end
  end
end
