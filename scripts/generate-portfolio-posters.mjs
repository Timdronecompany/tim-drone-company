import fs from "fs";
import path from "path";
import vm from "vm";
import { execFileSync } from "child_process";

const root = process.cwd();
const appPath = path.join(root, "src", "App.jsx");
const postersDir = path.join(root, "public", "posters");
const frameDir = path.join(root, "public", "poster-frames");

const source = fs.readFileSync(appPath, "utf8");
const projectsMatch = source.match(/  const portfolioProjects = (\[[\s\S]*?\n  \]);/);

if (!projectsMatch) {
  throw new Error("Could not find portfolioProjects in src/App.jsx");
}

const projects = vm.runInNewContext(projectsMatch[1]);

fs.mkdirSync(postersDir, { recursive: true });
fs.mkdirSync(frameDir, { recursive: true });

const palettes = [
  ["#10131f", "#e7c873", "#3c6e71"],
  ["#16120f", "#d16f3a", "#f2d0a4"],
  ["#07130f", "#5bd8a5", "#d4f4dd"],
  ["#111827", "#60a5fa", "#f8fafc"],
  ["#190b17", "#e879f9", "#fbbf24"],
  ["#120f1f", "#a78bfa", "#67e8f9"],
  ["#121212", "#f43f5e", "#f5f5f4"],
  ["#0b1220", "#38bdf8", "#fb7185"],
];

function hashString(value) {
  let hash = 0;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 5);
}

function textLayout(title) {
  for (const maxChars of [15, 17, 19, 22, 26]) {
    const lines = wrapText(title, maxChars);
    const longest = Math.max(...lines.map((line) => line.length));
    const widthFont = Math.floor(760 / Math.max(longest * 0.58, 1));
    const heightFont = Math.floor(320 / Math.max(lines.length * 1.08, 1));
    const fontSize = Math.min(82, widthFont, heightFont);

    if (fontSize >= 48 || maxChars === 26) {
      return {
        lines,
        fontSize: Math.max(42, fontSize),
        startY: 818,
        lineHeight: Math.max(50, Math.max(42, fontSize) * 1.08),
      };
    }
  }
}

function videoThumbnailUrl(project) {
  const youtubeId = project.videoUrl.match(/[?&]v=([A-Za-z0-9_-]+)/)?.[1];
  const vimeoId = project.videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

  if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  if (vimeoId) return `https://vumbnail.com/${vimeoId}.jpg`;
  return "";
}

function localPosterSource(project) {
  if (project.title === "SUGA: RIDE OR DIE") {
    const posterPath = path.join(root, "public", "suga-ride-or-die-poster.jpg");
    if (fs.existsSync(posterPath)) {
      const base64 = fs.readFileSync(posterPath).toString("base64");
      return `data:image/jpeg;base64,${base64}`;
    }
  }

  return "";
}

function downloadFrame(project) {
  const localPoster = localPosterSource(project);
  if (localPoster) return localPoster;

  const url = videoThumbnailUrl(project);
  if (!url) return "";

  const filename = `${slugify(project.title)}.jpg`;
  const outputPath = path.join(frameDir, filename);

  try {
    execFileSync("curl", ["-L", "-s", "-f", "-o", outputPath, url], { stdio: "pipe" });
    const size = fs.statSync(outputPath).size;
    if (size < 1024) throw new Error(`Downloaded file is too small: ${size}`);
    const base64 = fs.readFileSync(outputPath).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    if (fs.existsSync(outputPath)) fs.rmSync(outputPath);
    console.warn(`Could not download frame for ${project.title}: ${error.message}`);
    return "";
  }
}

function posterSvg(project, framePath) {
  const hash = hashString(project.title);
  const [base, accent, soft] = palettes[hash % palettes.length];
  const layout = textLayout(project.title);
  const category = project.categories[0] || "Project";
  const motif = project.categories.includes("Tv-series")
    ? "SERIES"
    : project.categories.includes("Bioscoop films")
      ? "FILM"
      : project.categories.includes("Commercials")
        ? "TVC"
        : project.categories.includes("Events")
          ? "EVENT"
          : project.categories.includes("Fly-Through")
            ? "FPV"
            : "AERIAL";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1350" viewBox="0 0 900 1350" role="img" aria-label="${escapeXml(project.title)} poster">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${base}"/>
      <stop offset="0.58" stop-color="#050505"/>
      <stop offset="1" stop-color="${accent}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="34%" r="52%">
      <stop offset="0" stop-color="${soft}" stop-opacity="0.52"/>
      <stop offset="0.48" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M3 8h1v1H3zM17 29h1v1h-1zM34 13h1v1h-1zM49 41h1v1h-1zM61 23h1v1h-1zM8 57h1v1H8zM27 49h1v1h-1zM43 5h1v1h-1z" fill="#fff" opacity="0.14"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="26" stdDeviation="22" flood-color="#000" flood-opacity="0.38"/>
    </filter>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.08"/>
      <stop offset="0.46" stop-color="#000000" stop-opacity="0.12"/>
      <stop offset="0.72" stop-color="#000000" stop-opacity="0.72"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.96"/>
    </linearGradient>
  </defs>
  <rect width="900" height="1350" fill="url(#bg)"/>
  ${framePath ? `<image href="${framePath}" x="-750" y="0" width="2400" height="1350" preserveAspectRatio="xMidYMid slice" opacity="0.48"/>` : ""}
  <rect width="900" height="1350" fill="#000" opacity="0.34"/>
  <rect width="900" height="1350" fill="url(#glow)" opacity="0.9"/>
  <rect width="900" height="1350" fill="url(#grain)" opacity="0.42"/>
  ${framePath ? `<image href="${framePath}" x="-450" y="0" width="1800" height="1012" preserveAspectRatio="xMidYMid slice"/>` : ""}
  <rect width="900" height="1350" fill="url(#bg)" opacity="${framePath ? "0.12" : "1"}"/>
  <rect width="900" height="1350" fill="url(#fade)"/>
  <text x="450" y="108" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="9" fill="#ffffff" opacity="0.78">${motif}</text>
  <text x="450" y="154" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" letter-spacing="6" fill="${soft}" opacity="0.95">${escapeXml(category.toUpperCase())}</text>
  <g>
    ${layout.lines.map((line, i) => `<text x="450" y="${layout.startY + i * layout.lineHeight}" text-anchor="middle" font-family="Outfit, Inter, Arial, sans-serif" font-size="${layout.fontSize}" font-weight="800" letter-spacing="0" fill="#ffffff" filter="url(#softShadow)">${escapeXml(line.toUpperCase())}</text>`).join("\n    ")}
  </g>
  <text x="450" y="1158" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="7" fill="#ffffff" opacity="0.72">T.I.M. DRONE COMPANY</text>
  <text x="450" y="1210" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" letter-spacing="4" fill="${soft}" opacity="0.9">${escapeXml(project.categories.join("  /  ").toUpperCase())}</text>
</svg>
`;
}

// Generate homepage poster with black background and white text
function homepagePosterSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="T.I.M. Drone Company">
  <defs>
    <pattern id="grain" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M3 8h1v1H3zM17 29h1v1h-1zM34 13h1v1h-1zM49 41h1v1h-1zM61 23h1v1h-1zM8 57h1v1H8zM27 49h1v1h-1zM43 5h1v1h-1z" fill="#fff" opacity="0.08"/>
    </pattern>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#e7c873" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="#000000"/>
  <rect width="1200" height="630" fill="url(#grain)"/>
  
  <text x="600" y="280" text-anchor="middle" font-family="Outfit, Inter, Arial, sans-serif" font-size="96" font-weight="800" letter-spacing="4" fill="#ffffff" filter="url(#softShadow)">T.I.M.</text>
  <text x="600" y="380" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="48" font-weight="700" letter-spacing="6" fill="#e7c873" opacity="0.9">DRONE COMPANY</text>
  <text x="600" y="440" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" letter-spacing="3" fill="#ffffff" opacity="0.6">Cinematic Drone & FPV Filming</text>
</svg>
`;
}

const homepagePosterPath = path.join(root, "public", "og-poster.svg");
fs.writeFileSync(homepagePosterPath, homepagePosterSvg());

const updatedProjects = projects.map((project) => {
  const filename = `${slugify(project.title)}.svg`;
  const outputPath = path.join(postersDir, filename);
  const framePath = downloadFrame(project);
  fs.writeFileSync(outputPath, posterSvg(project, framePath));

  return {
    ...project,
    thumbnail: `/posters/${filename}`,
  };
});

const nextBlock = `  const portfolioProjects = ${JSON.stringify(updatedProjects, null, 4)
  .replace(/^/gm, "  ")
  .trimStart()};`;

const nextSource = source.replace(/  const portfolioProjects = \[[\s\S]*?\n  \];/, nextBlock);
fs.writeFileSync(appPath, nextSource);

console.log(`Generated ${updatedProjects.length - 1} poster thumbnails in public/posters`);
console.log(`Generated homepage OG poster`);
