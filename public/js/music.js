function getCookie(cookie) {
  let name = cookie + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i];
    if (c.startsWith(name)) return c.substring(name.length, c.length);
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  const socket = io({
    query: {
      guildID
    }
  });
  const app = new Vue({
    el: "#app",
    data: {
      queue: []
    }
  });

  // socket.io events
  socket.on("error", (error) => console.error(error));
  socket.on("queue", (msg) => app.queue = msg);
});