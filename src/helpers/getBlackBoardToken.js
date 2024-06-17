const axios = require('axios');


const credentials = Buffer.from(`${process.env.BLACKBOARD_CLIENT_ID}:${process.env.BLACKBOARD_CLIENT_SECRET}`).toString('base64');
let headers = {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
};
const endpoint = `${process.env.BLACKBOARD_URL}v1/oauth2/token`;

const grant_type = 'client_credentials';


const getBlackBoardToken = async () => {
   try {
    const response = await axios.post(endpoint, {
        grant_type: grant_type
    }, { headers });
    const {  access_token } = response.data;
    global.blackboardToken = access_token;
   } catch (error) {
    console.log(error)
   }
};


module.exports = {getBlackBoardToken};