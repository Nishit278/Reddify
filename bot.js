require("dotenv").config();
const Discord = require("discord.js");
const {getMemes, getNews, getCats} = require("./posts.js")
const client = new Discord.Client({
    partials: ['CHANNEL', "MESSAGE"],
    restTimeOffset: 0,
    intents: 513,
});
const token = process.env.BOT_TOKEN;
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const PREFIX = "!r";

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
      const [cmdName, ...args] = message.content
        .substring(PREFIX.length)
        .split(/\s+/);
        // console.log(cmdName, args);
      if(args[0] === "meme"){
        
            const random = Math.floor(Math.random() * 30);
            const post = await getMemes(random);
            // console.log(post.title)
            const embed = new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL("https://www.reddit.com" + post.permalink)
            .setImage(post.url)
            .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
            // console.log(post);
            message.channel.send({embeds: [embed]});
          
          
      }
      if(args[0] === "news"){
        
        const random = Math.floor(Math.random() * 30);
        const post = await getNews(random);
        // console.log(post.title)
        const embed = new Discord.MessageEmbed()
        .setTitle(post.title)
        .setURL("https://www.reddit.com" + post.permalink)
        .setThumbnail(post.thumbnail)
        .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
        // console.log(post);
        message.channel.send({embeds: [embed]});
        // message.channel.send(post.title, { files: [post.url] });
    }
    if(args[0] === "cats"){
        
        const random = Math.floor(Math.random() * 30);
        const post = await getCats(random);
        console.log(post)
        if(post.is_video || post.post_hint){
            const embed = new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL("https://www.reddit.com" + post.permalink)
            .setThumbnail(post.thumbnail)
            .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
        message.channel.send({embeds: [embed]});

        } else {
            const embed = new Discord.MessageEmbed()
            .setTitle(post.title)
            .setURL("https://www.reddit.com" + post.permalink)
            .setImage(post.url)
            .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
        message.channel.send({embeds: [embed]});

        }
    
        // console.log(post);
        // message.channel.send(post.title, { files: [post.url] });
      
  }
    }
  });




client.on("ready", () => {
    console.log("Client ready");
})
client.login(token);