const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const settings = require("../config/settings.json");
const path = require("path");
const log = require("./logFunction");

module.exports = client => {
  app.use(express.static("public"));
  app.set("views", "views");
  app.set("view engine", "ejs");

  io.on("connection", socket => {
    log("Socket user connected!");
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

  app.get("/guilds/:id", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let guild = client.guilds.get(id);
      let members = {total: 0, online: 0, offline: 0};
      members.total = guild.memberCount;
      guild.members.forEach(member => {
        if (member.presence.status === "offline") members.offline++;
      });
      members.online = members.total - members.offline;
      res.render("pages/guilds", {
        name: client.user.tag,
        title: guild.name,
        logo: guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guild: guild,
        members: members,
        links: [{
          text: guild.name,
          url: "#"
        }]
      });
    } else {
      res.status(404).send("No guild found with ID " + id);
    }
  });

  app.get("/guilds/:id/members", (req, res) => {
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

  app.get("/guilds/:id/music", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let guild = client.guilds.get(id);
      res.render("pages/music", {
        name: client.user.tag,
        title: guild.name + " - Music",
        logo: guild.iconURL ? guild.iconURL : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guild: guild,
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
  
  app.listen(settings.webServerPort, () => {
    log.url("Webinterface online at http://localhost:" + settings.webServerPort);
  });
};
