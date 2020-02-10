module Types
  class SiteConfigSectionType < Types::BaseObject
    field :fields, [SiteConfigFieldType], null: false
  end
end
