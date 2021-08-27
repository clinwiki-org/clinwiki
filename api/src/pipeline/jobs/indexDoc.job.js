import logger from '../../util/logger';
import { queryHasura } from '../../util/db';
import { graphqlToIndexMapping } from '../../util/graphqlToIndexMapping';
import { bulkUpsertDocs, bulkUpdate } from '../../search/elastic';
import { JOB_TYPES, enqueueJob } from '../pipeline.queue';
import moment from 'moment';
const util = require('util')

const CHUNK_SIZE = 1000;

let IS_RUNNING = false;

const QUERY_ALL_CONDITION_IDS = `
query MyQuery {
  disyii2_prod_20210704_2_tbl_conditions {
    condition_id
  }
}
`
const QUERY_ALL_NCT_IDS = `
query MyQuery {
  ctgov_prod_studies {
    nct_id
  }
}
`

const SAMPLE_QUERY_CLINWIKI = (docKey) => `

query MyQuery(
    $idList: [String!]
    ) {
    ctgov_prod_studies (where: {${docKey}: {_in: $idList}}) {
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
      ctgov_prod_studies_facilities {
        name
        city
        state
        zip
        country
        ctgov_prod_facilities_clinwiki_facility_locations {
          latitude
          longitude
        }
        contacts {
          name
        }
      }
      updated_at
      ctgov_prod_studies_clinwiki_crowd_key_value_ids {
        crowd_key
        crowd_value
      }
      ctgov_prod_studies_browse_conditions {
        mesh_term
      }
      ctgov_prod_studies_browse_interventions {
        mesh_term
      }
      ctgov_prod_studies_central_contacts {
        name
      }
    }
  }
  
`
const SAMPLE_QUERY_DIS = (docKey) => `

query MyQuery(
  $idList: [bigint!]
  ) {
  disyii2_prod_20210704_2_tbl_conditions(where: {${docKey}: {_in: $idList}}) {
    condition_id
    conditions_condition_name {
      name
      mod_date
      mod_by
    }
    description
    mesh
    ncbi
    pubmed
    snomedct
    umls
    condition_conditions_tags {
      fk_condition_id
      fk_tag_id
      cr_date
      conditions_tags_condition_tags {
        tag_name
      }
    }
  }
}

  
`
const chunkList = (list, size) => {
  let result = []
  for (let i = 0; i < list.length; i += size) {
    let chunk = list.slice(i, i + size)
    result.push(chunk)
  }
  return result;
};
export const genericDocumentJob = async (args) => {
  try {
    if (!IS_RUNNING) {
      IS_RUNNING = true;
      logger.info('Starting Doc. Job');
      const bulkList = chunkList(args.primaryKeyList, CHUNK_SIZE);
      console.log("LIST", bulkList)
      for (let j = 0; j < bulkList.length; j++) {
        const idList = bulkList[j];
        // Queue these up for reindexing
        await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { ...args, primaryKeyList: idList });
      }
      logger.info('Job GENERIC Doc. Finished.')
      IS_RUNNING = false;
    }
  }
  catch (err) {
    logger.error(err);
    IS_RUNNING = false;
  }
};

const getAllDocuments = async (primaryKey) => {
  const hasuraInstance =  primaryKey == "nct_id" ? "studies":"dis";
  const HASURA_QUERY = hasuraInstance == "dis" ? QUERY_ALL_CONDITION_IDS: QUERY_ALL_NCT_IDS
  console.log("GETTING ALL DOCS");
  let result = await queryHasura(HASURA_QUERY, {} ,hasuraInstance );

console.log("RESULTS FOR ALL DOPCS", result)

  return hasuraInstance == "dis" ? result.data.disyii2_prod_20210704_2_tbl_conditions.map( row => row.condition_id)
  : result.data.ctgov_prod_studies.map( row => row.nct_id);
};




export const allGenericDocumentsJob = async (args) => {
  try {
    if (!IS_RUNNING) {
      IS_RUNNING = true;
      logger.info('Starting Reindex all');

      const genericDocumentIds = await getAllDocuments(args.primaryKey);


      const bulkList = chunkList(genericDocumentIds, CHUNK_SIZE);
      const docKey = args.primaryKey
      const indexName = args.indexName
      // console.log("LIST", bulkList)
      
      for (let j = 0; j < bulkList.length; j++) {
        const idList = bulkList[j];
        console.log(docKey, indexName)
        // Queue these up for reindexing
        await enqueueJob(JOB_TYPES.DOCUMENT_REINDEX, { ...args, primaryKeyList: idList, primaryKey: docKey, indexName: indexName });
      }
      logger.info('Job GENERIC Doc. Finished.')
      IS_RUNNING = false;
    }
  }
  catch (err) {
    logger.error(err);
    IS_RUNNING = false;
  }
};

const parseDataType = async (fieldNameIndex, dataTypeToIndex, data, key) => {
  // console.log(key, data)
  let tempObj = {};
  switch (dataTypeToIndex) {
    case "PrimaryKey":
      tempObj[fieldNameIndex] = data
      return tempObj
    case "keyword":
      tempObj[fieldNameIndex] = data
      return tempObj
    case "date":
      //Need to handle null dates, currently passing todays date
      tempObj[fieldNameIndex] = moment(data || "2021-07-28").format('YYYY-MM-DD');
      return tempObj
    case "long":
      tempObj[fieldNameIndex] = parseInt(data);
      return tempObj
    case "boolean":
      if (typeof data == "boolean") {
        tempObj[fieldNameIndex] = data
      }
      //need to code else
      return tempObj
    case "geo_point":
      //building object from field name location.lat || location.long 
      let tempObject = {};
      let finalObject = {};
      fieldNameIndex.split('.').map((k, i, values) => {
        if (i == 0) {
          finalObject[values[i]] = tempObject;
        } else {
          tempObject[k] = data
          finalObject = { ...finalObject };
        }
      });
      return finalObject
    case "SKIP":
      console.log("Skipping", key)
      return
    case "Crowd":
      let crowdObject = {};
      let frontMatterKeys = [];
      let crowdKeyArray = []

      if (data.map) {
        data.map((val, i) => {
          const key = val.crowd_key;
          const value = val.crowd_value
          crowdKeyArray.push({crowd_key: key, crowd_value: value})
          if (i == 0) {
            frontMatterKeys.push(key)
            crowdObject[`fm_${key}`] = [value];
          } else {
            frontMatterKeys.indexOf(`fm_${key}`) == -1 && frontMatterKeys.push(key);
            crowdObject[`fm_${key}`] ? crowdObject[`fm_${key}`] = [...crowdObject[`fm_${key}`], value] :
              crowdObject[`fm_${key}`] = [value];
          }
        })
      }
        crowdObject['crowd_keys'] = crowdKeyArray

      return { front_matter_keys: frontMatterKeys, ...crowdObject }
    case "sub_query":

      let currentObject = {}

      function objCombine(obj, variable) {
        for (let k of Object.keys(obj)) {
          if (!variable[k]) variable[k] = {};

          for (let innerKey of Object.keys(obj[k]))
            variable[k][innerKey] = obj[k][innerKey];
        }
      }

      const functionThatReturnsAPromise = (doc) => {
        //a function that returns a promise
        return Promise.resolve(doc)
      }

      const doSomethingAsync = async (val, key) => {
        let doc = await getDocumentMapping(val, key);
        return functionThatReturnsAPromise(doc)
      }

      const getData = async () => {
        return Promise.all(data.map(
          async (val, i) => {

            let doc = await doSomethingAsync(val, key)
            // console.log("SUBQUERY DOC", doc)
            if (i == 0) {
              for (const [key, value] of Object.entries(doc)) {
                currentObject[key] = [value]
              }
            } else {
              for (const [key, value] of Object.entries(doc)) {
                // console.log("KEY KEY", currentObject[key])
                let currentValue = currentObject[key]
                let valueTobeAdded = [value]
                currentObject[key] = valueTobeAdded.concat(currentValue)
              }
            }
            // console.log("KURENT", currentObject)
            return currentObject
          }));
      }
      const getData2 = async () => {
        let someOtherObject = {};
        return Promise.all(
          Object.entries(data)
            .map(
              async ([dataKey, dataVal], i) => {
                someOtherObject[dataKey] = dataVal
                let doc = await doSomethingAsync(someOtherObject, key)
                // console.log("SUBQUERY DOC2", doc)
                someOtherObject = {};


                let combined = {};
                objCombine(doc, combined);
                objCombine(currentObject, combined);
                currentObject = combined
                return combined
              }));
      }

      if(!data){
        return
      }
      //handles array values such as facilities
      if (data.map) {
        //Async hell 
        let response = await getData().then(data => {
          return data[0] && data[0]
        })
        return response
      } else {
        //lat long comes bac as an object so has to be handled here         
        let response = await getData2().then(data2 => {
          return data2[1] && data2[1]
        })
        return response

      }
  }
}
const getBulkDocuments = async (dockKey, idList, gqlQuery) => {
const hasuraInstance = dockKey == "nct_id"? "studies":" dis"
  // console.log(dockKey, idList, gqlQuery);
  let result = await queryHasura(gqlQuery, { idList },hasuraInstance );
  // console.log("PEW PEW", util.inspect(result, false, null, true));

  return result;
}
const getDocumentMapping = async (document, parentField) => {
  let mappedDoc = {};
  // console.log("WHATS UP DOC", document)
  for (const [key, value] of Object.entries(document)) {
    // console.log("KEY", key)
    // console.log("VALUE", value)
    // console.log("PARENT", parentField)

    let parsedValue = parentField ? await parseDataType(graphqlToIndexMapping[`${parentField}.${key}`].fieldNameIndex, graphqlToIndexMapping[`${parentField}.${key}`].dataTypeToIndex, value, `${parentField}.${key}`) : await parseDataType(graphqlToIndexMapping[key].fieldNameIndex, graphqlToIndexMapping[key].dataTypeToIndex, value, key)


    mappedDoc = {
      ...mappedDoc,
      ...parsedValue
    }


  }
  // console.log("MAPPEDFINAL", mappedDoc)
  return mappedDoc
}
export const reindexDocument = async (payload) => {
  //PAYLOAD: 
  // PrimaryKey
  // PrimaryKeyList 
  //GraphQlQuery
  //IndexName

  // console.log("PAYLOAD", payload)

  const docKey = payload.primaryKey;
  const idList = payload.primaryKeyList;
  const indexName = payload.indexName;

  const gqlQuery = (index) =>{
    if( index == "studies_development" || index == "studies_production"){
      return SAMPLE_QUERY_CLINWIKI(docKey);
    }
    if( index == "dis_development" || index == "dis_production"){
      return SAMPLE_QUERY_DIS(docKey);
    }
  }

  const results = await getBulkDocuments(docKey, idList, gqlQuery(indexName));
  // console.log(util.inspect(results, false, null, true))

  let documents = [];

  if(payload.indexName == "studies_development" || payload.indexName ==  "studies_production"){
    for (let i = 0; i < results?.data?.ctgov_prod_studies.length; i++) {
      let document = results.data.ctgov_prod_studies[i];

      let mappedDoc = await getDocumentMapping(document);

      let currentTime = Date.now();
      let formattedTime = moment(currentTime).format('YYYY-MM-DD');
      mappedDoc.indexed_at = formattedTime
      documents.push(mappedDoc);
    }
  } 
  if(payload.indexName == "dis_development" || payload.indexName ==  "dis_production"){

    for (let i = 0; i < results?.data?.disyii2_prod_20210704_2_tbl_conditions?.length; i++) {
      let document = results.data.disyii2_prod_20210704_2_tbl_conditions[i];
      
      let mappedDoc = await getDocumentMapping(document);
      
      let currentTime = Date.now();
      let formattedTime = moment(currentTime).format('YYYY-MM-DD');
      mappedDoc.indexed_at = formattedTime
      documents.push(mappedDoc);
    }
  } 
    
  logger.info("Sending bulk update of " + idList.length);
  logger.info("Sending bulk update of " + documents);

  let response = await bulkUpsertDocs(documents, docKey, indexName);

  console.log("-------------------");
  console.log("Bulk Upsert Response")
  console.log(util.inspect(response, false, null, true));
}
