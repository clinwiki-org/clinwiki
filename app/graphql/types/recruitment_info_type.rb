module Types
  class RecruitmentInfoType < Types::BaseObject
    field :overall_status, String, null: false
    field :enrollment, Int, null: true
    field :completion_date, DateTimeType, null: true
    field :primary_completion_date, DateTimeType, null: true

    field :eligibility, EligibilityType, null: false
    field :ages, String, null: false
    field :contacts, String, null: false
    field :listed_location_countries, String, null: false
    field :removed_location_countries, String, null: false

    def completion_date
      object.completion_date&.to_datetime
    end

    def eligibility
      Loaders::Association.for(Study, :eligibility).load(object)
    end

    def ages
      "tbd"
    end

    def contacts
      "tbd"
    end

    def listed_location_countries
      "tbd"
    end

    def removed_location_countries
      "tbd"
    end
  end
end
