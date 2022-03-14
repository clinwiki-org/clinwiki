class SiteViewUpdaterService
  attr_reader :view
  def initialize(view)
    @view = view
  end

  def apply!(mutations)
    muts = mutations.is_a?(Array) ? mutations : [mutation]
    muts.each do |mutation|
      apply_one_mutation(mutation.deep_symbolize_keys)
    end
  end

  class << self
    def compact(mutations)
      mutations = mutations.clone
      mutations.each_with_index { |mut, i| mut[:id] = i }
      muts = mutations
        .group_by { |mut| mut[:path] }
        .values
        .flat_map { |g| g.first[:operation] == "push" ? g : [g.max_by { |x| x[:id] }] }
        .sort_by { |x| x[:id] }
      muts.each { |mut| mut.delete(:id) }
      muts
    end
  end

  private

  def apply_one_mutation(mutation)
    key, mutation_view = get_last_hash_by_path(mutation[:path])
    return false if mutation_view.nil?
    return false if mutation_view.empty?

    case mutation[:operation]
    when "set"
      mutation_view[key] = mutation[:payload]
      return true
    when "push"
      return false unless mutation_view[key].nil? || mutation_view[key].is_a?(Array)

      mutation_view[key] = (mutation_view[key] || []) + [mutation[:payload]]

      return true
    when "delete"
      if mutation_view.is_a?(Hash)
        mutation_view[key].delete!(mutation[:payload].to_sym)
        return true
      elsif mutation_view.is_a?(Array)
        mutation_view[key].reject! { |elem| elem == value || elem[:name] == value || elem["name"] == value }
        return true
      end
    end
  end

  def get_last_hash_by_path(components)
    key, *current_components = components
    current_view = view

    while current_components.present? && current_view.present?
      current_view =
        if current_view.is_a?(Hash)
          current_view[key.to_sym] || current_view[key.to_s]
        elsif current_view.is_a?(Array)
          current_view.find { |value| (value[:name].to_s == key.to_s) || value["name"].to_s == key.to_s }
        else # rubocop:disable Style/EmptyElse
          nil
        end
      key, *current_components = current_components
    end

    [key.to_sym, current_view]
  end
end
