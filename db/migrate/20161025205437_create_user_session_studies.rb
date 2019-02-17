class CreateUserSessionStudies < ActiveRecord::Migration[5.2]
  def change
    create_table :user_session_studies do |t|
      t.string   :nct_id
      t.text     :serialized_study
      t.timestamps null: false
    end

    add_column :user_session_studies, :user_id, :integer, references: :users
    add_index "user_session_studies", ["nct_id"], name: "user_session_studies_nct_id", using: :btree
    add_index "user_session_studies", ["user_id"], name: "user_session_studies_user_id", using: :btree
  end
end
