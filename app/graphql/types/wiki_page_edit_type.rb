# frozen_string_literal: true

module Types
  class WikiPageEditType < Types::BaseObject
    implements TimestampsType

    field :id, Integer, null: false
    field :wiki_page, WikiPageType, null: false
    field :user, UserType, null: true
    field :diff, String, null: true
    field :diff_html, String, null: true
    field :change_set, WikiPageEditsType, null: false
    field :comment, String, null: true

    def user
      Loaders::Association.for(WikiPageEdit, :user).load(object)
    end

    def change_set
      parsed = Nokogiri::HTML.parse(object.diff_html)
      body_changed = false
      fm_changed = false
      in_front_matter = false
      tags = parsed.xpath("//li").map do |tag|
        front_matter = false
        body = false

        in_front_matter = !in_front_matter if tag.text == "---"
        status = tag["class"].upcase

        if status != "UNCHANGED"
          fm_changed ||= in_front_matter
          body_changed ||= !in_front_matter
        end
        {
          status: status.gsub(/-/, ""),
          content: tag.text,
          front_matter: in_front_matter,
          body: !in_front_matter,
        }
      end
      {
        edit_lines: tags,
        body_changed: body_changed,
        front_matter_changed: fm_changed,
      }
    end
  end
end
