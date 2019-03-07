class Feed < ApplicationRecord
  belongs_to :user
  # TODO: The set of hacks needed to work with this module. Need to refactor it.
  include SearchHelper

  # When id is nil - return first edge
  def study_edge(id)
    study = Study.find_by(nct_id: (id || first_study_id))
    return nil if study.blank?

    is_workflow = (params["crowd_agg_filters"] || []).any? { |x| x["field"]&.downcase&.starts_with("wf_") }

    OpenStruct.new(
      next_id: next_study_id(study: study),
      prev_id: next_study_id(study: study, forward: false),
      is_workflow: is_workflow,
      study: study,
    )
  end

  private

  def first_study_id
    search_studies&.dig(:studies)&.first&.id
  end

  def next_study_id(study:, forward: true)
    return nil if study.blank?

    search_studies(
      search_after: sort_params_values(study),
      reverse: !forward,
    )&.dig(:studies)&.first&.id
  end

  def sort_params_values(study)
    return nil if study.blank?

    sorts = search_params.deep_symbolize_keys[:sorts] || []
    sorts.push(id: :nct_id) unless sorts.any? { |x| x[:id].to_sym == :nct_id }
    sorts.map do |hash|
      name = hash.keys.first
      study.send(name)
    end
  end

  def params
    Hashie::Mash.new(search_params)
  end

  def page_params
    { page: 1, per_page: 1 }
  end

  def current_user
    nil
  end
end
