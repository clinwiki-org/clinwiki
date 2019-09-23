class AddIndexToWordFrequencies < ActiveRecord::Migration[5.2]
  def change
    remove_index :word_frequencies, name: "index_word_frequencies_on_name"
    add_index :word_frequencies, :name, :unique => true
  end
end
