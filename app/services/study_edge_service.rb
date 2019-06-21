LLONG_MIN = -9223372036854775808 # rubocop:disable Style/NumericLiterals
LLONG_MAX = 9223372036854775807 # rubocop:disable Style/NumericLiterals

class StudyEdgeService
  # @param params - hash representing SearchInputType with symbols as keys.
  def initialize(params)
    @params = normalize_params(params).freeze
    @search_service = SearchService.new(@params)
  end

  def study_edge(id = nil)
    study = Study.find_by(nct_id: (id || first_study_id))
    return nil if study.blank?

    is_workflow = (@params[:crowd_agg_filters] || []).any? { |x| x[:field]&.downcase&.starts_with("wf_") }

    OpenStruct.new(
      next_id: next_study_id(study: study),
      prev_id: next_study_id(study: study, reverse: true),
      is_workflow: is_workflow,
      study: study,
      records_total: records_total(study: study),
      counter_index: counter_index(study: study),
      first_id: first_study_id
    )
  end


  private

  def normalize_params(params)
    result = params.deep_symbolize_keys.deep_dup
    result[:page] = 0
    result
  end

  def first_study_id
    @search_service.search&.dig(:studies)&.first&.id
  end

  # There's a big problem with nulls. When you sort by a field
  # (in this case we considered only dates) with null values,
  # nulls will always come last, regardless of whether you do asc or desc search
  # This is achieved by elastic with assigning LLONG_MIN value to date if we're searching
  # desc and LLONG_MAX if we're searcing asc. There are 4 cases:
  # 1) asc sort + current field value is not nil - this is trivial,
  # just use the current value in the sort params
  # 2) asc sort + current field value is nil - then use LLONG_MAX as current study sort value
  # 3) desc sort + current field value is nil. In this case we would like to have a record with
  # nil value or if it doesn't exist the first non-nil record. This is basically done as setting
  # sort value to LLONG_MIN - then elastic will return all the nil values. If that result is missing
  # then by setting sort value to LLONG_MAX we get the first non-nil value.
  # When there are potentially several columns to sort by with nils we take 2 variants for each nil entry.
  # 4) desc sort + current field value is not nil. This is a TODO. Currently the result (prev study)
  # is returned even for the 1st entry. That could be fixed, but needs more conding time.
  def next_study_id(study:, reverse: false)
    return nil if study.blank?

    sort_values_variants(study, reverse).each do |sort_values|
      id = @search_service.search(
        search_after: sort_values,
        reverse: reverse,
      )&.dig(:studies)&.first&.id
      return id unless id.nil?
    end

    nil
  end

  # All variants of sort_params as specified in clause 3 above.
  def sort_values_variants(study, reverse)
    sort_params = sort_values(study, reverse)
    res = [sort_params]
    sort_params.reverse.each_with_index do |sort_value, i|
      next if sort_value != LLONG_MIN

      params = sort_params.deep_dup
      params[sort_params.size - i - 1] = LLONG_MAX
      res << params
    end
    res
  end

  def sort_values(study, reverse)
    return nil if study.blank?

    sorts = @params[:sorts] || []
    sorts.push(id: "nct_id", desc: false) unless sorts.any? { |x| x[:id].to_sym == :nct_id }
    sorts.map do |hash|
      name = hash[:id]
      value = study.send(name)
      sort_value_to_elastic(value, hash[:desc] ^ reverse)
    end
  end

  def sort_value_to_elastic(value, desc)
    case value
    # there is a bug in Searchkick - when you pass 0.0 it converts it to "0.0"
    # and Elasticsearch fails to parse that
    when BigDecimal
      value.to_i
    when Date
      value.strftime("%Q")
    when nil
      desc ? LLONG_MIN : LLONG_MAX
    else
      value
    end
  end

  def records_total(study)
    return 1 if study.blank?
    total = @search_service.search&.dig(:recordsTotal)
    return total unless total.nil?
    1
  end

  def counter_index(study, reverse = false)
    return 1 if study.blank?

    index = @search_service.search(
          reverse: reverse,
          )&.dig(:studies)&.index{ |x| x.id == study[:study]["nct_id"] }
    return index + 1 unless index.nil?

    1
  end
end
