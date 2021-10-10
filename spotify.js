const SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");
require("dotenv").config();
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const btoa = require("btoa");
const basic = btoa(`${clientId}:${clientSecret}`);

const client = new SpotifyWebApi();

const authSpotify = async () => {
  const auth = await axios("https://accounts.spotify.com/api/token", {
    params: {
      grant_type: "client_credentials",
    },
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
    },
  });
  // console.log(auth.data);
  return auth;
};
const searchSpotify = async (auth, type, query) => {
  switch (type) {
    case "tr":
      type = "track";
      break;
    case "al":
      type = "album";
      break;
    case "ar":
      type = "artist";
      break;
    case "pl":
      type = "playlist";
      break;
    default:
      break;
  }
  let search = await axios(`https://api.spotify.com/v1/search/`, {
    method: "GET",
    headers: {
      Authorization: `${auth.data.token_type} ${auth.data.access_token}`,
    },
    params: {
      q: query,
      type: type,
    },
  });
  search = search.data[type + "s"].items[0];
  return search;
  // console.log(search);
};

// const temp = async ()=>{
//     const auth = await authSpotify();
//     // console.log(auth.data);
//     searchSpotify(auth, "tr", "21 guns")
// }
// temp();
module.exports = { authSpotify, searchSpotify };
