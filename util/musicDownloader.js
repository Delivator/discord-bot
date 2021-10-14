const fs = require("fs");
const ytdlp = require("yt-dlp.js");
const crypto = require("crypto");
const log = require("../util/logFunction");

exports.downloadSong = (url) => {
  return new Promise(function (resolve, reject) {
    let fileName = crypto.createHash("md5").update(url).digest("hex"),
      ytdlpArgs,
      tempFilename = new Date().getTime();

    if (fs.existsSync(`./.cache/${fileName}`)) return resolve(fileName);

    ytdlpArgs = ["-o", `../.cache/${tempFilename}.%(ext)s`, "-x", "--restrict-filenames", "--audio-quality=96k", "--audio-format=opus"];
    tempFilename;

    log(`[yt-dlp] Downloading file "${url}" to ".cache/${fileName}"`);
    ytdlp(url, ytdlpArgs, { cwd: __dirname, maxBuffer: 1000 * 1024 })
      .then(() => {
        fs.readdir("./.cache/", (err, files) => {
          if (err) reject(err);
          files.find(file => {
            if (file.startsWith(tempFilename)) {
              fs.rename(`./.cache/${file}`, `./.cache/${fileName}`, err => {
                if (err) return log.error(err);
                let fileSize = fs.statSync(`./.cache/${fileName}`)["size"] / 1048576;
                log.good(`[yt-dlp] Download of "${fileName}" finished! Filesize: ${String(fileSize).substring(0, 4)} MiB`);
                resolve(fileName);
              });
            }
          });
        });
      })
      .catch(err => {
        log("[yt-dlp] Couldn't download file.");
        log.error(err);
        reject(err);
      });
  });
};