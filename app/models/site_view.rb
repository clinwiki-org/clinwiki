STAR_FIELDS = [:average_rating].freeze

class SiteView < ApplicationRecord # rubocop:disable Metrics/ClassLength
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

  def default_view # rubocop:disable Metrics/MethodLength
    {
      study: {
        wiki: {
          hide: false,
        },
        crowd: {
          hide: false,
        },
        reviews: {
          hide: false,
        },
        tags: {
          hide: false,
        },
        facilities: {
          hide: false,
        },
        descriptive: {
          hide: false,
          title: "Descriptive",
          order: nil,
          selected: {
            kind: "WHITELIST",
            values: %w[
              briefSummary briefTitle conditions design detailedDescription
              officialTitle phase publications studyArms studyType
            ],
          },
          fields: all_fields,
        },
        administrative: {
          hide: false,
          title: "Administrative",
          order: nil,
          selected: {
            kind: "WHITELIST",
            values: %w[
              collaborators hasDataMonitoringCommittee investigators isFdaRegulated
              otherStudyIds planToShareIpd planToShareIpdDescription responsibleParty
              source sponsor verificationDate
            ],
          },
          fields: all_fields,
        },
        recruitment: {
          hide: false,
          title: "Recruitment",
          order: nil,
          selected: {
            kind: "WHITELIST",
            values: %w[
              ages completionDate contacts enrollment listedLocationCountries
              overallStatus primaryCompletionDate removedLocationCountries
              eligibilityCriteria eligibilityGender eligibilityHealthyVolunteers
            ],
          },
          fields: all_fields,
        },
        interventions: {
          hide: false,
          title: "Interventions",
          order: nil,
          selected: {
            kind: "BLACKLIST",
            values: [],
          },
          fields:
            %w[description name type],
        },
        tracking: {
          hide: false,
          title: "Tracking",
          order: nil,
          selected: {
            kind: "WHITELIST",
            values: %w[
              primaryMeasures secondaryMeasures
              firstReceivedDate lastChangedDate primaryCompletionDate
              startDate
            ],
          },
          fields: all_fields,
        },
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
        fields: %w[nct_id average_rating brief_title overall_status start_date completion_date],
      },
    }
  end

  def aggs
    SearchService::ENABLED_AGGS.sort.reject { |x| x == :front_matter_keys }.map { |agg| default_agg_params(agg) }
  end

  def crowd_agg_names
    @crowd_agg_names ||=
      Study.search("*", aggs: [:front_matter_keys], load: false, limit: 0).aggs.to_h
        .dig("front_matter_keys", "buckets")
        .map { |x| x["key"] }
  end

  def crowd_aggs
    crowd_agg_names.map { |agg| default_agg_params(agg) }
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
end
