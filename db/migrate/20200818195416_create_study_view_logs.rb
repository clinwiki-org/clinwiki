class CreateStudyViewLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :study_view_logs do |t|
      t.references :user
      t.string :nct_id
      t.timestamps
    end
  end
end
