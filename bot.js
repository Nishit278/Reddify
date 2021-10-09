require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client({
    partials: ['CHANNEL', "MESSAGE"],
    restTimeOffset: 0,
    intents: 513,
});
const token = process.env.BOT_TOKEN;
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const PREFIX = "r";

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
      const [cmdName, ...args] = message.content
        .substring(PREFIX.length)
        .split(/\s+/);
      if(cmdName === "ping"){
        
            const random = Math.floor(Math.random() * 31);
            const post = await getMemes(random);
            // console.log(post.title)
            const exampleEmbed = new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL("https://www.reddit.com" + post.permalink)
            .setImage(post.url)
            .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
            console.log(post);
            message.channel.send({embeds: [exampleEmbed]});
            // message.channel.send(post.title, { files: [post.url] });
          
      }
    }
  });

const getMemes = async (num)=>{
    const post = await axios.get("https://www.reddit.com/r/wholesomememes/top.json?limit=30");
    // const data = await post.json();
    // const postArray = post.data.children;
    // return postArray[num].data;
    const postArray = post.data.data.children;
    return postArray[num].data;

}


client.on("ready", () => {
    console.log("Client ready");
})
client.login(token);