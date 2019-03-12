class StudyEdgeService
  # @param params - hash representing SearchInputType with symbols as keys.
  def initialize(params)
    @params = params.deep_symbolize_keys.deep_dup.freeze
    @search_service = SearchService.new(@params)
  end

  def study_edge(id = nil)
    study = Study.find_by(nct_id: (id || first_study_id))
    return nil if study.blank?

    is_workflow = (@params[:crowd_agg_filters] || []).any? { |x| x[:field]&.downcase&.starts_with("wf_") }

    OpenStruct.new(
      next_id: next_study_id(study: study),
      prev_id: next_study_id(study: study, forward: false),
      is_workflow: is_workflow,
      study: study,
    )
  end

  private

  def first_study_id
    @search_service.search&.dig(:studies)&.first&.id
  end

  def next_study_id(study:, forward: true)
    return nil if study.blank?

    @search_service.search(
      search_after: sort_params_values(study),
      reverse: !forward,
    )&.dig(:studies)&.first&.id
  end

  def sort_params_values(study)
    return nil if study.blank?

    sorts = @params[:sorts] || []
    sorts.push(id: :nct_id) unless sorts.any? { |x| x[:id].to_sym == :nct_id }
    sorts.map do |hash|
      name = hash[:id]
      value = study.send(name)
      # there is a bug in Searchkick - when you pass 0.0 it converts it to "0.0"
      # and Elasticsearch fails to parse that
      value.is_a?(BigDecimal) ? value.to_i : value
    end
  end
end
