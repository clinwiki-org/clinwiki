module Types
  class DescriptiveInfoType < Types::BaseObject
    field :brief_title, String, null: false
    field :study_type, String, null: false
    field :official_title, String, null: true
    field :phase, String, null: true

    field :brief_summary, String, null: true
    field :detailed_description, String, null: true
    field :conditions, String, null: true

    field :design, String, null: false
    field :study_arms, String, null: false
    field :publications, String, null: false

    def design
      "tbd"
    end

    def study_arms
      "tbd"
    end

    def publications
      "tbd"
    end

    def brief_summary
      Loaders::Association.for(Study, :brief_summary).load(object).then { |bs| bs&.description }
    end

    def detailed_description
      Loaders::Association.for(Study, :detailed_description).load(object).then { |dd| dd&.description }
    end

    def conditions
      Loaders::Association.for(Study, :all_condition).load(object).then { |dd| dd&.names }
    end
  end
end
