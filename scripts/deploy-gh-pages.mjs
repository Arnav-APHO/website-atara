/**
 * Post-build script for GitHub Pages deployment.
 * Reads the built asset files, generates index.html + 404.html,
 * and deploys to the gh-pages branch.
 */
import { readdirSync, writeFileSync, copyFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, ".output", "public");
const assetsDir = join(publicDir, "assets");

if (!existsSync(assetsDir)) {
  console.error("Build output not found. Run 'npm run build' first.");
  process.exit(1);
}

// Find the actual hashed filenames
const files = readdirSync(assetsDir);
const entryJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));
const styles = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!entryJs) {
  console.error("Could not find index-*.js entry in assets.");
  process.exit(1);
}

const base = process.env.VERCEL ? "/" : "/atara-website/";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Atara — Inspire With Impact</title>
  <meta name="description" content="Atara is a student-led social impact initiative from Fountainhead Wockhardt Global School, turning creativity into community action for education, animal welfare, healthcare and the environment." />
  <meta name="author" content="Atara — Fountainhead Wockhardt Global School. Website designed, developed & maintained by Arnav Pardeshi." />
  <meta name="theme-color" content="#04615A" />
  <meta property="og:title" content="Atara — Inspire With Impact" />
  <meta property="og:description" content="A student-led social impact initiative turning creativity into community action." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@atara.fwgs" />
  <link rel="icon" href="${base}atara-logo.png" type="image/png" />
  <link rel="sitemap" type="application/xml" href="${base}sitemap.xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter+Tight:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${base}assets/${styles}" />
  <script type="module" crossorigin src="${base}assets/${entryJs}"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`;

// Write index.html
writeFileSync(join(publicDir, "index.html"), html, "utf-8");
console.log("✅ Generated index.html");

// Copy to 404.html for SPA routing on GitHub Pages
copyFileSync(join(publicDir, "index.html"), join(publicDir, "404.html"));
console.log("✅ Generated 404.html");

// Done
console.log("\nReady to deploy. Run: npx gh-pages -d .output/public");
