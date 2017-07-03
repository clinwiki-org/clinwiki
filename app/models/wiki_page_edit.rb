class WikiPageEdit < ActiveRecord::Base
  belongs_to :wiki_page
  belongs_to :user

  def to_json
    attributes.merge({ user: user })
  end

end
