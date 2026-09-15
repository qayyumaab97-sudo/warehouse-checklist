/* Minimal static server for the warehouse checklist.
   No dependencies on purpose - nothing to install, nothing to break on deploy.
   Railway (and most hosts) set PORT; we must bind 0.0.0.0, not localhost. */

const http = require("http");
const fs   = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PAGE = path.join(__dirname, "index.html");

http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("ok");
  }

  fs.readFile(PAGE, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("index.html not found next to server.js");
    }
    /* Inject the Supabase credentials at serve time from environment variables,
       so they live in the host's dashboard and never in this repository.
       If the env vars are absent, whatever is written in index.html is used as-is. */
    let html = data.toString("utf8");
    if (process.env.SUPABASE_URL) {
      html = html.replace('"https://YOUR-PROJECT.supabase.co"', JSON.stringify(process.env.SUPABASE_URL));
    }
    if (process.env.SUPABASE_KEY) {
      html = html.replace('"YOUR-ANON-KEY"', JSON.stringify(process.env.SUPABASE_KEY));
    }

    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache"
    });
    res.end(html);
  });
}).listen(PORT, "0.0.0.0", () => {
  console.log("Checklist running on port " + PORT);
});
