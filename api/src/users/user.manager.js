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
const QUERY_USER_REACTIONS = 'select * from reactions where user_id=$1';

const ROLE_SITE_OWNER = 'site_owner';
const ROLE_ADMIN = 'admin';

export async function authenticate(email,password,oAuthToken) {
    console.log('authenticate (signIn called');
    logger.info('Authenticate user '+email);

    try {
        if(oAuthToken) {
            logger.info("Logging in with oAuthToken")
            const payload = await GoogleAPI.verifyToken(oAuthToken);

            const user = await getUserByEmail(payload.email);
            if(user) {
                logger.info('Found user '+user.id)
                    const token = await generateJWT(user);
                    console.log(token);
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
    console.log("generateJWT called");
    console.log(user);
    const token = jwt.sign({
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + config.jwtExpire
    },config.jwtSecret,{ algorithm: 'HS256' });
    return token;
}

export async function getUserByEmail(email) {
    console.log("getUserByEmail called");
    const results = await query(QUERY_USER,[email]);
    console.log("results = ");
    console.log(results);
    if(results.rows.length === 1) {
        const user = results.rows[0];
        user.roles = await getUserRoles(user.id);
        user.reviews = await getUserReviews(user.id);
        user.reviewCount = user.reviews ? user.reviews.length : 0;
        user.reactions = await getUserReactions(user.id);
        user.reactionsCount = user.reactions ? user.reactions.length : 0;
        const wikis = await getUserWikis(user.id);
        user.contributions = wikis ? wikis.length : 0;

        if(user.roles.includes(ROLE_SITE_OWNER)) {
            logger.debug('User is a site owner. Populate role dependent fields')
            
        }
        return user;
    }
}

export async function getUserRoles(userId) {
    const roleResults = await query(QUERY_USER_ROLES,[userId]);
    return roleResults.rows.map(r => r.name);
}

export async function getUserReviews(userId) {
        const reviewResults = await query(QUERY_USER_REVIEWS,[userId]);
        const list = reviewResults.rows.map( review => ({
            content: review.text,
            nctId: review.nct_id,
            briefTitle: 'ToDo: Migrate frontmatter parser for review content'
        }))
        return list;
}

export async function getUserReactions(userId) {
    const reviewResults = await query(QUERY_USER_REACTIONS,[userId]);
    return reviewResults.rows;
}

export async function getUserWikis(userId) {
    const wikis = await query(QUERY_USER_WIKI_CONTRIBUTIONS,[userId]);
    return wikis.rows;
}

export async function signUp(email,password, defaultQueryString, oAuthToken) {
//   if o_auth_token
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
    console.log("user.manager signUp called");
    //const exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400  need to figure out ENV
    const exp_secs = 86_400
    let pictureUrl = null;
    let encryptedPassword = null;
    console.log(`oAuthToken = ${oAuthToken}`);
    if(oAuthToken) {
	console.log("oAuthToken present");
	encryptedPassword = oAuthToken
    }
    else {
	console.log("oAuthToken not present");
	console.log(`pw = ${password}`);
	encryptedPassword = await bcrypt.hash(password, 10);
	console.log(`created pw = ${encryptedPassword}`);
    }
    console.log(`encryptedPassword = ${encryptedPassword}`);
    const exists = await query(QUERY_USER,[email]);
    console.log(exists.rows.length !== 0);
    if(exists.rows.length !== 0) {
        console.log(`exists.rows.length !== 0`);
        //return { jwt: null, user: null, errors: ["Email already exists"] }
	throw new Error('Email already exixts');
    }
    const user = await createNewUser(email,encryptedPassword,defaultQueryString,pictureUrl);
    console.log(user);
    const createdUser = await getUserByEmail(email)
    console.log("createUser = ");
    console.log(createdUser);
    if (createdUser) {
        /*console.log('user exists');
	const exp = Date.now.to_i + exp_secs.to_i
	console.log(exp);
        const header = { "typ": "JWT", "alg": "HS256" }
	console.log(header);
        const data = { email: user.email, exp: exp }
	console.log(data);
        const unsignedToken = base64url(header) + "." + base64url(data)
	console.log(unsignedToken);
        //hmac_secret = Rails.application.secrets.secret_key_base // need to get equivalent
        const hmac_secret = '12345' // need to get equivalent
        const jwt = unsignedToken + "." + base64url(HMAC256(unsignedToken, hmac_secret))
        console.log(jwt);
        //jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")
        //{ jwt: jwt, user: user, errors: nil }*/
	console.log("found user by email");
	const jwt = await generateJWT(createdUser);
    	if (jwt) {
    	    console.log('jwt present');
    	    console.log(jwt);
    	    return {
    	        jwt: jwt,
    	        user: createdUser//,
    	        //errors: nil
    	    };
    	}
    }
    else {
	
    }

    console.log('jwt not present');
    return null;
}

async function createNewUser(email,password,defaultQueryString,pictureUrl) {
    console.log("createNewUserCalled");
    console.log(`email = ${email}, password = ${password}, defaultQueryString = ${defaultQueryString}, pictureUrl = ${pictureUrl}`);
    const user = await query(QUERY_NEW_USER,[email,password,defaultQueryString,pictureUrl]);
    console.log(user);
    const newUser = await query(QUERY_USER,[email]);
    console.log(newUser.rows[0]);
    return newUser.rows[0];
}

/*function base64url(source) {
    console.log('base64url called');
    console.log(JSON.stringify(source));
    // Encode in classical base64
    //const encodedSource = CryptoJS.enc.Base64.stringify(source);
    const encodedSource = Buffer.from(JSON.stringify(source));
    console.log(encodedSource);
    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');
    console.log(encodedSource);
    return encodedSource;
}*/

