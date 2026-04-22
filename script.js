const canvas = document.querySelector("#matrix");
const ctx = canvas.getContext("2d");
const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@:/.-_";
let columns = [];
let columnCount = 0;

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  columnCount = Math.ceil(window.innerWidth / 18);
  columns = Array.from({ length: columnCount }, () => Math.random() * window.innerHeight);
}

function drawMatrix() {
  ctx.fillStyle = "rgba(3, 5, 3, 0.12)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.font = "14px JetBrains Mono, monospace";
  ctx.fillStyle = "rgba(76, 255, 125, 0.42)";

  columns.forEach((y, index) => {
    const text = glyphs[Math.floor(Math.random() * glyphs.length)];
    const x = index * 18;
    ctx.fillText(text, x, y);
    columns[index] = y > window.innerHeight + Math.random() * 900 ? 0 : y + 18;
  });

  requestAnimationFrame(drawMatrix);
}

resizeCanvas();
drawMatrix();
window.addEventListener("resize", resizeCanvas);

const terminalLines = [
  ["$", "./urlhunter --crawl target.local"],
  ["$", "nmap -sV --script vuln 10.10.10.0/24"],
  ["$", "python3 recon_ai_summary.py"],
  ["status", "attack surface mapped"],
  ["finding", "missing CSP and weak X-Frame-Options"],
  ["cache", "nvd.sqlite refreshed"],
  ["report", "cvss severity table generated"]
];

const terminal = document.querySelector("#terminalLines");
let terminalOffset = 0;

setInterval(() => {
  terminalOffset = (terminalOffset + 1) % terminalLines.length;
  const view = Array.from({ length: 4 }, (_, index) => terminalLines[(terminalOffset + index) % terminalLines.length]);
  terminal.innerHTML = view.map(([label, text]) => `<p><b>${label}</b> ${text}</p>`).join("");
}, 2400);

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
