const matrixCanvas = document.querySelector("#matrix");
const matrixCtx = matrixCanvas.getContext("2d");
const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@:/.-_";
let columns = [];
let columnCount = 0;

const spaceCanvas = document.querySelector("#cyberspace");
const spaceCtx = spaceCanvas.getContext("2d");
let stars = [];
let tunnels = [];
let scrollDepth = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  matrixCanvas.width = Math.floor(window.innerWidth * ratio);
  matrixCanvas.height = Math.floor(window.innerHeight * ratio);
  matrixCanvas.style.width = `${window.innerWidth}px`;
  matrixCanvas.style.height = `${window.innerHeight}px`;
  matrixCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  columnCount = Math.ceil(window.innerWidth / 18);
  columns = Array.from({ length: columnCount }, () => Math.random() * window.innerHeight);

  spaceCanvas.width = Math.floor(window.innerWidth * ratio);
  spaceCanvas.height = Math.floor(window.innerHeight * ratio);
  spaceCanvas.style.width = `${window.innerWidth}px`;
  spaceCanvas.style.height = `${window.innerHeight}px`;
  spaceCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
  seedCyberspace();
}

function seedCyberspace() {
  const starCount = Math.min(140, Math.floor(window.innerWidth / 10));
  stars = Array.from({ length: starCount }, () => ({
    x: Math.random() * window.innerWidth - window.innerWidth / 2,
    y: Math.random() * window.innerHeight - window.innerHeight / 2,
    z: Math.random() * 900 + 80,
    speed: Math.random() * 1.6 + 0.8
  }));

  tunnels = Array.from({ length: 18 }, (_, index) => ({
    z: index * 80 + 80,
    rot: index * 0.16
  }));
}

function drawMatrix() {
  matrixCtx.fillStyle = "rgba(4, 4, 4, 0.16)";
  matrixCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  matrixCtx.font = "14px JetBrains Mono, monospace";
  matrixCtx.fillStyle = "rgba(112, 255, 98, 0.26)";

  columns.forEach((y, index) => {
    const text = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = index * 18;
    matrixCtx.fillText(text, x, y);
    columns[index] = y > window.innerHeight + Math.random() * 900 ? 0 : y + 18;
  });

  requestAnimationFrame(drawMatrix);
}

function projectPoint(x, y, z) {
  const focal = Math.min(window.innerWidth, window.innerHeight) * 0.82;
  const scale = focal / z;
  return {
    x: window.innerWidth / 2 + x * scale,
    y: window.innerHeight / 2 + y * scale,
    scale
  };
}

function drawCyberspace() {
  const time = performance.now() * 0.001;
  scrollDepth += (window.scrollY - scrollDepth) * 0.075;
  spaceCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const speedBoost = 2 + Math.min(16, Math.abs(window.scrollY - scrollDepth) * 0.012);
  stars.forEach(star => {
    star.z -= star.speed * speedBoost;
    if (star.z < 35) {
      star.x = Math.random() * window.innerWidth - window.innerWidth / 2;
      star.y = Math.random() * window.innerHeight - window.innerHeight / 2;
      star.z = 980;
    }

    const point = projectPoint(star.x, star.y, star.z);
    const size = Math.max(0.7, 3.2 * point.scale);
    spaceCtx.fillStyle = `rgba(112, 255, 98, ${Math.min(0.85, 0.16 + point.scale * 0.55)})`;
    spaceCtx.fillRect(point.x, point.y, size, size);
  });

  tunnels.forEach(ring => {
    ring.z -= speedBoost * 1.5;
    if (ring.z < 70) {
      ring.z = 1480;
    }

    const sides = 6;
    const radius = 260 + Math.sin(time + ring.z * 0.004) * 36;
    const points = [];
    for (let i = 0; i < sides; i += 1) {
      const angle = (Math.PI * 2 * i) / sides + ring.rot + time * 0.18 + scrollDepth * 0.0008;
      points.push(projectPoint(Math.cos(angle) * radius, Math.sin(angle) * radius, ring.z));
    }

    spaceCtx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) {
        spaceCtx.moveTo(point.x, point.y);
      } else {
        spaceCtx.lineTo(point.x, point.y);
      }
    });
    spaceCtx.closePath();
    spaceCtx.strokeStyle = `rgba(183, 30, 30, ${Math.max(0.04, 0.34 - ring.z / 4200)})`;
    spaceCtx.lineWidth = Math.max(0.6, 3.4 - ring.z / 500);
    spaceCtx.stroke();
  });

  requestAnimationFrame(drawCyberspace);
}

resizeCanvas();
drawMatrix();
drawCyberspace();
window.addEventListener("resize", resizeCanvas);

const terminal = document.querySelector("#terminalLines");
const terminalScreen = document.querySelector("#terminalScreen");
const terminalForm = document.querySelector("#terminalForm");
const terminalInput = document.querySelector("#terminalInput");
const terminalWindow = document.querySelector("#terminalWindow");
const commandHistory = [];
let historyIndex = 0;

const commandMap = {
  help: [
    "available commands:",
    "  whoami       show profile",
    "  skills       list technical skills",
    "  projects     list selected projects",
    "  scan         simulate recon scan",
    "  contact      show email and GitHub",
    "  open github  open GitHub profile",
    "  clear        clear terminal"
  ],
  whoami: [
    "Karan Bhateja",
    "Cybersecurity Enthusiast | Security Automation Developer | Python Developer",
    "Focus: recon, enumeration, vulnerability context, and Linux security workflows."
  ],
  skills: [
    "Languages: Python, Bash, C, JavaScript basics",
    "Tools: Burp Suite, Nmap, Wireshark, Metasploit, Git, Linux",
    "Domains: web security, recon, automation, script development"
  ],
  projects: [
    "01 URLHunter - URL extraction and hidden endpoint discovery",
    "02 Internal Network Scanner - Nmap, NVD CVE enrichment, SQLite cache",
    "03 Website Recon Tool - DNS, subdomains, metadata, OSINT summaries",
    "04 Security Header Analyzer - CSP, HSTS, X-Frame-Options checks",
    "05 WinHunter - controlled lab payload generation and validation"
  ],
  contact: [
    "Email: karanbhatejaa@protonmail.com",
    "GitHub: https://github.com/Karanbhateja"
  ],
  scan: [
    "starting bt5 recon profile...",
    "nmap -sV --script vuln 10.10.10.0/24",
    "discovered services: ssh, http, https",
    "web checks: CSP missing, HSTS present, frame policy weak",
    "report: attack surface mapped"
  ],
  pwd: ["/root/portfolio"],
  ls: ["projects  skills  contact  lab-notes"],
  "cat readme": ["BackTrack themed interactive portfolio. Type help to explore."]
};

function appendTerminalLine(label, text) {
  const line = document.createElement("p");
  const prefix = document.createElement("b");
  prefix.textContent = label;
  line.append(prefix, document.createTextNode(` ${text}`));
  terminal.appendChild(line);
}

function appendOutput(lines) {
  lines.forEach(line => appendTerminalLine(">", line));
  terminal.scrollTop = terminal.scrollHeight;
}

function runCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) {
    return;
  }
  const key = command.toLowerCase();

  appendTerminalLine("root@bt:~#", command);
  commandHistory.push(command);
  historyIndex = commandHistory.length;

  if (key === "clear") {
    terminal.innerHTML = "";
    return;
  }

  if (key === "open github") {
    appendOutput(["opening GitHub profile in a new tab..."]);
    window.open("https://github.com/Karanbhateja", "_blank", "noreferrer");
    return;
  }

  appendOutput(commandMap[key] || [`command not found: ${command}`, "type help for available commands"]);
}

terminalForm.addEventListener("submit", event => {
  event.preventDefault();
  runCommand(terminalInput.value);
  terminalInput.value = "";
});

terminalInput.addEventListener("keydown", event => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    terminalInput.value = commandHistory[historyIndex] || "";
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    terminalInput.value = commandHistory[historyIndex] || "";
  }
});

terminalWindow.addEventListener("click", () => terminalInput.focus());

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach(card => revealObserver.observe(card));

document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("pointermove", event => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 10}deg) translateZ(18px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const nodeContent = {
  Recon: "Collect target URLs, DNS records, metadata, subdomains, and public intelligence before active testing begins.",
  Enumerate: "Run structured discovery with Nmap, custom parsers, service checks, and repeatable evidence capture.",
  Analyze: "Enrich findings with CVE context, CVSS severity, header posture, and exploitability notes.",
  Report: "Convert raw outputs into concise technical reports with risk severity and practical remediation direction.",
  Automate: "Package frequent tasks as Python, Bash, and CLI utilities that reduce repetitive security workflow steps."
};

const nodeTitle = document.querySelector("#nodeTitle");
const nodeText = document.querySelector("#nodeText");

document.querySelectorAll(".node").forEach(node => {
  node.addEventListener("click", () => {
    document.querySelectorAll(".node").forEach(item => item.classList.remove("active"));
    node.classList.add("active");
    nodeTitle.textContent = node.dataset.node;
    nodeText.textContent = nodeContent[node.dataset.node];
  });
});

const panels = document.querySelectorAll("[data-depth]");

function updateDepth() {
  const middle = window.innerHeight / 2;
  panels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const panelMiddle = rect.top + rect.height / 2;
    const distance = (panelMiddle - middle) / window.innerHeight;
    const depth = Number(panel.dataset.depth);
    panel.style.transform = `translateZ(${Math.max(-34, Math.min(34, distance * -120 * depth))}px) rotateX(${distance * depth * 8}deg)`;
  });
}

window.addEventListener("scroll", updateDepth, { passive: true });
updateDepth();
