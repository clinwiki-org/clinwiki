import logger from '../../util/logger';
import {queryHasura} from '../../util/db';
import {bulkUpsertDocs,bulkUpdate} from '../../search/elastic';
import moment from 'moment';
const util = require('util')

const SAMPLE_QUERY = (docKey) =>  `

query MyQuery(
    $idList: [String!]
    ) {
    ctgov_studies(where: {${docKey}: {_in: $idList}}) {
      nct_id
      brief_title
      overall_status
      phase
      study_type
      start_date
      last_update_posted_date
      completion_date
      completion_date_type
      enrollment
      has_expanded_access
      ctgov_studies_facilities {
        name
        city
        state
        zip
        country
        ctgov_facilities_clinwiki_facility_locations {
          latitude
          longitude
        }
        contacts {
          name
        }
      }
      updated_at
    }
  }
  
`

const getBulkDocuments = async (dockKey, idList, gqlQuery) => {
    // let params = idList.map( (id,index) => '$'+(index+1));
    // const query = 'select * from studies where nct_id in ('+params.join(',')+')';
    // const rs = await queryAACT(query,idList);

    //Instead of above should run passed in GQL query 

    // 
console.log(dockKey, idList, gqlQuery)
    let result = await queryHasura(gqlQuery,{idList})
    console.log("PEW PEW",util.inspect(result, false,null,true ))

    return result ;
}

export const reindexDocument = async (payload) => {
    //PAYLOAD: 
    // PrimaryKey
    // PrimaryKeyList 
    //GraphQlQuery
    //IndexName

    console.log("PAYLOAD",payload)

    const docKey = payload.primaryKey;
    const idList = payload.primaryKeyList;
    const gqlQuery = SAMPLE_QUERY(docKey)
    const indexName = payload.indexName

    const results = await getBulkDocuments(docKey, idList, gqlQuery);
     console.log(util.inspect(results, false, null, true))

        let documents = [];

        for(let i=0;i<results.data.ctgov_studies.length;i++) {
        let document = results.data.ctgov_studies[i];
        let currentTime = Date.now();
        let formattedTime = moment(currentTime).format('YYYY-MM-DD');
        document.indexed_at = formattedTime
        documents.push(document);
    }
      
    logger.info("Sending bulk update of "+idList.length);

    let response = await bulkUpsertDocs(documents, docKey, indexName);

    console.log("-------------------");
    console.log("Bulk Upsert Response")
    console.log(util.inspect(response, false, null, true));



    


    // let studies = [];
    // for(let i=0;i<results.rowCount;i++) {
    //     let study = results.rows[i];
    //     let currentTime = Date.now();
    //     let formattedTime = moment(currentTime).format('YYYY-MM-DD');
    //     study.indexed_at = formattedTime
    //     studies.push(study);
    // }
    // logger.info("Sending bulk update of "+idList.length);
    // // console.log(util.inspect(studies, false, null, true ))
    // let response = await bulkUpsert(studies);
    // // console.log("-------------------");
    // // console.log("Bulk Upsert Response")
    // // console.log(util.inspect(response, false, null, true));
    // // await sendBriefSummaries(idList);
    // // await sendConditions(idList);
    // // await enqueueJob(JOB_TYPES.GEOCODE_LOCATIONS,{studies: idList});
    // logger.info("Bulk update complete.");

}
