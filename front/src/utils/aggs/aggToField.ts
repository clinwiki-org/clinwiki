import { propOr } from 'ramda';

const aggToField = (val: string, expectedVal?: string): string => {
  return propOr(val, val, {
    // average_rating: 'average rating',
    average_rating: expectedVal === val ? 'average rating' : expectedVal,
    design_outcome_measures: expectedVal === val ? 'design outcome measures' : expectedVal,
    first_received_results: expectedVal === val ? 'first received results' : expectedVal,
    last_changed_date: expectedVal === val ? 'last changed date' : expectedVal,
    number_of_arms: expectedVal === val ? 'number of arms' : expectedVal,
    number_of_groups: expectedVal === val ? 'number of groups' : expectedVal,
    plan_to_share_ipd: expectedVal === val ? 'plan to share ipd' : expectedVal,
    why_stopped: expectedVal === val ? 'why stopped' : expectedVal,
    tags: expectedVal === val ? 'tags' : expectedVal,
    overall_status: expectedVal === val ? 'status' : expectedVal,
    study_type: expectedVal === val ? 'type' : expectedVal,
    sponsors: expectedVal === val ? 'sponsors' : expectedVal,
    facility_names: expectedVal === val ? 'facilities' : expectedVal,
    facility_states: expectedVal === val ? 'states' : expectedVal,
    facility_cities: expectedVal === val ? 'cities' : expectedVal,
    facility_countries: expectedVal === val ? 'countries' : expectedVal,
    start_date: expectedVal === val ? 'start date' : expectedVal,
    indexed_at: expectedVal === val ? 'indexed at' : expectedVal,
    last_update_posted_date: expectedVal === val ? 'last update posted date' : expectedVal,
    completion_date: expectedVal === val ? 'completion date' : expectedVal,
    phase: expectedVal === val ? 'phase' : expectedVal,
    browse_condition_mesh_terms: expectedVal === val ? 'mesh term' : expectedVal,
    browse_interventions_mesh_terms:
      expectedVal === val ? 'browse intervention mesh term' : expectedVal,
    interventions_mesh_terms:
      expectedVal === val ? 'interventions' : expectedVal,
    rating_dimensions: expectedVal === val ? 'rating dimensions' : expectedVal,
    'wiki_page_edits.email':
      expectedVal === val ? 'wiki user edits' : expectedVal,
    'wiki_page_edits.created_at':
      expectedVal === val ? 'wiki date range' : expectedVal,
      'reactions.kind':
      expectedVal === val ? 'reaction kind' : expectedVal,
  });
};

export default aggToField;
