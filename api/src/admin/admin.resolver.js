import {isAdmin} from '../users/user.manager';
import {aactReindexAllJob,aactReindexSingleStudyJob, } from '../pipeline/jobs/aact.job';
import { reindexDocument} from '../pipeline/jobs/indexDoc.job';
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
            await reindexDocument(args);
        }
        return 'Success';
    }
}

export default adminResolver;
