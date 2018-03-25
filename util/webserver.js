const express = require("express");
const settings = require("../config/settings.json");
const path = require("path");
const log = require("./logFunction").log;

module.exports = client => {
  const app = express();

  app.use(express.static("public"));
  app.set("views", "views");
  app.set("view engine", "ejs");
  
  app.get("/", (req, res) => {
    res.render("pages/index", {
      name: client.user.tag,
      title: client.user.tag,
      guilds: client.guilds
    });
  });

  app.get("/guilds/:id", (req, res) => {
    let id = req.params.id;
    if (client.guilds.has(id)) {
      let guild = client.guilds.get(id);
      res.render("pages/guilds", {
        name: client.user.tag,
        title: guild.name,
        guild: guild
      });
    } else {
      res.status(400).send("No guild found with ID " + id);
    }
  });
  
  app.listen(settings.webServerPort, () => {
    log("Webinterface online at http://localhost:" + settings.webServerPort);
  });
};
