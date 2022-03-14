# frozen_string_literal: true

module Mutations
  class ExportToCsv < BaseMutation
    field :search_export, Types::SearchExportType, null: true

    argument :search_hash, String, required: true
    argument :site_view_id, Integer, required: true

    def resolve(site_view_id:, search_hash:)
      return nil if current_user.nil?

      site_view = SiteView.find(site_view_id)
      return nil if site_view.nil?

      short_link = ShortLink.from_short(search_hash)
      return nil if short_link.nil?

      {
        search_export: SearchExport.create_and_process!(
          user: current_user,
          site_view: site_view,
          short_link: short_link,
        ),
      }
    end
  end
end
