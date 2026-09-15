/* Build step: read .env, write dist/index.html with the credentials baked in.
   The browser cannot read .env, so the values must be substituted before deploy.
   Zero dependencies - runs on any Node. */

const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const out = {};
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    out[m[1]] = v;
  }
  return out;
}

const env = Object.assign({}, loadEnv(path.join(__dirname, ".env")), process.env);
const URL = env.SUPABASE_URL;
const KEY = env.SUPABASE_KEY;

if (!URL || !KEY) {
  console.error("\n  Missing SUPABASE_URL or SUPABASE_KEY.");
  console.error("  Copy .env.example to .env and fill both in.\n");
  process.exit(1);
}

/* Guard: refuse the service_role key. It bypasses every row-level policy,
   and this file ends up in a browser where anyone can read it. */
if (KEY.split(".").length === 3) {
  try {
    const role = JSON.parse(Buffer.from(KEY.split(".")[1], "base64").toString("utf8")).role;
    if (role === "service_role") {
      console.error("\n  STOP - that is the service_role key.");
      console.error("  It bypasses all access rules and would be public in the browser.");
      console.error("  Use the 'anon / public' key instead.\n");
      process.exit(1);
    }
    if (role && role !== "anon") console.warn("  Note: key role is '" + role + "', expected 'anon'.");
  } catch (e) { /* not a JWT - newer sb_publishable_ keys are fine */ }
}
if (/^sb_secret_/.test(KEY)) {
  console.error("\n  STOP - that is a secret key. Use the publishable / anon key.\n");
  process.exit(1);
}

let html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const before = html;
html = html.replace('"https://YOUR-PROJECT.supabase.co"', JSON.stringify(URL))
           .replace('"YOUR-ANON-KEY"', JSON.stringify(KEY));

if (html === before) {
  console.error("\n  Placeholders not found in index.html - was it already edited by hand?\n");
  process.exit(1);
}

fs.mkdirSync(path.join(__dirname, "dist"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "dist", "index.html"), html);

console.log("\n  Built dist/index.html");
console.log("  Supabase: " + URL);
console.log("  Deploy the dist/ folder.\n");
