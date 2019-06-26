LLONG_MIN = -9223372036854775808 # rubocop:disable Style/NumericLiterals
LLONG_MAX = 9223372036854775807 # rubocop:disable Style/NumericLiterals

class StudyEdgeService
  # @param params - hash representing SearchInputType with symbols as keys.
  def initialize(params)
    @params = normalize_params(params)
    @search_service = SearchService.new(@params)
  end

  def study_edge(id = nil)
    study = Study.find_by(nct_id: (id || first_study_id))
    return nil if study.blank?

    is_workflow = (@params[:crowd_agg_filters] || []).any? { |x| x[:field]&.downcase&.starts_with("wf_") }
    recordstotal = records_total
    OpenStruct.new(
      next_id: next_study_id(study: study),
      prev_id: next_study_id(study: study, reverse: true),
      is_workflow: is_workflow,
      study: study,
      records_total: recordstotal,
      counter_index: counter_index(study: study),
      first_id: first_study_id,
      last_id: last_study_id,
      hash_first: hash_page(new_page: 0, recordstotal: recordstotal),
      hash_last: hash_page(new_page: (recordstotal / @params[:page_size]).ceil - 1,
                           recordstotal: recordstotal),
      hash_next: hash_page(new_page: @params[:page] + 1, recordstotal: recordstotal),
      hash_prev: hash_page(new_page: @params[:page] - 1, recordstotal: recordstotal),
      page_size: @params[:page_size] || DEFAULT_PAGE_SIZE,
    )
  end


  private

  def normalize_params(params)
    result = params.deep_symbolize_keys.deep_dup
    result
  end

  def first_study_id
    temp = @search_service.params[:page]
    @search_service.params[:page] = 0
    id = @search_service.search&.dig(:studies)&.first&.id
    @search_service.params[:page] = temp
    id
  end

  def last_study_id
    temp = @search_service.params[:page]
    @search_service.params[:page] = 0
    id = @search_service.search(reverse: true)&.dig(:studies)&.first&.id
    @search_service.params[:page] = temp
    id
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

  def records_total
    total = @search_service.search&.dig(:recordsTotal)
    return total unless total.nil?
    1
  end

  def counter_index(study)
    # Finds the index of the item in the search results.
    # This code could do with some cleanup; it's pretty messy and I had to do some cheesy modifications
    # to search_service.rb to make this work.
    return 1 if study.blank?
    search_results = @search_service.search
    index = search_results&.dig(:studies)&.index{ |x| x.id == study[:study]["nct_id"] }
    return (index + 1) + (@params[:page] * @params[:page_size]) unless index.nil?
    1
  end

  # Simply rehashes the params with a new specified page number increase (or decrease if neg)
  #
  # Weird bug where it seems to be misordering the :sorts part of the params when it rehashes it.
  # e.g. it may originally be `{:agg_filters=>[], :crowd_agg_filters=>[], :page=>2, :page_size=>10, :q=>{:chi
  # ldren=>[], :key=>"AND"}, :sorts=>[{:id=>"nct_id", :desc=>false}]}`
  # but then when it hashes it, it becomes `{:agg_filters=>[], :crowd_agg_filters=>[], :page=>2, :page_size=>10,
  # :q=>{:children=>[], :key=>"AND"}, :sorts=>[{:desc=>false, :id=>"nct_id"}]}`
  # This causes the search hash to be completely different than what you might have gotten from the initial search
  # (in the above two examples, the two hash out to be `4_HTmIXh` and `7NCvcFT2` respectively)
  # May also occur to other parts of the params (e.g. :q or :agg_filters), but I have not tested.
  # This doesn't seem to cause any effect on the search results, however. They both produce the same results.
  def search_hash(params:)
    params_hash = params.to_h.deep_symbolize_keys
    ShortLink.from_long(params_hash).short
  end

  # recordstotal is passed in so as to save on computation; don't want to call another search just for this
  # could also possibly only call this function based off the counter_index rather than calling it on all
  # queries regardless of the index to save on computation, but it seems fast enough anyway
  def hash_page(new_page:, recordstotal:)
    # make sure the new page is within the confines
    if new_page >= 0 and new_page < ((recordstotal / @params[:page_size]).ceil)
      temp = @params.deep_dup
      temp[:page] = new_page
      return search_hash(params: temp)
    end
    nil
  end
end
