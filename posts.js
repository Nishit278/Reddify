const axios = require("axios");

const getMemes = async (num)=>{
    const subreddits = ["memes", "wholesomememes", "ComedyCemetery", "nobodyasked", "suicidebywords"];
    const x = Math.floor(Math.random()*subreddits.length);
    const post = await axios.get(`https://www.reddit.com/r/${subreddits[x]}/hot.json`);
    // console.log(post);
    const postArray = post.data.data.children;
    return postArray[num].data;

}
const getNews = async (num)=>{
    const subreddits = ["technology", "tech", "worldnews", "news"];
    const x = Math.floor(Math.random()*subreddits.length);
    const post = await axios.get(`https://www.reddit.com/r/${subreddits[x]}/new.json`);
    const postArray = post.data.data.children;
    return postArray[num].data;

}
const getCats = async (num)=>{
    const subreddits = ["cat", "furry", "catreactiongifs", "Kitten"];
    const x = Math.floor(Math.random()*subreddits.length);
    const post = await axios.get(`https://www.reddit.com/r/${subreddits[x]}/hot.json`);
    const postArray = post.data.data.children;
    return postArray[num].data;

}

module.exports = {getMemes, getNews, getCats};