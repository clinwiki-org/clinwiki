import jwt from 'jsonwebtoken';
import * as UserManager from './user.manager';
import config from '../../config';
import logger from '../util/logger';

export default async function getAuthenticatedUser(req) {
    //console.log("getAuthenticatedUser called");
    try {
	if(!req.headers['authorization']) {
            return undefined;
        }
	const bearer = req.headers['authorization'].split(' ');
	if(bearer.length !== 2) {
            return undefined;
        }
        const token = bearer[1];
        const decoded = jwt.verify(token,config.jwtSecret);
        //console.log("before getUserByEmail")
	const user = await UserManager.getUserByEmail(decoded.email);
	//console.log("user = ", user);
	return user;
    }
    catch(err) {
        logger.error(err);
    }
    return undefined;
}
