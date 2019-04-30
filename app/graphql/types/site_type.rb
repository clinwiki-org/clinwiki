module Types
  class SiteType < Types::BaseObject
    field :id, Int, null: false
    field :name, String, null: false
    field :subdomain, String, null: false

    field :owners, [UserType], null: false
    field :editors, [UserType], null: false

    def owners
      User.with_role(:site_owner, object)
    end

    def editors
      User.with_role(:site_editor, object)
    end
  end
end
