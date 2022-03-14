module Mutations
  class CreateSite < BaseMutation
    field :site, Types::SiteType, null: true
    field :errors, [String], null: true

    argument :name, String, required: true
    argument :subdomain, String, required: true
    argument :skip_landing, Boolean, required: false
    argument :hide_donation, Boolean, required: false
    argument :themes, String, required: false
    argument :reactions_config, String, required: false
    argument :user_rank, String, required: false
    argument :editor_emails, [String], required: false

    def resolve(attrs)
      site = Site.new(attrs.to_h.except(:editor_emails))

      ActiveRecord::Base.transaction do
        site.save!
        current_user.add_role :site_owner, site
        site.save_editors(attrs[:editor_emails])
        { site: site, errors: nil }
      end
    rescue ActiveRecord::ActiveRecordError
      { site: nil, errors: site.errors.full_messages }
    end

    def authorized?(_)
      current_user.present?
    end

  end
end
