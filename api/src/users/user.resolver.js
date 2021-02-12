import * as UserManager from './user.manager';

const userResolver = {
    me: (args,context) => {
        return context.user;
    },
    signIn: async (args,context) => {
        const payload = await UserManager.authenticate(args.input.email,args.input.password,args.input.oAuthToken);
        return payload;
    }
}

export default userResolver;