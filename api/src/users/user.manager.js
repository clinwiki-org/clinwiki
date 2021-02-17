import bcrypt from 'bcrypt';
import {query} from '../util/db';
import logger from '../util/logger';
import * as GoogleAPI from '../util/google';
import jwt from 'jsonwebtoken';
import config from '../../config';

const QUERY_USER = 'select * from users where email=$1';
const QUERY_USER_ROLES = 'select name from roles where id in (select role_id from users_roles where user_id=$1)';
const QUERY_USER_REVIEWS = 'select * from reviews where user_id=$1';
const QUERY_USER_WIKI_CONTRIBUTIONS = 'select distinct wiki_page_id from wiki_page_edits where user_id=$1';
const QUERY_NEW_USER = 'insert into users (email,encrypted_password,default_query_string,picture_url) values ($1,$2,$3,$4)';


export async function authenticate(email,password,oAuthToken) {
    logger.info('Authenticate user '+email);

    try {
        if(oAuthToken) {
            logger.info("Logging in with oAuthToken")
            const payload = await GoogleAPI.verifyToken(oAuthToken);

            const user = await getUserByEmail(payload.email);
            if(user) {
                logger.info('Found user '+user.id)
                    const token = await generateJWT(user);
                    return {
                        jwt: token,
                        user: user
                    };
            }
            else {
                // go ahead and create one.
            }

        }
        else {
            const user = await getUserByEmail(email)
            if(user) {
                logger.info('Found user '+user.id)
                const isValid = await bcrypt.compare(password,user.encrypted_password);
                if(isValid) {                
                    const token = await generateJWT(user);
                    return {
                        jwt: token,
                        user: user
                    };
                }
            }                
        }
    }
    catch(err) {
        logger.error(err);
    }
}

async function generateJWT(user) {
    const token = jwt.sign({
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + config.jwtExpire
    },config.jwtSecret,{ algorithm: 'HS256' });
    return token;
}

export async function getUserByEmail(email) {
    const results = await query(QUERY_USER,[email]);
    if(results.rows.length === 1) {
        const user = results.rows[0];
        user.roles = await getUserRoles(user.id);        
        user.reviews = await getUserReviews(user.id);
        user.reviewCount = user.reviews ? user.reviews.length : 0;
        const wikis = await getUserWikis(user.id);
        user.contributions = wikis ? wikis.length : 0;

        return user;
    }
}

export async function getUserRoles(userId) {
    const roleResults = await query(QUERY_USER_ROLES,[userId]);
    return roleResults.rows.map(r => r.name);
}

export async function getUserReviews(userId) {
        const reviewResults = await query(QUERY_USER_REVIEWS,[userId]);
        return reviewResults.rows;
}

export async function getUserWikis(userId) {
    const wikis = await query(QUERY_USER_WIKI_CONTRIBUTIONS,[userId]);
    return wikis.rows;
}

export async function signup(email,password, defaultQueryString, oAuthToken) {
//     if o_auth_token
//     return { jwt: nil, user: nil, errors: ["Oauth token not three segments"] } if !o_auth_token.split(".").size.eql? 3
//     header = Base64.decode64 (o_auth_token.split(".")[0])
//     kid = header ? JSON.parse(header)["kid"] : nil
//     return { jwt: nil, user: nil, errors: ["Oauth token missing kid"] } if !kid
//     payload, header = decode_jwt(o_auth_token, kid)
//     email = payload["email"]
//     password = Devise.friendly_token(8)
//     provider = payload["iss"]
//     picture_url = payload["picture"]
//   end
//   user = User.find_by(email: email)
//   return { jwt: nil, user: nil, errors: ["Email already exists"] } if user

//   user = User.new(email: email, default_query_string: default_query_string, picture_url: picture_url)
//   user.password = password
//   # user.provider = provider if provider

//   if user.save
//     exp = Time.now.to_i + exp_secs.to_i
//     jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")
//     { jwt: jwt, user: user, errors: nil }
//   else
//     { jwt: nil, user: nil, errors: user.errors.full_messages }
//   end
// end
    let pictureUrl = null;
    let encryptedPassword = null;
    if(oAuthToken) {
        
    }
    else {
        //encryptedPassword = bcrypt.
    }
    const exists = await query(QUERY_USER,[email]);
    if(exists) {
        throw new Error('Email already exixts');
    }
    const user = await createNewUser(email,encryptedPassword,defaultQueryString,pictureUrl);
}

async function createNewUser(email,password,defaultQueryString,pictureUrl) {
    const user = await query(QUERY_NEW_USER,[email,password,defaultQueryString,pictureUrl]);
    return user;
}