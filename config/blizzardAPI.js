const axios = require("axios");
const fs = require("fs");
const path = require("path");
const request = require("request");
const rp = require("request-promise-native");
require('axios-debug')(axios);

const credentials = {
    clientId: "b2273a87665e4a56831174ca9ab9b2ea",
    clientSecret: "BfsSmm1RYGblJ3dxB9vynG51ZPCH1eaz",
}

blizzardApi = {
    exampleRequest: "https://us.api.blizzard.com/wow/character/eredar/wäxeldk?locale=en_US&access_token=USJtZ608NppDbCz214pwBooQUthKkVdimD",
    // getNewToken: function () {
    //     const authUrl = "https://eu.battle.net/oauth/token";
    //     const data = {
    //         grant_type: "client_credentials",
    //         client_id: credentials.clientId,
    //         client_secret: credentials.clientSecret,
    //         scope: "public"
    //     }
    //     return axios.post(authUrl, Querystring.stringify(data));
    // },
    // TODO: cron job on the server needs to refresh the token and save it to the file!
    fetchCharacterData: function (characterName) {
        const relPath = "./token.json";
        filePath = path.join(__dirname, relPath);
        const tokenFile = fs.readFileSync(filePath);
        const tokenJson = JSON.parse(tokenFile.toString());
        const characterUrl = `https://eu.api.blizzard.com/wow/character/eredar/${characterName}?locale=en_US&access_token=${tokenJson.data.access_token}`
        console.log(`API sending request... [ ${characterUrl} ]`);
        var request = require("request");

        var options = {
            method: 'GET',
            url: 'https://eu.api.blizzard.com/wow/character/eredar/' + characterName,
            qs: {
                locale: 'en_US',
                access_token: 'USJtZ608NppDbCz214pwBooQUthKkVdimD'
            },
            headers: {
                'cache-control': 'no-cache',
                Authorization: 'Bearer USJtZ608NppDbCz214pwBooQUthKkVdimD'
            }
        };
        return rp(options);
    }
}

module.exports = blizzardApi;