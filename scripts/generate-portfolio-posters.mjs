import fs from "fs";
import path from "path";
import vm from "vm";
import { execFileSync } from "child_process";

const root = process.cwd();
const appPath = path.join(root, "src", "App.jsx");
const postersDir = path.join(root, "public", "posters");
const frameDir = path.join(root, "public", "poster-frames");
const posterWidth = 3840;
const posterHeight = 2160;

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

const portfolioFrameSources = {
  "BOSS x AMF1 x Apple Vision Pro": "https://dronedepartment.nl/images/portfolio/boss-amf1-visionpro-grid.webp",
  "Fly-Through logistics center Enexis": "https://dronedepartment.nl/images/portfolio/enexis-flythrough.webp",
  "CS Short: The Citroën Méhari": "https://dronedepartment.nl/images/portfolio/CS-Short-The-Citroen-Mehari-YouTube-400x300.webp",
  "Liander logistics location Fly-Through": "https://dronedepartment.nl/images/portfolio/liander-fly-through.webp",
  "Welcome to the club": "https://dronedepartment.nl/images/portfolio/welcome-to-the-club.webp",
  "CS Short: Color Grading": "https://dronedepartment.nl/images/portfolio/Screenshot-2023-06-22-at-16.32.34-400x300.webp",
  "Sam & Sophie": "https://dronedepartment.nl/images/portfolio/Sam-Sophie-400x300.webp",
  "Hornbach Viral": "https://dronedepartment.nl/images/portfolio/hornbach_viral-400x300.webp",
  "Flikken Rotterdam": "https://dronedepartment.nl/images/portfolio/Flikken-rotterdam-drone-400x300.webp",
  "Droneshow Montenegro": "https://dronedepartment.nl/images/portfolio/dronestories_montenegro-400x300.webp",
  "SAMCITY FPV Drone Fly-Through": "https://dronedepartment.nl/images/portfolio/Samcity.webp",
  "FPV Flythrough Samcity": "https://dronedepartment.nl/images/portfolio/samcity_lasergame_3_1-400x300.webp",
  "Expeditie Robinson 2021": "https://dronedepartment.nl/images/portfolio/expeditierobinson2021-400x300.webp",
  "Albert Heijn – Steeds beter eten": "https://dronedepartment.nl/images/portfolio/ah-e1620742581877-400x300.webp",
  "Toyota GR Yaris": "https://dronedepartment.nl/images/portfolio/yaris-400x300.webp",
  "Opa en oma | McDonald’s": "https://dronedepartment.nl/images/portfolio/mcdonaldsopaoma-400x300.webp",
  "De Volksbank": "https://dronedepartment.nl/images/portfolio/devolksbank-400x300.webp",
  "Hollands Hoop": "https://dronedepartment.nl/images/portfolio/hollands-hoop-400x300.webp",
  "CS Short: MINERS HAVEN": "https://dronedepartment.nl/images/portfolio/minershaven-400x300.webp",
  "Omgevingsdienst Noordzeekanaal": "https://dronedepartment.nl/images/portfolio/72291541_2625305917582490_1852550852594516632_n-400x300.webp",
  "SpaceBoy": "https://dronedepartment.nl/images/portfolio/spaceboy-400x300.webp",
  "CS Shorts: Golden countryside": "https://dronedepartment.nl/images/portfolio/Golden-country-side-400x300.webp",
  "McDonald’s for You": "https://dronedepartment.nl/images/portfolio/Screenshot_1-400x300.webp",
  "Netflix – Our planet": "https://dronedepartment.nl/images/portfolio/image1-400x300.webp",
  "Facebook intro Postcode Loterij": "https://dronedepartment.nl/images/portfolio/postcode-loterij-1-400x300.webp",
  "Gewoon vrienden": "https://dronedepartment.nl/images/portfolio/Screenshot_20180307-182722_2-e1520511326286-400x300.webp",
  "De 12 van Oldenheim": "https://dronedepartment.nl/images/portfolio/12van2-400x300.webp",
  "Splendid – Fast Lane": "https://dronedepartment.nl/images/portfolio/splendid-fastlane-400x300.webp",
  "Mercedes-Benz docu": "https://dronedepartment.nl/images/portfolio/zandmotor-400x300.webp",
};

const preferredFrameSources = {
  "Kruimeltje": "https://static.filmvandaag.nl/covers/original/107000/107855.jpg?width=1000",
};

const localFrameOverrides = {
  "McDonald’s – Corona love story": "mcdonald-s-corona-love-story.jpg",
  "De Volksbank": "de-volksbank.jpg",
  "KARGO Case Study 2025": "kargo-case-study-2025-4k.jpg",
  "KARGO Cannes Case Study": "kargo-cannes-case-study.jpg",
};

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

function splitLongWord(word, maxChars) {
  if (word.length <= maxChars) return [word];
  const parts = [];
  for (let index = 0; index < word.length; index += maxChars) {
    parts.push(word.slice(index, index + maxChars));
  }
  return parts;
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/).flatMap((word) => splitLongWord(word, maxChars));
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
  return lines.slice(0, 7);
}

function textLayout(title) {
  for (const maxChars of [22, 26, 30, 34, 40, 46]) {
    const lines = wrapText(title, maxChars);
    const longest = Math.max(...lines.map((line) => line.length));
    const widthFont = Math.floor(1360 / Math.max(longest * 0.56, 1));
    const heightFont = Math.floor(230 / Math.max(lines.length * 1.04, 1));
    const fontSize = Math.min(92, widthFont, heightFont);

    if (fontSize >= 40 || maxChars === 46) {
      const safeFontSize = Math.max(32, fontSize);
      const lineHeight = Math.max(40, safeFontSize * 1.04);
      const totalHeight = (lines.length - 1) * lineHeight;
      return {
        lines,
        fontSize: safeFontSize,
        startY: 690 - Math.min(42, totalHeight * 0.42),
        lineHeight,
      };
    }
  }
}

function titleNumbers(title, hash) {
  const words = title.toUpperCase().match(/[A-Z0-9]+/g) || ["TIM"];
  const initials = words.slice(0, 4).map((word) => word[0]).join("");
  return {
    initials,
    code: String(hash % 10000).padStart(4, "0"),
    x1: 120 + (hash % 180),
    x2: 620 + ((hash >>> 5) % 120),
    y1: 230 + ((hash >>> 9) % 160),
    y2: 470 + ((hash >>> 13) % 150),
  };
}

function categoryScene(project, hash, accent, soft) {
  const { initials, code, x1, x2, y1, y2 } = titleNumbers(project.title, hash);
  const title = project.title.toLowerCase();
  const categories = project.categories;
  const isRacing = categories.includes("Sports") || /f1|yaris|heuer|boss|brennan|nuna/.test(title);
  const isFlyThrough = categories.includes("Fly-Through") || /fly|samcity|liander|logistics|boulder|tour/.test(title);
  const isEvent = categories.includes("Events") || /drone ?show|festival|ade|opening|montenegro|ukraine/.test(title);
  const isSeries = categories.includes("Tv-series") || /netflix|robinson|flikken|hoop|oldenheim/.test(title);
  const isFilm = categories.includes("Bioscoop films") || categories.includes("Shorts");
  const isCommercial = categories.includes("Commercials");

  if (isRacing) {
    return `
  <g opacity="0.82">
    <path d="M-80 300 C220 170 420 420 980 220" fill="none" stroke="${soft}" stroke-width="18" opacity="0.18"/>
    <path d="M-60 390 C220 250 480 520 960 310" fill="none" stroke="${accent}" stroke-width="6" opacity="0.52"/>
    <path d="M150 505 L770 280" stroke="#ffffff" stroke-width="2" stroke-dasharray="24 26" opacity="0.34"/>
    <g transform="translate(${x1} ${y2}) rotate(-13)">
      <rect x="0" y="0" width="360" height="118" rx="10" fill="#050505" opacity="0.62"/>
      <rect x="24" y="25" width="60" height="24" fill="${accent}" opacity="0.86"/>
      <rect x="108" y="25" width="60" height="24" fill="#ffffff" opacity="0.72"/>
      <rect x="192" y="25" width="60" height="24" fill="${accent}" opacity="0.66"/>
      <rect x="276" y="25" width="60" height="24" fill="#ffffff" opacity="0.52"/>
      <text x="180" y="91" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="800" letter-spacing="6" fill="#ffffff">${initials}</text>
    </g>
  </g>`;
  }

  if (isFlyThrough) {
    return `
  <g opacity="0.86">
    <path d="M90 230 H810 V690 H90 Z" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.18"/>
    <path d="M170 300 H730 V612 H170 Z" fill="none" stroke="${accent}" stroke-width="5" opacity="0.4"/>
    <path d="M255 366 H645 V542 H255 Z" fill="none" stroke="${soft}" stroke-width="3" opacity="0.42"/>
    <path d="M96 690 L255 542 M810 690 L645 542 M90 230 L255 366 M810 230 L645 366" stroke="#ffffff" stroke-width="2" opacity="0.2"/>
    <path d="M115 610 C260 470 355 640 464 490 S662 290 798 420" fill="none" stroke="${soft}" stroke-width="8" stroke-linecap="round" opacity="0.72"/>
    <path d="M115 610 C260 470 355 640 464 490 S662 290 798 420" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="12 18" opacity="0.72"/>
    <text x="450" y="320" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="10" fill="#ffffff" opacity="0.5">${code}</text>
  </g>`;
  }

  if (isEvent) {
    return `
  <g opacity="0.86">
    <path d="M120 610 C230 430 310 360 450 360 C590 360 670 430 780 610" fill="none" stroke="${accent}" stroke-width="5" opacity="0.55"/>
    <path d="M165 640 C270 490 340 438 450 438 C560 438 630 490 735 640" fill="none" stroke="${soft}" stroke-width="3" opacity="0.55"/>
    ${Array.from({ length: 13 }, (_, index) => {
      const x = 150 + index * 50;
      const y = 275 + ((hash >>> (index % 16)) & 1) * 70 + (index % 3) * 16;
      return `<path d="M${x} ${y} l16 0 l-8 14 Z" fill="${index % 2 ? soft : accent}" opacity="${0.52 + (index % 3) * 0.1}"/>`;
    }).join("\n    ")}
    <path d="M0 705 H900" stroke="#ffffff" stroke-width="2" opacity="0.16"/>
    <text x="${x2}" y="${y1}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="8" fill="#ffffff" opacity="0.34">${initials}</text>
  </g>`;
  }

  if (isSeries || isFilm) {
    return `
  <g opacity="0.88">
    <rect x="110" y="220" width="680" height="430" rx="8" fill="#050505" opacity="0.5"/>
    <path d="M140 250 H760 V620 H140 Z" fill="none" stroke="${accent}" stroke-width="4" opacity="0.42"/>
    ${Array.from({ length: 7 }, (_, index) => {
      const y = 268 + index * 48;
      return `<rect x="116" y="${y}" width="34" height="22" fill="#ffffff" opacity="0.22"/><rect x="750" y="${y}" width="34" height="22" fill="#ffffff" opacity="0.22"/>`;
    }).join("\n    ")}
    <path d="M218 570 C298 430 380 530 450 385 C518 250 620 360 704 260" fill="none" stroke="${soft}" stroke-width="6" opacity="0.58"/>
    <text x="450" y="420" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="84" font-weight="800" letter-spacing="10" fill="#ffffff" opacity="0.38">${initials}</text>
  </g>`;
  }

  if (isCommercial) {
    return `
  <g opacity="0.86">
    <rect x="115" y="255" width="670" height="370" rx="16" fill="#050505" opacity="0.44"/>
    <path d="M155 295 H745 M155 585 H745" stroke="#ffffff" stroke-width="2" opacity="0.2"/>
    <path d="M225 345 H675 V535 H225 Z" fill="none" stroke="${accent}" stroke-width="5" opacity="0.44"/>
    <path d="M255 505 L360 392 L455 465 L535 365 L660 505" fill="none" stroke="${soft}" stroke-width="7" stroke-linejoin="round" opacity="0.66"/>
    <text x="450" y="450" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="72" font-weight="800" letter-spacing="12" fill="#ffffff" opacity="0.28">${code}</text>
  </g>`;
  }

  return `
  <g opacity="0.84">
    <path d="M95 575 C220 365 350 620 490 385 S705 280 815 510" fill="none" stroke="${accent}" stroke-width="7" opacity="0.58"/>
    <path d="M120 635 C260 500 370 670 520 500 S710 380 810 455" fill="none" stroke="${soft}" stroke-width="4" opacity="0.42"/>
    <path d="M130 295 H770 M165 345 H735 M200 395 H700" stroke="#ffffff" stroke-width="2" opacity="0.16"/>
    <text x="${x1}" y="${y1}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="74" font-weight="800" letter-spacing="8" fill="#ffffff" opacity="0.32">${initials}</text>
  </g>`;
}

function frameCandidateUrls(project) {
  const urls = [];
  if (!project.videoUrl) return urls;

  const youtubeId = project.videoUrl.match(/[?&]v=([A-Za-z0-9_-]+)/)?.[1];
  const vimeoId = project.videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];

  if (youtubeId) {
    urls.push(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`);
    urls.push(`https://img.youtube.com/vi/${youtubeId}/sddefault.jpg`);
    urls.push(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`);
  }
  if (vimeoId) urls.push(`https://vumbnail.com/${vimeoId}.jpg`);
  return urls;
}

function localPosterSource(project) {
  if (project.title === "SUGA: RIDE OR DIE") {
    const posterPath = path.join(root, "public", "suga-ride-or-die-poster.jpg");
    if (fs.existsSync(posterPath)) {
      const base64 = fs.readFileSync(posterPath).toString("base64");
      return `data:image/jpeg;base64,${base64}`;
    }
  }

  if (localFrameOverrides[project.title]) {
    const framePath = path.join(frameDir, localFrameOverrides[project.title]);
    if (fs.existsSync(framePath)) {
      const buffer = fs.readFileSync(framePath);
      const base64 = buffer.toString("base64");
      return `data:${imageMimeType(buffer)};base64,${base64}`;
    }
  }

  return "";
}

function imageMimeType(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return "image/png";
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return "image/jpeg";
}

function downloadFrame(project) {
  const localPoster = localPosterSource(project);
  if (localPoster) return localPoster;

  const urls = [
    ...(preferredFrameSources[project.title] ? [preferredFrameSources[project.title]] : []),
    ...frameCandidateUrls(project),
    ...(portfolioFrameSources[project.title] ? [portfolioFrameSources[project.title]] : []),
  ];
  if (!urls.length) return "";

  const filename = `${slugify(project.title)}.jpg`;
  const outputPath = path.join(frameDir, filename);

  for (const url of urls) {
    try {
      execFileSync("curl", ["-L", "-s", "-f", "-o", outputPath, url], { stdio: "pipe" });
      const size = fs.statSync(outputPath).size;
      if (size < 1024) throw new Error(`Downloaded file is too small: ${size}`);
      const buffer = fs.readFileSync(outputPath);
      const base64 = buffer.toString("base64");
      return `data:${imageMimeType(buffer)};base64,${base64}`;
    } catch (error) {
      if (fs.existsSync(outputPath)) fs.rmSync(outputPath);
    }
  }

  console.warn(`Could not download frame for ${project.title}`);
  return "";
}

function posterSvg(project, framePath) {
  const hash = hashString(project.title);
  const [base, accent, soft] = palettes[hash % palettes.length];
  const layout = textLayout(project.title);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${posterWidth}" height="${posterHeight}" viewBox="0 0 1600 900" role="img" aria-label="${escapeXml(project.title)} poster">
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
    <filter id="imagePolish" x="-3%" y="-3%" width="106%" height="106%">
      <feGaussianBlur stdDeviation="0.16" result="smooth"/>
      <feComponentTransfer>
        <feFuncR type="gamma" amplitude="1.04" exponent="0.98" offset="0"/>
        <feFuncG type="gamma" amplitude="1.04" exponent="0.98" offset="0"/>
        <feFuncB type="gamma" amplitude="1.04" exponent="0.98" offset="0"/>
      </feComponentTransfer>
    </filter>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.02"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0.06"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.48"/>
    </linearGradient>
    <linearGradient id="titlePlate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="0.36" stop-color="#000000" stop-opacity="0.44"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.82"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  ${framePath ? `<image href="${framePath}" x="0" y="0" width="1600" height="900" preserveAspectRatio="xMidYMid slice" opacity="1" style="image-rendering:auto"/>` : ""}
  <rect width="1600" height="900" fill="#000" opacity="${framePath ? "0.1" : "0.24"}"/>
  <rect width="1600" height="900" fill="url(#glow)" opacity="${framePath ? "0.22" : "0.78"}"/>
  <rect width="1600" height="900" fill="url(#grain)" opacity="${framePath ? "0.12" : "0.34"}"/>
  <rect width="1600" height="900" fill="url(#bg)" opacity="${framePath ? "0.02" : "1"}"/>
  ${framePath ? "" : `<g transform="translate(350 -220)">${categoryScene(project, hash, accent, soft)}</g>`}
  <rect width="1600" height="900" fill="url(#fade)"/>
  <rect x="0" y="560" width="1600" height="340" fill="url(#titlePlate)"/>
  <g>
    ${layout.lines.map((line, i) => `<text x="800" y="${layout.startY + i * layout.lineHeight}" text-anchor="middle" font-family="Outfit, Inter, Arial, sans-serif" font-size="${layout.fontSize}" font-weight="800" letter-spacing="0" fill="#ffffff" filter="url(#softShadow)">${escapeXml(line.toUpperCase())}</text>`).join("\n    ")}
  </g>
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

console.log(`Generated ${updatedProjects.length} poster thumbnails in public/posters`);
console.log(`Generated homepage OG poster`);
