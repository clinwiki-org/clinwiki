module Types
  class AdministrativeInfoType < Types::BaseObject
    field :nct_id, String, null: false
    field :other_study_ids, String, null: false
    field :has_data_monitoring_committee, Boolean, null: false
    field :is_fda_regulated, Boolean, null: false, method: :fda_regulated_product?
    field :plan_to_share_ipd, String, null: true
    field :plan_to_share_ipd_description, String, null: true
    field :responsible_party, String, null: false
    field :sponsor, String, null: false
    field :collaborators, String, null: false
    field :investigators, String, null: false
    field :source, String, null: false
    field :verification_date, DateTimeType, null: true

    def has_data_monitoring_committee # rubocop:disable Naming/PredicateName
      object.has_dmc || false
    end

    def other_study_ids
      "tbd"
    end

    def responsible_party
      "tbd"
    end

    def sponsor
      "tbd"
    end

    def collaborators
      "tbd"
    end

    def investigators
      "tbd"
    end
  end
end
