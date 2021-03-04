import * as UserManager from './user.manager';

const userResolver = {
    me: (args,context) => {
        return context.user;
    },
    signIn: async (args,context) => {
        console.log("signIn called in the resolver");
	const payload = await UserManager.authenticate(args.input.email,args.input.password,args.input.oAuthToken);
        return payload;
    },
    signUp: async (args,context) => {
        console.log("signUp called in resolver");
	const payload = await UserManager.signUp(args.input.email,args.input.password,args.input.oAuthToken);
        console.log('payload', payload);
	return payload;
    }
    
}

export default userResolver;
