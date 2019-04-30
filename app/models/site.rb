class Site < ApplicationRecord
  resourcify

  validates :name, :subdomain, uniqueness: true

  def save_editors(editor_emails)
    emails = editor_emails.is_a?(Array) ? editor_emails : [editor_emails]
    existing = id.blank? ? [] : User.with_role(:site_editor, self)
    new_editors = User.where(email: emails).to_a
    (new_editors - existing).map do |user|
      user.add_role(:site_editor, self)
    end
    (existing - new_editors).map do |user|
      user.remove_role(:site_editor, self)
    end
  end
end
