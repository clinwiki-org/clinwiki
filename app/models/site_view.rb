STAR_FIELDS = [:average_rating].freeze

class SiteView < ApplicationRecord
  belongs_to :site

  class << self
    def default
      new(id: 0, updates: [])
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
      workflow: {
        addRating: true,
      },
      search: {
        aggs: {
          selected: {
            kind: "BLACKLIST",
            values: [],
          },
          fields: aggs,
        },
        crowdAggs: {
          selected: {
            kind: "BLACKLIST",
            values: [],
          },
          fields: crowd_aggs,
        },
      },
    }
  end

  def aggs
    SearchService::ENABLED_AGGS.sort.reject { |x| x == :front_matter_keys }.map { |agg| default_agg_params(agg) }
  end

  def crowd_aggs
    Study.search("*", aggs: [:front_matter_keys], load: false, limit: 0).aggs.to_h
      .dig("front_matter_keys", "buckets")
      .map { |x| x["key"] }
      .map { |agg| default_agg_params(agg) }
  end

  def default_agg_params(name)
    display = STAR_FIELDS.include?(name.to_sym) ? "STAR" : "STRING"
    {
      name: name,
      rank: nil,
      display: display,
      preselected: {
        kind: "WHITELIST",
        values: [],
      },
    }
  end

end
