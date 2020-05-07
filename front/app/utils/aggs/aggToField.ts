import { propOr } from 'ramda';

// aggToField
export default val => {
  return propOr(val, val, {
    average_rating: 'average rating',
    tags: 'tags',
    overall_status: 'status',
    study_type: 'type',
    sponsors: 'sponsors',
    facility_names: 'facilities',
    facility_states: 'states',
    facility_cities: 'cities',
    facility_countries: 'countries',
    start_date: 'start date',
    completion_date: 'completion date',
    phase: 'phase',
    browse_condition_mesh_terms: 'mesh term',
    browse_interventions_mesh_terms: 'browse intervention mesh term',
    interventions_mesh_terms: 'interventions',
    rating_dimensions: 'rating dimensions',
    'wiki_page_edits.email': 'wiki user edits',
    'wiki_page_edits.created_at': 'wiki date range',
  });
};
