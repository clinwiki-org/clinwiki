class AddUnicodeReactionKind < ActiveRecord::Migration[5.2]
  def up
    add_column :reaction_kinds, :unicode, :string
    ReactionKind.find_or_initialize_by(name:"like").update(unicode: "\\u1F44D")
    ReactionKind.find_or_initialize_by(name:"dislike").update(unicode:"\\u1F44E")
    ReactionKind.find_or_initialize_by(name:"heart").update(unicode:"\\u2764")
    ReactionKind.find_or_initialize_by(name:"skull_and_cross_bones").update(unicode:"\\u2620")
  end

  def down
    remove_column :reaction_kinds, :unicode
  end
end
