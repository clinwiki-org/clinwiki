import bcrypt from 'bcrypt';
import { query } from '../util/db';
import logger from '../util/logger';
import * as GoogleAPI from '../util/google';
import jwt from 'jsonwebtoken';
import config from '../../config';

const QUERY_USER = 'select * from users where email=$1';
const QUERY_USER_ROLES =
    'select * from roles where id in (select role_id from users_roles where user_id=$1)';
const QUERY_USER_REVIEWS = 'select * from reviews where user_id=$1';
const QUERY_USER_WIKI_CONTRIBUTIONS =
    'select distinct wiki_page_id from wiki_page_edits where user_id=$1';
const QUERY_NEW_USER =
    'insert into users (email,encrypted_password,default_query_string,picture_url) values ($1,$2,$3,$4)';
const QUERY_USER_REACTIONS = 'select * from reactions where user_id=$1';
const QUERY_USER_REACTIONS_COUNT =
    'select rk.name, count(r.id) from reactions r inner join reaction_kinds rk on rk.id=r.reaction_kind_id where r.user_id=$1 group by rk.name';

const ROLE_SITE_OWNER = 'site_owner';
const ROLE_ADMIN = 'admin';

export async function authenticate(email, password, oAuthToken) {
    console.log('authenticate (signIn called');
    logger.info('Authenticate user ' + email);

    try {
        if (oAuthToken) {
            logger.info('Logging in with oAuthToken');
            const payload = await GoogleAPI.verifyToken(oAuthToken);

            const user = await getUserByEmail(payload.email);
            if (user) {
                logger.info('Found user ' + user.id);
                const token = await generateJWT(user);
                //console.log(token);
                return {
                    jwt: token,
                    user: user,
                };
            } else {
                // go ahead and create one.
            }
        } else {
            console.log('past oauth');
            const user = await getUserByEmail(email);
            if (user) {
                console.log('got user');
                logger.info('Found user ' + user.id);
                const isValid = await bcrypt.compare(
                    password,
                    user.encrypted_password
                );
                if (isValid) {
                    const token = await generateJWT(user);
                    return {
                        jwt: token,
                        user: user,
                    };
                }
            }
        }
    } catch (err) {
        logger.error(err);
    }
}

async function generateJWT(user) {
    logger.info('generateJWT called');
    //console.log(user);
    let userId = user.id;
    userId = userId.toString();
    const token = jwt.sign(
        {
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + config.jwtExpire,
            'https://hasura.io/jwt/claims': {
                'x-hasura-allowed-roles': [
                    'user',
                    'admin',
                    'anonymous',
                    'contributor',
                    'indexer',
                ],
                'x-hasura-default-role': 'admin', //TODO change to user.role,  once the Hasura permissions for new roles are configured
                'x-hasura-user-id': userId,
            },
        },
        config.jwtSecret,
        { algorithm: 'HS256' }
    );
    logger.info('TOKEN', token);
    return token;
}
async function findUserRole(roles) {
    //console.log("findUserRoles called");
    //console.log(roles);
    let role = 'user';
    //console.log(roles.includes('admin'));
    // if (roles.includes('admin')) {
    //     role = 'admin';
    // }
    console.log('ROLES', roles);
    if (roles.some(role => role.name == 'admin')) {
        logger.info('FILTERING HIT ADMIN', role.name);
        role = 'admin';
    }
    //console.log("role = ", role)
    return role;
}
export async function getUserByEmail(email) {
    logger.info('GETTING USERS BY EMAIL');
    //console.log("getUserByEmail called");
    const results = await query(QUERY_USER, [email]);
    //console.log("got user by email = ");
    //console.log(results !== null);
    if (results.rows.length === 1) {
        const user = results.rows[0];
        user.id = user.id;
        user.roles = await getUserRoles(user.id);
        user.reviews = await getUserReviews(user.id);
        user.role = await findUserRole(user.roles);
        user.reviewCount = user.reviews ? user.reviews.length : 0;
        user.reactions = await getUserReactions(user.id);
        user.reactionsCount = await getUserReactionsCount(user.id);
        const wikis = await getUserWikis(user.id);
        user.contributions = wikis ? wikis.length : 0;
        console.log('user = ', user);
        //console.log("user.roles = ", user.roles);
        console.log('user.role = ', user.role);
        if (user.roles.includes(ROLE_SITE_OWNER)) {
            logger.debug(
                'User is a site owner. Populate role dependent fields'
            );
        }
        return user;
    }
}
export async function getUserRoles(userId) {
    const roleResults = await query(QUERY_USER_ROLES, [userId]);
    console.log(roleResults);
    return roleResults.rows;
}

export async function getUserReviews(userId) {
    const reviewResults = await query(QUERY_USER_REVIEWS, [userId]);
    const list = reviewResults.rows.map(review => ({
        content: review.text,
        nctId: review.nct_id,
        briefTitle: 'ToDo: Migrate frontmatter parser for review content',
    }));
    return list;
}

export async function getUserReactions(userId) {
    const reactionResults = await query(QUERY_USER_REACTIONS, [userId]);
    if (reactionResults.row==null ){
        return []
    }
    return reactionResults.rows;
}

export async function getUserReactionsCount(userId) {
    const reactionsResults = await query(QUERY_USER_REACTIONS_COUNT, [userId]);
    return reactionsResults.rows;
}

export async function getUserWikis(userId) {
    const wikis = await query(QUERY_USER_WIKI_CONTRIBUTIONS, [userId]);
    return wikis.rows;
}

export async function signUp(email, password, defaultQueryString, oAuthToken) {
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
    //console.log("user.manager signUp called");
    //const exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400  need to figure out ENV
    let pictureUrl = null;
    let encryptedPassword = null;
    //console.log(`oAuthToken = ${oAuthToken}`);
    if (oAuthToken) {
        encryptedPassword = oAuthToken;
    } else {
        encryptedPassword = await bcrypt.hash(password, 10);
    }
    const exists = await query(QUERY_USER, [email]);
    if (exists.rows.length !== 0) {
        return { jwt: null, user: null, errors: ['Email already exists'] };
    }
    const user = await createNewUser(
        email,
        encryptedPassword,
        defaultQueryString,
        pictureUrl
    );
    const createdUser = await getUserByEmail(email);
    if (createdUser) {
        const jwt = await generateJWT(createdUser);
        if (jwt) {
            return {
                jwt: jwt,
                user: createdUser,
            };
        }
    } else {
    }
    return null;
}

async function createNewUser(email, password, defaultQueryString, pictureUrl) {
    //console.log("createNewUserCalled");
    //console.log(`email = ${email}, password = ${password}, defaultQueryString = ${defaultQueryString}, pictureUrl = ${pictureUrl}`);
    const user = await query(QUERY_NEW_USER, [
        email,
        password,
        defaultQueryString,
        pictureUrl,
    ]);
    //console.log(user);
    const newUser = await query(QUERY_USER, [email]);
    //console.log("(createNewUser) user created = ");
    //console.log(newUser.rows[0] !== null);
    return newUser.rows[0];
}
