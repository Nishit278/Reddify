require("dotenv").config();
const Discord = require("discord.js");
const { getMemes, getNews, getPets } = require("./posts.js");
const { authSpotify, searchSpotify } = require("./spotify.js");
const { userInfo } = require("./leetcode.js");
const { covid } = require("./covid.js");
// const { contestList } = require("./codeforces.js");

const client = new Discord.Client({
  partials: ["CHANNEL", "MESSAGE"],
  restTimeOffset: 0,
  intents: 513,
});
const token = process.env.BOT_TOKEN;
// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const PREFIX = ".y";

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // const currMember = Guild.members.cache.get("UserID");

  if (message.content.startsWith(PREFIX)) {
    const [cmdName, ...args] = message.content
      .substring(PREFIX.length)
      .split(/\s+/);
    const cmd = args[0];
    const secondArg = args.slice(1).join(" ");
    // console.log(cmdName, args);
    if (cmd === "help") {
      let embed = new Discord.MessageEmbed()
        .setColor("#6D1FFF")
        .setTitle("Reddify bot's commands")
        .setThumbnail(
          "https://icons-for-free.com/iconfiles/png/512/reddit+website+icon-1320168605279647340.png"
        )
        .setTimestamp()
        .addFields(
          { name: "Prefix", value: ".r", inline: false },
          { name: "Reddit", value: "<Prefix> <Value>", inline: false },
          { name: "Values", value: "meme, news", inline: false },
          { name: "Image", value: "<Prefix><img><anything>", inline: false },
          {
            name: "Leetcode",
            value: "<Prefix><leetcode><username>",
            inline: false,
          },
          { name: "Music", value: "<Prefix> <Flag> <Value>", inline: false },
          { name: "Flags", value: "tr\nal\npl\nar", inline: true },
          {
            name: "Values",
            value: "Track\nAlbum\nPlaylist\nArtist",
            inline: true,
          },
          { name: "\u200B", value: "\u200B" }
        );

      // .setURL(song.external_urls.spotify)
      // .addField("Popularity: ", song.popularity.toString())
      // .addField("Genres: ", song.genres.join(", "))
      // .addField("Followers: ", song.followers.total.toString());
      message.channel.send({ embeds: [embed] });
    }
    if (cmd === "meme") {
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
    if (cmd === "news") {
      const random = Math.floor(Math.random() * 10);
      const post = await getNews(random);
      // console.log(post);
      message.channel.send(post.url);
      // const embed = new Discord.MessageEmbed()
      //   .setColor("#ff4500")
      //   .setTitle(post.title)
      //   .setURL("https://www.reddit.com" + post.permalink)
      //   .setThumbnail(post.thumbnail)
      //   .setTimestamp()
      //   .setFooter(`👍 ${post.ups} | 💬 ${post.num_comments}`);
      // // console.log(post);
      // message.channel.send({ embeds: [embed] });
      // message.channel.send(post.title, { files: [post.url] });
    }
    if (cmd === "img") {
      // console.log(secondArg);
      try {
        const random = Math.floor(Math.random() * 20);
        const post = await getPets(random, secondArg);

        const embed = new Discord.MessageEmbed()
          .setColor("#977fd7")
          .setTitle(`Uploaded by ${post.user}`)
          .setURL(post.pageURL)
          .setImage(post.webformatURL)
          .setTimestamp()
          .setFooter(`👍 ${post.likes} | 💬 ${post.comments}`);
        message.channel.send({ embeds: [embed] });
      } catch (err) {
        message.channel.send("Couldn't find any related images");
      }
    }
    if (cmd === "tr" || cmd === "ar" || cmd === "al" || cmd == "pl") {
      try {
        const auth = await authSpotify();
        const query = args.slice(1).join(" ");
        // console.log(query);
        const song = await searchSpotify(auth, cmd, query);
        if (cmd !== "ar" && cmd !== "pl") {
          const artist = [];
          song.artists.forEach((a) => artist.push(a.name));
          const artists = artist.slice(0).join(", ");
          // console.log(song);
          if (cmd === "al") {
            let embed = new Discord.MessageEmbed()
              .setColor("#1DB954")
              .setTitle(song.name)
              .setThumbnail(song.images[0].url)
              .setURL(song.external_urls.spotify)
              .addField("Artist(s)", artists);
            message.channel.send({ embeds: [embed] });
          } else {
            try {
              await message.channel.send(song.external_urls.spotify);
            } catch (err) {
              message.channel.send(err);
            }
          }
        } else if (cmd === "pl") {
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
          // console.log(song);
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
      } catch (error) {
        message.channel.send("Please check for typos and try again :)");
      }
    }

    if (cmd === "leetcode") {
      try {
        // console.log(secondArg);
        const data = await userInfo(secondArg);
        // console.log(data);
        // console.log(data.submitStats);
        let solved = [];
        data.submitStats.acSubmissionNum.map((s) => {
          solved.push(s.count);
        });
        // console.log(solved);
        let embed = new Discord.MessageEmbed()
          .setColor("#1DB954")
          .setTitle(data.profile.realName)
          .setThumbnail(data.profile.userAvatar)
          .setURL(`https://leetcode.com/${data.username}/`)
          .addFields(
            { name: "Username: ", value: data.username },
            { name: "Stars: ", value: data.profile.starRating.toString() }
          );
        if (data.profile.countryName) {
          embed.addField("Country: ", data.profile.countryName);
        }
        if (data.profile.skillTags.length > 0) {
          embed.addField(
            "Skills",
            (value = data.profile.skillTags?.join(", "))
          );
        }
        embed.addFields(
          { name: "Solved Questions", value: solved[0].toString() },
          { name: "Easy", value: solved[1].toString(), inline: true },
          { name: "Medium", value: solved[2].toString(), inline: true },
          { name: "Hard", value: solved[3]?.toString(), inline: true }
        );
        message.channel.send({ embeds: [embed] });
        // console.log(data);
      } catch (err) {
        console.log(err.message);
        message.channel.send("Please check for typos and try again :)");
      }
    }
    if (cmd === "covid") {
      try {
        const data = await covid(secondArg);
        // console.log(data);
        let embed = new Discord.MessageEmbed()
          .setColor("#1DB954")
          .setTitle("Covid-19")
          .setURL("https://www.worldometers.info/coronavirus/")
          .setThumbnail(data.countryInfo.flag)
          .addFields(
            { name: "Confirmed Cases", value: data.cases.toString() },
            { name: "Deaths", value: data.deaths.toString() },
            { name: "Recovered", value: data.recovered.toString() },
            { name: "Active", value: data.active.toString() }
          );
        message.channel.send({ embeds: [embed] });
      } catch (ex) {
        // console.log(secondArg)
        message.channel.send("Please check for typos and try again :)");
      }
    }
  }
});

client.on("ready", () => {
  console.log(`${client.user.tag} is ready`);
});
client.login(token);
