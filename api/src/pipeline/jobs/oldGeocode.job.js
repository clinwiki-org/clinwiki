import { query, queryAACT } from '../../util/db';

import { Client } from '@googlemaps/google-maps-services-js';
import { bulkUpdate } from '../../search/elastic';
import logger from '../../util/logger';
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
            console.log('----------FACILITY---------');
            const facility = facilities.rows[i];
            console.log(util.inspect(facility, false, null, true));
            logger.info('FACILITY FROM GEOCODE', facility);
            //// ADDED THIS QUERY TO GET LOCATIONS FROM FACILITY LOCATIONS
            let results = await query(
                'select id, latitude, longitude from facility_locations where name=$1 and city=$2 and state=$3 and country=$4 and latitude IS NOT NULL',
                [facility.name, facility.city, facility.state, facility.country]
            );
            logger.info('RESULTS SITUATION', results);

            /// IF WE DON"T GET LOCATIONS WE RUN A DIFF QUERY (there must be a better way to do this)
            if (results.rowCount === 0) {
                results = await query(
                    'select id from facility_locations where name=$1 and city=$2 and state=$3 and country=$4 and zip=$5',
                    [
                        facility.name,
                        facility.city,
                        facility.state,
                        facility.country,
                        facility.zip,
                    ]
                );
                // logger.info('FACILITY RESULTS', results)
            }
            let facilityLocationId;
            let facilityLocation;
            if (results.rowCount === 0) {
                /// if both queries turn up nada we will insert to the facility_locations table
                console.log('In ZERO CONDITIONAL');
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
                // logger.info('FACILITY ID', facilityLocationId)
            } else {
                facilityLocation = {
                    latitude: results.rows[0].latitude || '',
                    longitude: results.rows[0].longitude || '',
                };
                // logger.info('FACILITY LAT', facilityLocation)
                console.log('IN ELSE CONDITIONAL');
                facilityLocationId = results.rows[0].id;
                logger.info('FACILITY ID', facilityLocationId);
                // console.log("ID",facilityLocationId)
            }

            // Now figure out if we need to geocode this location
            let location = await findOrCreateByName(facility.name);
            // console.log("Location to follow:");
            // console.log(util.inspect(location, false, null, true));
            if (!location.checked) {
                console.log('Location Not checked');
                location = geocodeLocation(location);
                addFacilityToStudyMap(facilityMap, {
                    nct_id: facility.nct_id,
                    name: facility.name,
                    city: facility.city,
                    state: facility.state,
                    country: facility.country,
                    latitude: facilityLocation.latitude,
                    longitude: facilityLocation.longitude,
                });
            }

            if (location.partial_match) {
                console.log('Location Partial match');
                let zipName = `${location.city} ${location.state} ${location.zip} ${location.country} `;
                let zip = await findOrCreateByName(zipName);
                if (!zip.checked) {
                    console.log('No zip');
                    zip = geocodeLocation(zip);
                    addFacilityToStudyMap(facilityMap, {
                        nct_id: facility.nct_id,
                        name: facility.name,
                        city: facility.city,
                        state: facility.state,
                        country: facility.country,
                        latitude: facilityLocation.latitude || '',
                        longitude: facilityLocation.longitude || '',
                    });
                }
                if (zip.partial_match) {
                    console.log('Zip PARTIAL', location);
                    await query(
                        'update facility_locations set status=$1 where id=$2',
                        ['bad', facilityLocationId]
                    );
                    //Had to add this to index even on partial matches since we deleted our index
                    //May have to be commented out after reindex is ran on staging
                    addFacilityToStudyMap(facilityMap, {
                        nct_id: facility.nct_id,
                        name: facility.name,
                        city: facility.city,
                        state: facility.state,
                        country: facility.country,
                        latitude: facilityLocation.latitude || '',
                        longitude: facilityLocation.longitude || '',
                    });
                } else {
                    console.log('ELSE');
                    await query(
                        'update facility_locations set latitude=$1, longitude=$2, status=$3 where id=$3',
                        [zip.latitude, zip.longitude, 'zip', facilityLocationId]
                    );
                    addFacilityToStudyMap(facilityMap, {
                        nct_id: facility.nct_id,
                        name: facility.name,
                        city: facility.city,
                        state: facility.state,
                        country: facility.country,
                        latitude: facilityLocation.latitude || '',
                        longitude: facilityLocation.longitude || '',
                    });
                }
            } else {
                console.log('ELSE ELSE');
                let response = await query(
                    'update facility_locations set latitude=$1, longitude=$2, status=$3 where id=$4',
                    [
                        location.latitude,
                        location.longitude,
                        'good',
                        facilityLocationId,
                    ]
                );

                console.log('FFFFFFs');
                console.log(facility);
                addFacilityToStudyMap(facilityMap, {
                    nct_id: facility.nct_id,
                    name: facility.name,
                    city: facility.city,
                    state: facility.state,
                    country: facility.country,
                    latitude: facilityLocation.latitude,
                    longitude: facilityLocation.longitude,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    console.log('MAP before spread', facilityMap);
    // Now send the map to Elasticsearch
    const listToUpdate = [...facilityMap.values()];
    console.log(listToUpdate);
    await bulkUpdate(listToUpdate);
    logger.info('Finished geocoding study locations');
};

const addFacilityToStudyMap = (map, facility) => {
    console.log('In Add facility Locations');
    console.log('Map' + util.inspect(map, false, null, true));
    console.log(
        'Facility in AFTSM' + util.inspect(facility, false, null, true)
    );
    let found = map.get(facility.nct_id);
    console.log('FOUND');
    console.log(found);
    if (!found) {
        console.log('IN NOT FOUND');
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
    //Seems like part of the issue was that the object was mismatched to the expected type when facility.latitude and/or longitude was undefined
    // locations would send as [{}] was expecting something more like [{lat: undefined, lon: undefined}]
    facility.latitude &&
        facility.longitude &&
        found.locations.push({
            lat: facility.latitude,
            lon: facility.longitude,
        });

    // console.log("POST FOUND" + util.inspect(found, false, null, true));
    map.set(facility.nct_id, found);
    // console.log("Post MAP" + util.inspect(map, false, null, true));
};

const findOrCreateByName = async name => {
    console.log('IN FIND OR CREATE');
    let locations = await query('select * from locations where name=$1', [
        name,
    ]);
    console.log('Locations here: ');
    // console.log(util.inspect(locations.rowCount, false, null, true));
    if (locations.rowCount !== 0) {
        ('if locations not 0');
        return locations.rows[0];
    }
    console.log('Some other place');

    const location = await query(
        'insert into locations (name) values ($1) RETURNING *',
        [name]
    );
    // console.log(util.inspect(location, false,null, true));
    return location.rows[0];
};

const geocodeLocation = async location => {
    console.log('GEO LOCATING', location);
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
