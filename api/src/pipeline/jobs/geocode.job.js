import { Client } from '@googlemaps/google-maps-services-js';
import logger from '../../util/logger';
import { query, queryAACT } from '../../util/db';
import { bulkUpdate } from '../../search/elastic';
const util = require('util');

let IS_RUNNING = false;

export const geocodeStudies = async payload => {
    logger.info('Geocoding study locations');
    const idList = payload.studies;
    logger.info('Geocoding ' + idList.length + ' studies');
    let facilityMap = new Map();
    const paramList = ['United States'];
    let params = idList.map((id, index) => {
        paramList.push(id);
        return '$' + (index + 2);
    });
    const facilityQuery =
        'select * from facilities where country=$1 and nct_id in (' +
        params.join(',') +
        ') ';
    const facilities = await queryAACT(facilityQuery, paramList);
    logger.info('Geocoding study location facilities ' + facilities.rowCount);
    for (let i = 0; i < facilities.rowCount; i++) {
        try {
            const facility = facilities.rows[i];
            let results = await query(
                'select id from facility_locations where name=$1 and city=$2 and state=$3 and zip=$4 and country=$5',
                [
                    facility.name,
                    facility.city,
                    facility.state,
                    facility.zip,
                    facility.country,
                ]
            );

            let facilityLocationId;
            if (results.rowCount === 0) {
                // New location. Create a record.
                let insertResults = await query(
                    'insert into facility_locations (name,city,state,zip,country) values ($1,$2,$3,$4,$5) RETURNING id',
                    [
                        facility.name,
                        facility.city,
                        facility.state,
                        facility.zip,
                        facility.country,
                    ]
                );
                facilityLocationId = insertResults.rows[0].id;
            } else {
                facilityLocationId = results.rows[0].id;
            }

            // Now figure out if we need to geocode this location
            let location = await findOrCreateByName(facility.name);

            if (!location.checked) {
                location = geocodeLocation(location);
            }

            if (location.partial_match) {
                let zipName = `${location.city} ${location.state} ${location.zip} ${location.country} `;
                let zip = await findOrCreateByName(zipName);
                if (!zip.checked) {
                    zip = geocodeLocation(zip);
                }
                if (zip.partial_match) {
                    await query(
                        'update facility_locations set status=$1 where id=$2',
                        ['bad', facilityLocationId]
                    );
                } else {
                    await query(
                        'update facility_locations set latitude=$1, longitude=$2, status=$3 where id=$3',
                        [zip.latitude, zip.longitude, 'zip', facilityLocationId]
                    );
                    addFacilityToStudyMap(facilityMap, {
                        nct_id: facility.nct_id,
                        latitude: zip.latitude,
                        longitude: zip.longitude,
                    });
                }
            } else {
                await query(
                    'update facility_locations set latitude=$1, longitude=$2, status=$3 where id=$4',
                    [
                        location.latitude,
                        location.longitude,
                        'good',
                        facilityLocationId,
                    ]
                );
                addFacilityToStudyMap(facilityMap, {
                    nct_id: facility.nct_id,
                    name: facility.name,
                    city: facility.city,
                    state: facility.state,
                    country: facility.country,
                    latitude: location.latitude,
                    longitude: location.longitude,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Now send the map to Elasticsearch
    const listToUpdate = [...facilityMap.values()];
    await bulkUpdate(listToUpdate);
    logger.info('Finished geocoding study locations');
};

const addFacilityToStudyMap = (map, facility) => {
    let found = map.get(facility.nct_id);
    if (!found) {
        found = {
            nct_id: facility.nct_id,
            facility_names: [],
            facility_states: [],
            facility_cities: [],
            facility_countries: [],
            locations: [],
        };
    }
    found.facility_names.push(facility.name);
    found.facility_states.push(facility.state);
    found.facility_cities.push(facility.city);
    found.facility_countries.push(facility.country);
    found.locations.push({ lat: facility.latitude, lon: facility.longitude });
    map.set(facility.nct_id, found);
};

const findOrCreateByName = async name => {
    let locations = await query('select * from locations where name=$1', [
        name,
    ]);
    if (locations.rowCount !== 0) {
        return locations.rows[0];
    }
    const location = await query(
        'insert into locations (name) values ($1) RETURNING *',
        [name]
    );
    return location.rows[0];
};

const geocodeLocation = async location => {
    let result;
    if (process.env.GOOGLE_MAPS_API_KEY) {
        try {
            const client = new Client({});
            let response = await client.geocode({
                params: {
                    address: location.name,
                    key: process.env.GOOGLE_MAPS_API_KEY,
                },
            });
            if (response.data.results.length > 0) {
                result = response.data.results[0];
            }
        } catch (err) {
            logger.error(err);
        }
    }

    if (result) {
        await query(
            'update locations set latitude=$1,longitude=$2,partial_match=$3,location_type=$4,checked=$5 where id=$6',
            [
                result.geometry.location.lat,
                result.geometry.location.lng,
                result.partial_match,
                result.types,
                new Date(),
                location.id,
            ]
        );
    } else {
        await query(
            'update locations set partial_match=$1,location_type=$2,checked=$3 where id=$4',
            [true, ['note found'], new Date(), location.id]
        );
    }
    const updatedLoc = await query('select * from locations where id=$1', [
        location.id,
    ]);
    return updatedLoc.rows[0];
};
