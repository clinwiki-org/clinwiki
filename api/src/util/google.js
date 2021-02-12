import config from '../../config';
const {OAuth2Client} = require('google-auth-library');

export async function verifyToken(oAuthToken) {
    const client = new OAuth2Client(config.googleClientId);
    const ticket = await client.verifyIdToken({
        idToken: oAuthToken,
        audience: config.googleClientId,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload;
}