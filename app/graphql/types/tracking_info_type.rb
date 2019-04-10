module Types
  class TrackingInfoType < Types::BaseObject
    field :first_received_date, DateTimeType, null: true
    field :last_changed_date, DateTimeType, null: true
    field :start_date, DateTimeType, null: true
    field :primary_completion_date, DateTimeType, null: true
    field :design_outcomes, [DesignOutcomeType], null: false

    def first_received_date
      object.try(:first_received_date, nil)
    end

    def last_changed_date
      object.try(:last_changed_date, nil)
    end

    def design_outcomes
      Loaders::Association.for(Study, :design_outcomes).load(object)
    end
  end
end
