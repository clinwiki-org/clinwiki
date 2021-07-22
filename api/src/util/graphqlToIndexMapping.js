export const graphqlToIndexMapping =  {
    "nct_id": {
        "fieldNameIndex": "nct_id",
        "dataTypeToIndex": "PrimaryKey"
    },
    "brief_title": {
        "fieldNameIndex": "brief_title",
        "dataTypeToIndex": "keyword"
    },
    "overall_status": {
        "fieldNameIndex": "overall_status",
        "dataTypeToIndex": "keyword"
    },
    "phase": {
        "fieldNameIndex": "phase",
        "dataTypeToIndex": "keyword"
    },
    "study_type": {
        "fieldNameIndex": "study_type",
        "dataTypeToIndex": "keyword"
    },
    "start_date": {
        "fieldNameIndex": "start_date",
        "dataTypeToIndex": "date"
    },
    "last_update_posted_date": {
        "fieldNameIndex": "last_update_posted_date",
        "dataTypeToIndex": "date"
    },
    "completion_date": {
        "fieldNameIndex": "completion_date",
        "dataTypeToIndex": "date"
    },
    "completion_date_type": {
        "fieldNameIndex": "completion_date_type",
        "dataTypeToIndex": "keyword"
    },
    "enrollment": {
        "fieldNameIndex": "enrollment",
        "dataTypeToIndex": "long"
    },
    "has_expanded_access": {
        "fieldNameIndex": "has_expanded_access",
        "dataTypeToIndex": "boolean"
    },
    "conditions": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "sub_query"
    },
    "conditions.downcase_name": {
        "fieldNameIndex": "conditions",
        "dataTypeToIndex": "keyword"
    },
    "ctgov_prod_studies_facilities": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "sub_query"
    },
    "ctgov_prod_studies_facilities.name": {
        "fieldNameIndex": "facility_names",
        "dataTypeToIndex": "keyword"
    },
    "ctgov_prod_studies_facilities.city": {
        "fieldNameIndex": "facility_cities",
        "dataTypeToIndex": "keyword"
    },
    "ctgov_prod_studies_facilities.state": {
        "fieldNameIndex": "facility_states",
        "dataTypeToIndex": "keyword"
    },
    "ctgov_prod_studies_facilities.zip": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "SKIP"
    },
    "ctgov_prod_studies_facilities.country": {
        "fieldNameIndex": "facility_countries",
        "dataTypeToIndex": "keyword"
    },
    "ctgov_prod_studies_facilities.ctgov_prod_facilities_clinwiki_facility_locations": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "sub_query"
    },
    "ctgov_prod_studies_facilities.ctgov_prod_facilities_clinwiki_facility_locations.latitude": {
        "fieldNameIndex": "location.lat",
        "dataTypeToIndex": "geo_point"
    },
    "ctgov_prod_studies_facilities.ctgov_prod_facilities_clinwiki_facility_locations.longitude": {
        "fieldNameIndex": "location.lon",
        "dataTypeToIndex": "geo_point"
    },
    "ctgov_prod_studies_facilities.contacts": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "sub_query"
    },
    "ctgov_prod_studies_facilities.contacts.name": {
        "fieldNameIndex": "study_contact_names",
        "dataTypeToIndex": "keyword"
    },
    "updated_at": {
        "fieldNameIndex": "updated_at",
        "dataTypeToIndex": "date"
    },
    "ctgov_prod_studies_clinwiki_crowd_key_value_ids": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "Crowd"
    },
    "ctgov_prod_studies_clinwiki_crowd_key_value_ids.crowd_key": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "Crowd"
    },
    "ctgov_prod_studies_clinwiki_crowd_key_value_ids.crowd_value": {
        "fieldNameIndex": "",
        "dataTypeToIndex": "Crowd"
    }
    
}

