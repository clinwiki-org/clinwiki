import {isAdmin} from '../users/user.manager';
import {aactReindexAllJob,aactReindexSingleStudyJob, } from '../pipeline/jobs/aact.job';
import { genericDocumentJob, allGenericDocumentsJob} from '../pipeline/jobs/indexDoc.job';
const adminResolver = {
    reindexAll: async (args,context) => {
        if(isAdmin(context.user)) {
            await aactReindexAllJob();
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
