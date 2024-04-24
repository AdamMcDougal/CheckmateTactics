// npm install express cors axios
// npm install nodemon 
var express = require('express')
var cors = require('cors')
const axios = require('axios')

var app = express();

app.use(cors());

const API_KEY = "RGAPI-685db07e-46e2-4371-bffe-5be6db6ac05d";

function getPlayerPUUID(playerName) {
    return axios.get("https://americas.api.riotgames.com" + "/riot/account/v1/accounts/by-riot-id/" + playerName + "/NA1" + "?api_key=" + API_KEY)
        .then(response => {
            console.log(response.data);
            return response.data.puuid;
        }).catch(err => err);
}

// GET past5Games
// GET localhost:4000/past5Games
app.get('/past5Games', async (req, res) => {
    const playerName = req.query.username;
    // PUUID
    const PUUID = await getPlayerPUUID(playerName);
    const API_CALL = "https://americas.api.riotgames.com" + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY;
console.log("========================================================", PUUID);
    // get API_CALL
    // Gives us a list of game IDs 
    const gameIDs = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

    // A list of game ID strings
    console.log(gameIDs);

    // loop through game IDs
    // at each loop, get the information based off ID (API CALL)
    var matchDataArray = [];
    for(var i = 0; i < gameIDs.length - 15; i++) {
        const matchID = gameIDs[i];
        const matchData = await axios.get("https://americas.api.riotgames.com/" + "lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
            .then(response => response.data)
            .catch(err => err)
        matchDataArray.push(matchData);
    }


    // save information above in an array, give array as a JSON response to user
    // [game1, game2, game3, game4, game5]
    res.json(matchDataArray);
});

app.listen(4000, function () { // May need to change this 
    console.log('Server started or reloaded port 4000')
});

