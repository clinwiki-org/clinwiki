import jwt from 'jsonwebtoken';
import * as UserManager from './user.manager';
import config from '../../config';
import logger from '../util/logger';

export default async function getAuthenticatedUser(req) {
    try {
        console.log(req.headers['authorization'].split(' '));
	if(!req.headers['authorization']) {
            return undefined;
        }
	const bearer = req.headers['authorization'].split(' ');
        console.log(bearer);
        if(bearer.length !== 2) {
            return undefined;
        }
        const token = bearer[1];
        const decoded = jwt.verify(token,config.jwtSecret);
        const user = await UserManager.getUserByEmail(decoded.email);
        return user;
    }
    catch(err) {
        logger.error(err);
    }
    return undefined;
}
