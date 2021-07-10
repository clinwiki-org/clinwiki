import { query, queryAACT } from '../../util/db';

import { Client } from '@googlemaps/google-maps-services-js';
import { bulkUpdate } from '../../search/elastic';
import logger from '../../util/logger';

const zg = require('zip2geo');

const util = require('util');

let IS_RUNNING = false;

export const geocodeStudies = async payload => {
    //added queries to updae geo2zip in postgres
    //convert this to just indexing, not geocoding, until improved algorithm for address lookup and cleanup implemented
    logger.info('indexing study locations');
    const idList = payload.studies;
    logger.info('Geocoding ' + idList.length + ' studies');
    let facilityMap = new Map();
    const paramList = ['United States']; //not using but leaving since don't know how to fix
    let params = idList.map((id, index) => {
        paramList.push(id);
        return '$' + (index + 2);
    });
    const facilityQuery =
        //query joins facility to get nct_id with facility_loctions to get lat/lon
        //don't limit by country because name, city, state, country all have to index regardless
        //order by so bulk processes nct_ids together ()
            ' select f.nct_id , f."name" , f.city , f.state , f.zip , f.country , fl.latitude , fl.longitude , fl.status ' +
			' from ctgov.facilities f ' +
			' left outer join public.facility_locations fl ' + 
			' on f."name" = fl."name" and f.city = fl.city and f.state = fl.state and f.zip = fl.zip and f.country = fl.country ' + 
			' where f.country=$1 and f.nct_id in (' + 
            params.join(',') +
            ') ' +
            ' ORDER BY f.nct_id';
            // 'select * from facilities where country=$1 and nct_id in (' +
            // params.join(',') +
            // ') ';
    const facilities = await queryAACT(facilityQuery, paramList);
    logger.info('Geocoding study location facilities ' + facilities.rowCount);
    for (let i = 0; i < facilities.rowCount; i++) {
        try {
            const facility = facilities.rows[i];

            console.log(util.inspect(facility, false, null, true));
            logger.info('jumping to format row to index', facility);
            //facility objec/row now has lat/lon
            addFacilityToStudyMap(facilityMap, {
                nct_id: facility.nct_id,
                name: facility.name,
                city: facility.city,
                state: facility.state,
                country: facility.country,
                //not sure lat/lon handle null, so keeping with prior code that added || ''
                latitude: facility.latitude || '',
                longitude: facility.longitude | '',
            });

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




