class CreateDisplayConfigurations < ActiveRecord::Migration
  def change
    create_table :display_configurations do |t|
      t.string  :relationship_to_study
      t.string  :render_in_section
      t.string  :render_in_subsection
      t.string  :table_name
      t.string  :column_name
      t.string  :format_type
      t.integer :sort_order
    end
  end
end
