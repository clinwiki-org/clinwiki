class AddUnicodeReactionKind < ActiveRecord::Migration[5.2]
  def up
    add_column :reaction_kinds, :unicode, :string
  end

  def down
    remove_column :reaction_kinds, :unicode
  end
end
