const fs = require("fs");
const youtubedl = require("youtube-dl");
const crypto = require("crypto");
const log = require("../util/logFunction").log;

function downloadSong(url, callback) {
  let fileName = crypto.createHash("md5").update(url).digest("hex");
  if (fs.existsSync(`./.cache/${fileName}`)) return callback(fileName);
  let video = youtubedl(url, ["-x", "--format=bestaudio", "--audio-format=mp3"], { cwd: __dirname, maxBuffer: 1000*1024 });
  video.pipe(fs.createWriteStream(`./.cache/${fileName}`));
  log(`[YTDL] Downloading file "${url}" to ".cache/${fileName}"`);
  video.on("end", function() {
    let fileSize = fs.statSync(`./.cache/${fileName}`)["size"] / 1048576;
    log(`[YTDL] Download of "${fileName}" finished! Filesize: ${String(fileSize).substring(0, 3)} MiB`);
    return callback(fileName);
  });
}

exports.downloadSong = downloadSong;