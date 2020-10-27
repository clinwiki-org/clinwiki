STAR_FIELDS = [:average_rating].freeze
RANGE_FIELDS = [:start_date,:"wiki_page_edits.created_at", :indexed_at, :last_update_posted_date, :last_changed_date,:results_first_submitted_date ].freeze
NUMBER_RANGE_FIELDS = [:study_views_count].freeze

DEFAULT_AGG_ORDER = {
  average_rating: {
    order: { sortKind: "key", desc: true },
  },
}.freeze

class SiteView < ApplicationRecord # rubocop:disable Metrics/ClassLength
  belongs_to :site
  include MutationHelpers
  before_save do
    if default_changed? && default

      old_default = site.site_views.find_by(default: true)
      old_default&.update(url: "#{old_default.id}oldDefault")

      site.site_views.where.not(id: id).update_all(default: false)

      self.url = "default"
    end
  end

  validates :url, uniqueness: { scope: :site }

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



  def all_fields # rubocop:disable Metrics/MethodLength
    %w[
      acronym
      ages
      averageRating
      baselinePopulation
      biospecDescription
      biospecRetention
      briefSummary
      briefTitle
      collaborators
      completionDate
      completionDateType
      completionMonthYear
      conditions
      contacts
      createdAt
      design
      detailedDescription
      dispositionFirstPostedDate
      dispositionFirstPostedDateType
      dispositionFirstSubmittedDate
      dispositionFirstSubmittedQcDate
      eligibilityCriteria
      eligibilityGender
      eligibilityHealthyVolunteers
      enrollment
      enrollmentType
      expandedAccessTypeIndividual
      expandedAccessTypeIntermediate
      expandedAccessTypeTreatment
      firstReceivedDate
      hasDataMonitoringCommittee
      hasDmc
      hasExpandedAccess
      investigators
      ipdAccessCriteria
      ipdTimeFrame
      ipdUrl
      isFdaRegulated
      isFdaRegulatedDevice
      isFdaRegulatedDrug
      isPpsd
      isUnapprovedDevice
      isUsExport
      lastChangedDate
      lastKnownStatus
      lastUpdatePostedDate
      lastUpdatePostedDateType
      lastUpdateSubmittedDate
      lastUpdateSubmittedQcDate
      limitationsAndCaveats
      listedLocationCountries
      nctId
      nlmDownloadDateDescription
      numberOfArms
      numberOfGroups
      officialTitle
      otherStudyIds
      overallStatus
      phase
      planToShareIpd
      planToShareIpdDescription
      primaryCompletionDate
      primaryCompletionDateType
      primaryCompletionMonthYear
      primaryMeasures
      publications
      removedLocationCountries
      responsibleParty
      resultsFirstPostedDate
      resultsFirstPostedDateType
      resultsFirstSubmittedDate
      resultsFirstSubmittedQcDate
      reviewsCount
      secondaryMeasures
      source
      sponsor
      startDate
      startDateType
      startMonthYear
      studyArms
      studyFirstPostedDate
      studyFirstPostedDateType
      studyFirstSubmittedDate
      studyFirstSubmittedQcDate
      studyType
      targetDuration
      type
      updatedAt
      verificationDate
      verificationMonthYear
      whyStopped
    ]
  end

  private

  def default_view # rubocop:disable Metrics/MethodLength
    {
      study: {
        basicSections: [
          {
            hide: false,
            kind: "basic",
            title: "Wiki",
            name: "wiki",
          },
          {
            hide: false,
            kind: "basic",
            title: "Crowd",
            name: "crowd",
          },
          {
            hide: false,
            kind: "basic",
            title: "Reviews",
            name: "reviews",
          },
          {
            hide: false,
            kind: "basic",
            title: "Tags",
            name: "tags",
          },
          {
            hide: false,
            kind: "basic",
            title: "Facilities",
            name: "facilities",
          },
        ],
        extendedSections: [
          {
            hide: false,
            kind: "extended",
            title: "Summary",
            name: "summary",
            order: nil,
            template: '
<table class="table table-striped table-bordered table-condensed">
  <tbody>
    <tr> <th>NCT ID</th> <td>{{nctId}}</td> </tr>
    <tr> <th>type</th> <td>{{type}}</td> </tr>
    <tr> <th>Overall Status</th> <td>{{overallStatus}}</td> </tr>
    <tr> <th>Completion Date</th> <td>{{completionDate}}</td> </tr>
    <tr> <th>Enrollment</th> <td>{{enrollment}}</td> </tr>
    <tr> <th>Source</th> <td>{{source}}</td> </tr>
  </tbody>
</table>',
          },
          {
            hide: false,
            kind: "extended",
            title: "General",
            name: "general",
            order: nil,
            template: '# {{briefTitle}}',
          },
        ],
      },
      search: {
        type:"search",
        config:{
          fields:{
          showPresearch:false,
          showFacetBar:true,
          showAutoSuggest:true,
          showBreadCrumbs:true,
          showResults:true,
          }
        },
        presearch: {
          aggs: {
            selected: {
              kind: "WHITELIST",
              values: [],
            },
            fields: aggs,
          },
          crowdAggs: {
            selected: {
              kind: "WHITELIST",
              values: [],
            },
            fields: crowd_aggs,
          },
          instructions: "",
          button: {
            name: "Search",
            target: "",
          },
        },
        autoSuggest: {
          aggs: {
            selected: {
              kind: "WHITELIST",
              values: [],
            },
            fields: aggs,
          },
          crowdAggs: {
            selected: {
              kind: "WHITELIST",
              values: [],
            },
            fields: crowd_aggs,
          },
        },
        results: {
          type: "table",
          buttons: {
            items: [
              {
                icon: "",
                target: "",
              },
            ],
            location: "right",
          },

        },
        crumbs: {
          search: true,
        },

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
        fields: %w[nct_id average_rating brief_title overall_status start_date completion_date],
        sortables: %w[nct_id average_rating brief_title overall_status start_date completion_date],
        template:"\# {{briefTitle}}\n**{{nctId}}**  \nStatus: {{overallStatus}}  "
      },
    }
  end


  def aggs
    SearchService::ENABLED_AGGS.sort.reject { |x| x == :front_matter_keys }.map { |agg| default_agg_params(agg) }
  end

  def crowd_agg_names
    # this really needs to be cached in redis!
    # see: https://guides.rubyonrails.org/caching_with_rails.html#activesupport-cache-rediscachestore
    @crowd_agg_names ||=
      Study.search("*", aggs: [:front_matter_keys], load: false, limit: 0).aggs.to_h
        .dig("front_matter_keys", "buckets")
        .map { |x| x["key"] }
  end

  def crowd_aggs
    crowd_agg_names.map { |agg| default_agg_params(agg) }
  end

  def default_agg_param_display(name)
    return "STAR" if STAR_FIELDS.include?(name.to_sym)
    return "DATE_RANGE" if RANGE_FIELDS.include?(name.to_sym)
    return "NUMBER_RANGE" if NUMBER_RANGE_FIELDS.include?(name.to_sym)
    return "RANGE" if RANGE_FIELDS.include?(name.to_sym)

    "STRING"
  end

  # #Define default agg_params_order
  def default_agg_params(name)
    {
      name: name,
      rank: nil,
      autoSuggest: false,
      display: default_agg_param_display(name),
      displayName: name,
      order: default_agg_param_order(name),
      range_start_label: nil,
      range_end_label:nil,
      preselected: {
        kind: "WHITELIST",
        values: [],
      },
      visibleOptions: {
        kind: "WHITELIST",
        values: [],
      },
    }
  end

  def default_agg_param_order(name)
    order = DEFAULT_AGG_ORDER[name.to_sym]
    if order
      order[:order]
    else
      { sortKind: "key", desc: true }
    end
  end
end
