module Mutations
  class UpdateSite < BaseMutation
    field :site, Types::SiteType, null: true
    field :errors, [String], null: true

    argument :id, Int, required: true
    argument :name, String, required: false
    argument :themes, String, required: false
    argument :reactions_config, String, required: false
    argument :user_rank, String, required: false
    argument :skip_landing, Boolean, required: false
    argument :subdomain, String, required: false
    argument :editor_emails, [String], required: false

    def resolve(attrs)
      site = site(attrs[:id])
      return { site: nil, errors: ["Not found"] } if site.blank?

      site.attributes = attrs.to_h.except(:id, :editor_emails).reject { |_, v| v.to_s.blank? }

      ActiveRecord::Base.transaction do
        site.save
        site.save_editors(attrs[:editor_emails])
        { site: site, errors: nil }
      end
    rescue ActiveRecord::ActiveRecordError
      { site: nil, errors: site.errors.full_messages }
    end

    def authorized?(args)
      site = site(args[:id])
      return false if site.blank?

      current_user.present? && current_user.has_role?(:admin) ||
        current_user.has_role?(:site_owner, site) ||
        current_user.has_role?(:site_editor, site)
    end

    private

    def site(id)
      @site ||= Site.find_by(id: id)
    end
  end
end
