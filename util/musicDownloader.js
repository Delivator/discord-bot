const fs = require("fs");
const youtubedl = require("youtube-dl");
const crypto = require("crypto");
const log = require("../util/logFunction").log;

exports.downloadSong = (url, isYT) => {
  return new Promise(function(resolve, reject) {
    let video;
    let fileName = crypto.createHash("md5").update(url).digest("hex");
    if (fs.existsSync(`./.cache/${fileName}`)) return resolve(fileName);
    if (isYT) {
      video = youtubedl(url, ["-x", "--format=bestaudio", "--restrict-filenames", "--audio-format=mp3"], { cwd: __dirname, maxBuffer: 1000*1024 });
    } else {
      video = youtubedl(url, ["-x", "--audio-format=mp3", "--restrict-filenames"], { cwd: __dirname, maxBuffer: 1000*1024 });
    }
    video.pipe(fs.createWriteStream(`./.cache/${fileName}`));
    log(`[YTDL] Downloading file "${url}" to ".cache/${fileName}"`);
    video.on("end", function() {
      let fileSize = fs.statSync(`./.cache/${fileName}`)["size"] / 1048576;
      log(`[YTDL] Download of "${fileName}" finished! Filesize: ${String(fileSize).substring(0, 4)} MiB`);
      resolve(fileName);
    });
    video.on("error", function(err) {
      log("[YTDL] Couldn't download file. Deleting empty file.");
      let newFileName = `del_${new Date().getTime()}`;
      fs.renameSync(`./.cache/${fileName}`, `./.cache/${newFileName}`);
      fs.unlinkSync(`./.cache/${newFileName}`);
      reject(err);
    });
  });
};