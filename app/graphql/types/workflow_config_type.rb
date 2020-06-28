module Types
  class WorkflowConfigType < Types::BaseObject
    field :name, String, null: false
    field :hide_reviews, Boolean, null: false
    field :disable_add_rating, Boolean, null: false
    field :all_wiki_sections, [String], null: false
    field :all_suggested_labels, [String], null: false
    field :all_summary_fields, [String], null: false
    field :wiki_sections_filter, SiteSelectType, null: false
    field :suggested_labels_filter, SiteSelectType, null: false
    field :suggested_labels_config, [WorkflowAggFieldType], null: false
    field :summary_fields_filter, SiteSelectType, null: false
    field :summary_template, String, null: false

    def hide_reviews
      object[:hideReviews] == "true"
    end

    def disable_add_rating
      object[:disableAddRating] == "true"
    end

    def all_suggested_labels
      object[:allSuggestedLabels]
    end

    def all_wiki_sections
      object[:allWikiSections]
    end

    def all_summary_fields
      object[:allSummaryFields]
    end

    def wiki_sections_filter
      object[:wikiSectionsFilter]
    end

    def suggested_labels_filter
      object[:suggestedLabelsFilter]
    end

    def suggested_labels_config
      object[:suggestedLabelsConfig]
    end

    def summary_fields_filter
      object[:summaryFieldsFilter]
    end

    def summary_template
      object[:summaryTemplate]
    end
  end
end
