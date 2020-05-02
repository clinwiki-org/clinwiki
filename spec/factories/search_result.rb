# frozen_string_literal: true

class SearchResult < Hashie::Mash
end

FactoryBot.define do
  factory :search_result do
    acronym { Faker::Alphanumeric.alpha(number: 5) }
    ages { Faker::Number.number(digits: 2) }
    average_rating { Faker::Number.decimal }
    baseline_population { Faker::Number.number(digits: 2) }
    biospec_description { Faker::Lorem.sentence }
    biospec_retention { Faker::Lorem.sentence }
    brief_summary { Faker::Lorem.sentence }
    brief_title { Faker::Lorem.sentence }
    collaborators { Faker::Lorem.sentence }
    completion_date { Faker::Date.backward(days: 999) }
    completion_date_type { Faker::Lorem.word }
    completion_month_year { Faker::Number.number(digits: 4) }
    conditions { Faker::Lorem.sentence }
    contacts { Faker::Lorem.sentence }
    createdAt { Faker::Date.backward(days: 999) }
    design { Faker::Lorem.sentence }
    detailed_description { Faker::Lorem.sentence }
    disposition_first_posted_date { Faker::Date.backward(days: 999) }
    disposition_first_posted_date_type { Faker::Lorem.sentence }
    disposition_first_submitted_date { Faker::Date.backward(days: 999) }
    disposition_first_submitted_qc_date { Faker::Date.backward(days: 999) }
    eligibility_criteria { Faker::Lorem.sentence }
    eligibility_gender { Faker::Lorem.word }
    eligibility_healthy_volunteers { Faker::Lorem.sentence }
    enrollment { Faker::Lorem.sentence }
    enrollment_type { Faker::Lorem.sentence }
    expanded_access_type_individual { Faker::Lorem.sentence }
    expanded_access_type_intermediate { Faker::Lorem.sentence }
    expanded_access_type_Treatment { Faker::Lorem.sentence }
    first_received_date { Faker::Date.backward(days: 999) }
    has_data_monitoring_mommittee { Faker::Boolean.boolean }
    has_dmc { Faker::Boolean.boolean }
    has_expanded_access { Faker::Boolean.boolean }
    investigators { 3.times.map { Faker::Name.name }.join(", ") }
    ipd_access_criteria { Faker::Lorem.sentence }
    ipd_time_frame { Faker::Lorem.sentence }
    ipd_url { Faker::Internet.url }
    is_fda_regulated { Faker::Boolean.boolean }
    is_fda_regulated_device { Faker::Boolean.boolean }
    is_fda_regulated_drug { Faker::Boolean.boolean }
    is_ppsd { Faker::Boolean.boolean }
    is_unapproved_device { Faker::Boolean.boolean }
    is_us_export { Faker::Boolean.boolean }
    last_changed_date { Faker::Date.backward(days: 999) }
    last_known_status { Faker::Lorem.word }
    last_update_posted_date { Faker::Date.backward(days: 999) }
    last_update_posted_date_type { Faker::Lorem.word }
    last_update_submittedDate { Faker::Date.backward(days: 999) }
    last_update_submittedQcDate { Faker::Date.backward(days: 999) }
    limitations_and_caveats { Faker::Lorem.sentence }
    listed_location_countries { Faker::Lorem.sentence }
    nct_id { Study.order(Arel.sql("RANDOM()")).first.nct_id }
    nlm_download_date_description { Faker::Lorem.sentence }
    number_of_arms { Faker::Number.number(digits: 2) }
    number_of_groups { Faker::Number.number(digits: 2) }
    official_title { Faker::Lorem.sentence }
    other_study_ids { Faker::Lorem.sentence }
    overall_status { Faker::Lorem.word }
    phase { Faker::Lorem.word }
    plan_to_share_ipd { Faker::Lorem.sentence }
    plan_to_share_ipd_description { Faker::Lorem.sentence }
    primary_completion_date { Faker::Date.backward(days: 999) }
    primary_completion_date_type { Faker::Lorem.word }
    primary_completion_month_year { Faker::Number.number(digits: 4) }
    primary_measures { Faker::Lorem.sentence }
    publications { Faker::Lorem.sentence }
    removed_location_countries { 4.times.map { Faker::Address.country }.join(",") }
    responsibleParty { Faker::Lorem.word }
    results_first_posted_date { Faker::Date.backward(days: 999) }
    results_first_posted_date_type { Faker::Lorem.word }
    results_first_submitted_date { Faker::Date.backward(days: 999) }
    results_first_submitted_qc_date { Faker::Date.backward(days: 999) }
    reviews_count { Faker::Number.number(digits: 2) }
    secondary_measures { Faker::Lorem.sentence }
    source { Faker::Lorem.word }
    sponsor { Faker::Lorem.word }
    start_date { Faker::Date.backward(days: 999) }
    start_date_type { Faker::Lorem.word }
    start_month_year { Faker::Number.number(digits: 4) }
    study_arms { Faker::Lorem.word }
    study_first_posted_date { Faker::Date.backward(days: 999) }
    study_first_posted_date_type { Faker::Lorem.word }
    study_first_submitted_date { Faker::Date.backward(days: 999) }
    study_first_submitted_qc_date { Faker::Date.backward(days: 999) }
    study_type { Faker::Lorem.word }
    target_duration { Faker::Lorem.word }
    type { Faker::Lorem.word }
    updated_at { Faker::Date.backward(days: 999) }
    verification_date { Faker::Date.backward(days: 999) }
    verification_month_year { Faker::Number.number(digits: 4) }
    why_stopped { Faker::Lorem.sentence }
  end
end
