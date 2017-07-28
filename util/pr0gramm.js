const log = require("../util/logFunction").log;
const got = require("got");

const base = "http://pr0gramm.com/api";

function buildUrl(mediaUrl) {
  let fileExt = mediaUrl.split(".")[mediaUrl.split(".").length - 1];
  const imageExt = ["jpg", "jpeg", "png", "gif"];
  const videoExt = ["mp4", "webm"];
  if (imageExt.includes(fileExt)) {
    return "http://img.pr0gramm.com/" + mediaUrl;
  } else if (videoExt.includes(fileExt)) {
    return "http://vid.pr0gramm.com/" + mediaUrl;
  } else {
    return "Invalid file extension.";
  }
}

function getItems(tags, filter, sort, callback) {
  let flags, promoted;
  switch (filter) {
    case "sfw":
      flags = "0";
    break;
    case "nsfw":
      flags = "2";
    break;
    case "nsfl":
      flags = "4";
    break;
    default:
      flags = "2";
  }
  switch (sort) {
    case "new":
      promoted = "0";
      break;
    case "best":
      promoted = "1";
      break;
    default:
      promoted = "1";
  }
  let url = `${base}/items/get?flags=${flags}&promoted=${promoted}&tags=${tags.join("+")}`;
  got(url)
    .then(response => {
      let jsonObject = JSON.parse(response.body);
      callback(jsonObject);
    })
    .catch(error => {
      log(error);
    });
};

function getPostInfo(postID, callback) {
  let postInfo = {};
  let url = `${base}/items/get?flags=15&id=${postID}`;
  got(url)
    .then(response => {
      let jsonObject = JSON.parse(response.body);
      let post = jsonObject.items[0];
      postInfo.id = post.id;
      postInfo.up = post.up;
      postInfo.down = post.down;
      postInfo.created = post.created;
      postInfo.thumb = "http://thumb.pr0gramm.com/" + post.thumb;
      postInfo.mediaUrl = buildUrl(post.image);
      postInfo.user = post.user;

      if (post.fullsize !== "") {
        postInfo.full = "http://full.pr0gramm.com/" + post.fullsize;
      }

      let url = `${base}/items/info?itemId=${postID}`;
      got(url)
        .then(response => {
          let jsonObject = JSON.parse(response.body);
          postInfo.comments = jsonObject.comments;
          postInfo.tags = jsonObject.tags;
          postInfo.tags.sort(function (a, b) {
            return b.confidence - a.confidence;
          });
          postInfo.topTags = "";

          if (postInfo.tags.length < 4) {
            for (var i = 0; i < postInfo.tags.length; i++) {
              postInfo.topTags += "#" + postInfo.tags[i].tag + " ";
            }
          } else {
            for (var i = 0; i < 3; i++) {
              postInfo.topTags += "#" + postInfo.tags[i].tag + " ";
            }
          }

          callback(postInfo);
        })
        .catch(error => {
          log(error);
        });
    })
    .catch(error => {
      log(error);
    });
};

exports.getItems = getItems;
exports.getPostInfo = getPostInfo;
