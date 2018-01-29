const fs = require("fs");
// const youtubedl = require("youtube-dl");
const ytdl = require("youtube-dl.js");
const crypto = require("crypto");
const log = require("../util/logFunction").log;

exports.downloadSong = (url, isYT) => {
  return new Promise(function(resolve, reject) {
    let fileName = crypto.createHash("md5").update(url).digest("hex"),
        ytdlArgs,
        tempFilename = new Date().getTime();

    if (fs.existsSync(`./.cache/${fileName}`)) return resolve(fileName);
    if (isYT) {
      ytdlArgs = ["-o", `../.cache/${tempFilename}.%(ext)s`, "-x", "--audio-format=mp3", "--restrict-filenames", "--external-downloader=ffmpeg", "--audio-quality=96k"];
    } else {
      ytdlArgs = ["-o", `../.cache/${tempFilename}.%(ext)s`, "-x", "--audio-format=mp3", "--restrict-filenames", "--external-downloader=ffmpeg", "--audio-quality=96k"]
    }

    log(`[YTDL] Downloading file "${url}" to ".cache/${fileName}"`);
    ytdl(url, ytdlArgs, { cwd: __dirname, maxBuffer: 1000 * 1024 })
      .then(data => {
        fs.rename(`./.cache/${tempFilename}.mp3`, `./.cache/${fileName}`, err => {
          if (err) return log(err);
          let fileSize = fs.statSync(`./.cache/${fileName}`)["size"] / 1048576;
          log(`[YTDL] Download of "${fileName}" finished! Filesize: ${String(fileSize).substring(0, 4)} MiB`);
          resolve(fileName);
        });
      })
      .catch(err => {
        log("[YTDL] Couldn't download file.");
        log(err);
        reject(err);
      });
  });
};