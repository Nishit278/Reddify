require("dotenv").config();
const Discord = require("discord.js");
const { getMemes, getNews, getCats } = require("./posts.js");
const { authSpotify, searchSpotify } = require("./spotify.js");
const client = new Discord.Client({
  partials: ["CHANNEL", "MESSAGE"],
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
    if (args[0] === "help") {
      let embed = new Discord.MessageEmbed()
        .setColor("#6D1FFF")
        .setTitle("Redify bot's commands")
        .setThumbnail(
          "https://icons-for-free.com/iconfiles/png/512/reddit+website+icon-1320168605279647340.png"
      )
        .setTimestamp()
        .addFields(
          { name: "Prefix", value: "!r", inline: false },
          { name: "Reddit", value: "<Prefix> <Value>", inline: false },
          { name: "Values", value: "meme\nnews\ncats", inline: false },
          { name: "Music", value: "<Prefix> <Flag> <Value>", inline: false },
          { name: "Flags", value: "tr\nal\npl\nar", inline: true },
          {
            name: "Values",
            value: "Track\nAlbum\nPlaylist\nArtist",
            inline: true,
          },
          {name: "\u200B", value: "\u200B"}
        );

      // .setURL(song.external_urls.spotify)
      // .addField("Popularity: ", song.popularity.toString())
      // .addField("Genres: ", song.genres.join(", "))
      // .addField("Followers: ", song.followers.total.toString());
      message.channel.send({ embeds: [embed] });
    }
    if (args[0] === "meme") {
      const random = Math.floor(Math.random() * 20);
      const post = await getMemes(random);
      // console.log(post.title)
      const embed = new Discord.MessageEmbed()
        .setColor("#ff4500")
        .setTitle(post.title)
        .setURL("https://www.reddit.com" + post.permalink)
        .setImage(post.url)
        .setTimestamp()
        .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
      // console.log(post);
      message.channel.send({ embeds: [embed] });
    }
    if (args[0] === "news") {
      const random = Math.floor(Math.random() * 20);
      const post = await getNews(random);
      // console.log(post.title)
      const embed = new Discord.MessageEmbed()
        .setColor("#ff4500")
        .setTitle(post.title)
        .setURL("https://www.reddit.com" + post.permalink)
        .setThumbnail(post.thumbnail)
        .setTimestamp()
        .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
      // console.log(post);
      message.channel.send({ embeds: [embed] });
      // message.channel.send(post.title, { files: [post.url] });
    }
    if (args[0] === "cats") {
      const random = Math.floor(Math.random() * 20);
      const post = await getCats(random);
      // console.log(post);
      if (post.is_video || post.post_hint) {
        const embed = new Discord.MessageEmbed()
          .setColor("#ff4500")
          .setTitle(post.title)
          .setURL("https://www.reddit.com" + post.permalink)
          .setThumbnail(post.thumbnail)
          .setTimestamp()
          .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
        message.channel.send({ embeds: [embed] });
      } else {
        const embed = new Discord.MessageEmbed()
          .setTitle(post.title)
          .setURL("https://www.reddit.com" + post.permalink)
          .setImage(post.url)
          .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
        message.channel.send({ embeds: [embed] });
      }
    }
    if (
      args[0] === "tr" ||
      args[0] === "ar" ||
      args[0] === "al" ||
      args[0] == "pl"
    ) {
      const auth = await authSpotify();
      const query = args.slice(1).join(" ");
      // console.log(query);
      const song = await searchSpotify(auth, args[0], query);

      if (args[0] !== "ar" && args[0] !== "pl") {
        const artist = [];
        song.artists.forEach((a) => artist.push(a.name));
        const artists = artist.slice(0).join(", ");
        // console.log(song);
        if (args[0] === "al") {
          let embed = new Discord.MessageEmbed()
            .setColor("#1DB954")
            .setTitle(song.name)
            .setThumbnail(song.images[0].url)
            .setURL(song.external_urls.spotify)
            .addField("Artist(s)", artists);
          message.channel.send({ embeds: [embed] });
        } else {
          let embed = new Discord.MessageEmbed()
            .setColor("#1DB954")
            .setTitle(song.name)
            .setThumbnail(song.album.images[0].url)
            .setURL(song.external_urls.spotify)
            .addField("Artist(s)", artists);
          message.channel.send({ embeds: [embed] });
        }
      } else if (args[0] === "pl") {
        // console.log(song);
        let embed = new Discord.MessageEmbed()
          .setColor("#1DB954")
          .setTitle(song.name)
          .setDescription(song.description)
          .setThumbnail(song.images[0].url)
          .setURL(song.external_urls.spotify)
          .addField("songs", song.tracks.total.toString())
          .addField("Owner", song.owner.display_name);
        message.channel.send({ embeds: [embed] });
      } else {
        console.log(song);
        let embed = new Discord.MessageEmbed()
          .setColor("#1DB954")
          .setTitle(song.name)
          .setThumbnail(song.images[0].url)
          .setURL(song.external_urls.spotify)
          .addField("Popularity: ", song.popularity.toString())
          .addField("Genres: ", song.genres.join(", "))
          .addField("Followers: ", song.followers.total.toString());
        message.channel.send({ embeds: [embed] });
      }
    }
  }
});

client.on("ready", () => {
  console.log(`${client.user.tag} is ready`);
});
client.login(token);
