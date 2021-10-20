const axios = require("axios");
require("dotenv").config();
const pixabayKey = process.env.PIXABAY_API;

const getMemes = async (num) => {
  const subreddits = ["memes", "wholesomememes", "dankmemes"];
  const x = Math.floor(Math.random() * subreddits.length);
  const post = await axios.get(
    `https://www.reddit.com/r/${subreddits[x]}/hot.json`
  );
  // console.log(post);
  const postArray = post.data.data.children;
  return postArray[num + 1].data;
};
const getNews = async (num) => {
  const subreddits = ["technology", "tech", "worldnews", "engineering"];
  const x = Math.floor(Math.random() * subreddits.length);
  const post = await axios.get(
    `https://www.reddit.com/r/${subreddits[x]}/hot.json`
  );
  const postArray = post.data.data.children;
  // console.log(postArray[num+1]);
  return postArray[num + 2].data;
};
const getPets = async (num, search) => {
  const post = await axios.get(
    `https://pixabay.com/api/?key=${pixabayKey}&q=${search}&image_type=photo&pretty=true`
  );
    return post.data.hits[num];
};

module.exports = { getMemes, getNews, getPets };
