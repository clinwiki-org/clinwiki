class CreateWordFrequencies < ActiveRecord::Migration[5.2]
  def change
    create_table :word_frequencies do |t|
      t.string :name
      t.integer :rank
      t.integer :frequency

      t.timestamps
    end
  end
end
