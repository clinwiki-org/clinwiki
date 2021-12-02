import {isAdmin} from '../users/user.manager';
import {query} from '../util/db';
import {aactReindexAllJob,aactReindexSingleStudyJob, } from '../pipeline/jobs/aact.job';
import scheduledDocJob, { genericDocumentJob, allGenericDocumentsJob} from '../pipeline/jobs/indexDoc.job';
const adminResolver = {
    actionQuery: async (args, context) =>{
        if(isAdmin(context.user)){
            try{
            let response = await query(args.input,[])    
            return JSON.stringify(response);
            }
            catch(err){
                return err
            }
        }
    },
    reindexAll: async (args,context) => {
        if(isAdmin(context.user)) {
            await aactReindexAllJob();
        }
        return 'Success';
    },
    reindexByDate: async (args,context) => {
        if(isAdmin(context.user)) {
            await scheduledDocJob(args.date);
        }
        return 'Success';
    },
    reindexStudy: async (args,context) => {
        if(isAdmin(context.user)) {
            await aactReindexSingleStudyJob(args.input);
        }
        return 'Success';
    },
    reindexDocument: async (args,context) => {
        if(isAdmin(context.user)) {
            console.log("ARGGGGG", args)
            await genericDocumentJob(args);
        }
        return 'Success';
    },
    reindexAllDocuments: async (args,context) => {
        if(isAdmin(context.user)) {
            console.log("ARGGGGG", args)
            await allGenericDocumentsJob(args);
        }
        return 'Success';
    }
}

export default adminResolver;
