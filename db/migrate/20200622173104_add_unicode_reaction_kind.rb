class AddUnicodeReactionKind < ActiveRecord::Migration[5.2]
  def up
    add_column :reaction_kinds, :unicode, :string
    ReactionKind.find_or_initialize_by(name:"like").update(unicode: "1F44D".hex.chr("utf-8"))
    ReactionKind.find_or_initialize_by(name:"dislike").update(unicode:"1F44E".hex.chr("utf-8"))
    ReactionKind.find_or_initialize_by(name:"heart").update(unicode:"2764".hex.chr("utf-8"))
    ReactionKind.find_or_initialize_by(name:"skull_and_cross_bones").update(unicode:"2620".hex.chr("utf-8"))
  end

  def down
    remove_column :reaction_kinds, :unicode
  end
end
