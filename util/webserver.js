const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const settings = require("../config/settings.json");
const log = require("./logFunction");
const btoa = require("btoa");
const got = require("got");
const musicPlayer = require("./musicPlayer");
const redirect = encodeURIComponent(`http://${settings.hostname}/api/discord/callback`);

function mapQueue(queue) {
  return queue.map((song) => {
    return {
      url: song.url,
      title: song.title,
      requester: song.requester
    };
  });
}

function updateQueue(guildID) {
  const server = musicPlayer.servers[guildID];
  let queue = [];
  if (server && server.queue[0]) queue = server.queue;
  io.to(guildID).emit("queue", mapQueue(queue));
}

function run(client) {
  app.use(express.static("public"));
  app.set("views", "views");
  app.set("view engine", "ejs");

  io.on("connection", (socket) => {
    const guildID = socket.handshake.query.guildID;
    if (guildID && client.guilds.has(guildID)) {
      socket.join(guildID, () => {
        updateQueue(guildID);
      });
    }
  });
  io.on("error", (error) => {
    log.error(error);
  });

  app.get("/", (req, res) => {
    res.render("pages/index", {
      name: client.user.tag,
      title: client.user.tag,
      logo: client.user.displayAvatarURL,
      guilds: client.guilds,
      links: []
    });
  });

  app.get("/guild/:id", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let queue = [];
      if (musicPlayer.servers[id] && musicPlayer.servers[id].queue[0]) queue = musicPlayer.servers[id].queue;
      let guild = client.guilds.get(id);
      let members = { total: 0, online: 0, offline: 0 };
      members.total = guild.memberCount;
      guild.members.forEach(member => {
        if (member.presence.status === "offline") members.offline++;
      });
      members.online = members.total - members.offline;
      res.render("pages/guild", {
        name: client.user.tag,
        title: guild.name,
        logo: guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guild: guild,
        members: members,
        queue: queue,
        links: [{
          text: guild.name,
          url: "#"
        }]
      });
    } else {
      res.status(404).send("No guild found with ID " + id);
    }
  });

  app.get("/guild/:id/members", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let guild = client.guilds.get(id);
      res.render("pages/members", {
        name: client.user.tag,
        title: guild.name + " - Members",
        logo: guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guild: guild,
        links: [{
          text: guild.name,
          url: "../"
        }, {
          text: "Members",
          url: "#"
        }]
      });
    } else {
      res.status(404).send("No guild found with ID " + id);
    }
  });

  app.get("/guild/:id/music", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let queue = [];
      if (musicPlayer.servers[id] && musicPlayer.servers[id].queue[0]) queue = musicPlayer.servers[id].queue;
      let guild = client.guilds.get(id);
      res.render("pages/music", {
        name: client.user.tag,
        title: guild.name + " - Music",
        logo: guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guildID: guild.id,
        queue: queue,
        links: [{
          text: guild.name,
          url: "../"
        }, {
          text: "Music",
          url: "#"
        }]
      });
    } else {
      res.status(404).send("No guild found with ID " + id);
    }
  });

  app.get("/api/discord/login", (req, res) => {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?response_type=code&client_id=${client.user.id}&scope=identify%20guilds&redirect_uri=${redirect}`);
  });

  app.get("/api/discord/callback", (req, res) => {
    if (!req.query.code) return res.status(400).send({ error: "No code provided" });
    const code = req.query.code;
    const creds = btoa(`${client.user.id}:${settings.clientSecret}`);
    got.post(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`, { headers: { "Authorization": `Basic ${creds}` } })
      .then(response => {
        let json = JSON.parse(response.body);
        res.cookie("token", json.access_token);
        res.redirect("/");
      })
      .catch(err => {
        res.status(500).send({ error: "Internal Server Error" });
        return log.error(err);
      });
  });

  http.listen(settings.webServerPort, () => {
    log.url("Webinterface online at http://localhost:" + settings.webServerPort);
  });
}

exports.run = (client) => run(client);
exports.updateQueue = (guildID) => updateQueue(guildID);