class WorkflowsView < ApplicationRecord
  class << self
    def instance
      WorkflowsView.find_or_create_by({})
    end
  end

  def view
    @view ||= begin
      updater = SiteViewUpdaterService.new(default_view)
      updater.apply!(mutations)
      updater.view.merge(id: id || 0)
    end
  end

  def mutations
    updates.map do |update|
      mutation = update.clone.deep_symbolize_keys
      begin
        mutation[:payload] = JSON.parse(mutation[:payload])
      rescue StandardError # rubocop:disable Lint/HandleExceptions
        # use payload as string if it's not a json
      end
      mutation
    end
  end

  private

  def default_view
    {
      id: id,
      workflows: crowd_agg_names
        .select { |name| name.downcase.starts_with?("wf_") }
        .map { |name| default_workflow_params(name) },
    }
  end

  def crowd_agg_names
    @crowd_agg_names ||=
      Study.search("*", aggs: [:front_matter_keys], load: false, limit: 0).aggs.to_h
        .dig("front_matter_keys", "buckets")
        .map { |x| x["key"] }
  end

  def default_workflow_params(name)
    {
      name: name,
      hideReviews: false,
      disableAddRating: false,
      allWikiSections: [
        "Lay Summary",
        "Pros",
        "Cons",
        "Ideal Patient",
        "Contraindicated Patient",
        "References",
        "Requests",
      ],
      allSuggestedLabels: crowd_agg_names,
      allSummaryFields: %w[nct_id type status completion_date enrollment source],
      wikiSectionsFilter: {
        kind: "BLACKLIST",
        values: [],
      },
      suggestedLabelsFilter: {
        kind: "BLACKLIST",
        values: [],
      },
      summaryFieldsFilter: {
        kind: "BLACKLIST",
        values: [],
      },
    }
  end

  def default_workflow_wiki_section(name)
    {
      name: name,
      hide: false,
    }
  end
end
