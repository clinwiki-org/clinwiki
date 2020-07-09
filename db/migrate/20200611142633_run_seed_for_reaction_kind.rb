class RunSeedForReactionKind < ActiveRecord::Migration[5.2]
  #Migration runs rake db:seed essentially
  def up
    # ReactionKind.find_or_initialize_by(name:"like").update(name:"like")
    # ReactionKind.find_or_initialize_by(name:"dislike").update(name:"dislike")
    # ReactionKind.find_or_initialize_by(name:"heart").update(name:"heart")
    # ReactionKind.find_or_initialize_by(name:"skull_and_cross_bones").update(name:"skull_and_cross_bones")
  end
  def down
    # ReactionKind.find_by(name:"like").destroy
    # ReactionKind.find_by(name:"dislike").destroy
    # ReactionKind.find_by(name:"heart").destroy
    # ReactionKind.find_by(name:"skull_and_cross_bones").destroy
  end
end
