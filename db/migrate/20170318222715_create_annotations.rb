class CreateAnnotations < ActiveRecord::Migration
  def change
    create_table :annotations do |t|
      t.string  :nct_id
      t.string  :label
      t.text    :description
      t.timestamps null: false
    end
    add_column :annotations, :user_id, :integer, references: :users

    create_table :annotation_labels do |t|
      t.string :label
      t.timestamps null: false
    end
  end
end
