const fs = require("fs");
const youtubedl = require("youtube-dl");
const crypto = require("crypto");

function downloadSong(url, callback) {
  let fileName = crypto.createHash("md5").update(url).digest("hex");
  // console.log(`Downloading file "${url}" to ../.cache/${fileName}`);
  if (fs.existsSync(`./.cache/${fileName}`)) return callback(fileName);
  let video = youtubedl(url, ["-x", "--format=bestaudio", "--audio-format=mp3"], { cwd: __dirname, maxBuffer: 1000*1024 });
  video.pipe(fs.createWriteStream(`./.cache/${fileName}`));
  video.on("end", function() {
    // console.log("Download finished! Saved to " + fileName);
    return callback(fileName);
  });
}

// downloadSong("https://www.youtube.com/watch?v=xAqUeY8i_0U", function(err) {
//   if (err) {
//     console.log(err);
//   }
//   console.log("callback finished!");
// });

exports.downloadSong = downloadSong;