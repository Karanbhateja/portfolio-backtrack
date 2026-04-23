// ─── Terminal Engine ──────────────────────────────────────────────────────────
const Terminal = (() => {
    const output = document.getElementById('termOutput');
    const input = document.getElementById('termInput');
    const modal = document.getElementById('terminalModal');

    let history = [];
    let histIdx = -1;

    // ── Helpers ────────────────────────────────────────────────────────────────
    function print(html, cls = '') {
        const line = document.createElement('div');
        line.className = 'term-line' + (cls ? ' ' + cls : '');
        line.innerHTML = html;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    function printRaw(text, cls = '') {
        print(escHtml(text), cls);
    }

    function escHtml(t) {
        return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function prompt(cmd) {
        print(`<span class="t-prompt">root@bt:~#</span> <span class="t-cmd">${escHtml(cmd)}</span>`);
    }

    function nl() { print('&nbsp;'); }

    // ── Banner ─────────────────────────────────────────────────────────────────
    function showBanner() {
        const art = [
            `<span class="t-green">╔══════════════════════════════════════════════════════╗</span>`,
            `<span class="t-green">║</span>  <span class="t-green"> ____  _____</span>   <span class="t-white">BackTrack 5 R3 — Security Research OS</span>   <span class="t-green">║</span>`,
            `<span class="t-green">║</span>  <span class="t-green">|  _ \\|_   _|</span>  <span class="t-dim">GNU/Linux — Penetration Testing Platform</span>  <span class="t-green">║</span>`,
            `<span class="t-green">║</span>  <span class="t-green">| |_) | | |  </span>  <span class="t-white">Karan Bhateja — Cybersecurity Engineer</span>    <span class="t-green">║</span>`,
            `<span class="t-green">║</span>  <span class="t-green">|  _ <  | |  </span>  <span class="t-dim">Offensive Testing · ISO 27001 · Automation</span> <span class="t-green">║</span>`,
            `<span class="t-green">║</span>  <span class="t-green">|_| \\_\\|_|  </span>  <span class="t-green">root@bt</span> <span class="t-dim">·</span> <span class="t-cyan">github.com/karanbhateja</span>     <span class="t-green">║</span>`,
            `<span class="t-green">╚══════════════════════════════════════════════════════╝</span>`,
        ];
        art.forEach(l => print(l));
        nl();
        print(`<span class="t-dim">Type <span class="t-green">help</span> to see available commands.</span>`);
        nl();
    }

    // ── Commands ───────────────────────────────────────────────────────────────
    const commands = {

        help() {
            nl();
            print(`<span class="t-green">+------------------------------------------+</span>`);
            print(`<span class="t-green">|</span>         <span class="t-white">Available Commands</span>              <span class="t-green">|</span>`);
            print(`<span class="t-green">+------------------------------------------+</span>`);
            const cmds = [
                ['whoami', 'Display identity info'],
                ['about', 'Full bio & background'],
                ['skills', 'Technical skill set'],
                ['projects', 'View portfolio projects'],
                ['contact', 'Get contact information'],
                ['scan', 'Run a fake network scan 👀'],
                ['banner', 'Display ASCII banner'],
                ['history', 'Show command history'],
                ['clear', 'Clear the terminal'],
                ['exit', 'Close the terminal'],
            ];
            cmds.forEach(([cmd, desc]) => {
                print(`  <span class="t-green">${cmd.padEnd(12)}</span><span class="t-dim">—</span> <span class="t-white">${desc}</span>`);
            });
            nl();
        },

        whoami() {
            nl();
            print(`<span class="t-green">[*] Name   :</span> <span class="t-white">Karan Bhateja</span>`);
            print(`<span class="t-green">[*] Title  :</span> <span class="t-white">Cybersecurity Engineer | Automation & Security Tooling Developer</span>`);
            print(`<span class="t-green">[*] Focus  :</span> <span class="t-white">Offensive Testing · Internal Audits · Security Automation</span>`);
            print(`<span class="t-green">[+] GitHub :</span> <span class="t-cyan"><a href="https://github.com/karanbhateja" target="_blank">github.com/karanbhateja</a></span>`);
            nl();
        },

        about() {
            nl();
            print(`<span class="t-green">[*] About Me</span>`);
            nl();
            print(`<span class="t-white">Cybersecurity professional focused on building practical security tools,</span>`);
            print(`<span class="t-white">automation workflows, and real-world defensive solutions. I work across</span>`);
            print(`<span class="t-white">offensive testing, internal audits, and infrastructure hardening, with</span>`);
            print(`<span class="t-white">a strong focus on scripting and automation to simplify complex security tasks.</span>`);
            nl();
            print(`<span class="t-white">I enjoy building tools that solve real problems — from network scanners and</span>`);
            print(`<span class="t-white">ISO 27001 automation to secure licensing systems and lightweight security</span>`);
            print(`<span class="t-white">infrastructure using Linux and Raspberry Pi.</span>`);
            nl();
        },

        skills() {
            nl();
            print(`<span class="t-green">[*] Languages</span>`);
            print(`  <span class="t-green">[+]</span> Python  <span class="t-green">[+]</span> Bash/Shell  <span class="t-green">[+]</span> JavaScript (basic)  <span class="t-green">[+]</span> PowerShell`);
            nl();
            print(`<span class="t-green">[*] Cybersecurity</span>`);
            print(`  <span class="t-green">[+]</span> Network Security Assessments`);
            print(`  <span class="t-green">[+]</span> Internal Audits (ISO 27001 aligned)`);
            print(`  <span class="t-green">[+]</span> Security Automation`);
            print(`  <span class="t-green">[+]</span> Web Security Basics`);
            print(`  <span class="t-green">[+]</span> Secure Infrastructure Setup`);
            nl();
            print(`<span class="t-green">[*] Tools & Platforms</span>`);
            print(`  <span class="t-green">[+]</span> Kali Linux  <span class="t-green">[+]</span> Nmap  <span class="t-green">[+]</span> OpenSSH  <span class="t-green">[+]</span> Wireshark`);
            print(`  <span class="t-green">[+]</span> Linux Server Hardening  <span class="t-green">[+]</span> Raspberry Pi  <span class="t-green">[+]</span> Git/GitHub`);
            nl();
            print(`<span class="t-green">[*] Other</span>`);
            print(`  <span class="t-green">[+]</span> Security Reporting & Documentation`);
            print(`  <span class="t-green">[+]</span> Script Obfuscation & Licensing Systems`);
            print(`  <span class="t-green">[+]</span> Self-Hosted Security Tooling`);
            nl();
        },

        projects() {
            nl();
            const projs = [
                {
                    id: '01', icon: '🔐', name: 'ISO 27001 Network Audit Toolkit',
                    desc: 'Automated internal network scanning toolkit for ISO 27001-style audits. Includes live host discovery, service enumeration, and structured reporting.',
                    tags: ['Python', 'Nmap', 'ISO 27001', 'Automation'],
                    link: 'https://github.com/karanbhateja',
                },
                {
                    id: '02', icon: '🛡', name: 'Security Script Obfuscation & Licensing System',
                    desc: 'Cryptographic signing and license validation system for protecting proprietary security scripts from unauthorized use.',
                    tags: ['Python', 'Cryptography', 'Licensing'],
                    link: null,
                },
                {
                    id: '03', icon: '📡', name: 'Raspberry Pi Security Lab',
                    desc: 'Custom lightweight security lab on Raspberry Pi for SSH tunneling, remote access, and network segmentation experiments.',
                    tags: ['Linux', 'SSH', 'Raspberry Pi', 'Networking'],
                    link: null,
                },
                {
                    id: '04', icon: '⚡', name: 'Security Automation Scripts',
                    desc: 'Collection of automation tools for common cybersecurity workflows including scanning, reporting, and infrastructure setup.',
                    tags: ['Bash', 'Python', 'Automation'],
                    link: 'https://github.com/karanbhateja',
                },
            ];

            projs.forEach(p => {
                print(`<span class="t-green">┌─[</span><span class="t-white">${p.icon} PROJECT-${p.id}</span><span class="t-green">]</span>`);
                print(`<span class="t-green">│</span> <span class="t-white">${p.name}</span>`);
                print(`<span class="t-green">│</span> <span class="t-dim">${p.desc}</span>`);
                print(`<span class="t-green">│</span> Tags: ${p.tags.map(t => `<span class="t-cyan">${t}</span>`).join(' ')}`);
                if (p.link) {
                    print(`<span class="t-green">│</span> <span class="t-cyan"><a href="${p.link}" target="_blank">${p.link}</a></span>`);
                }
                print(`<span class="t-green">└──────────────────────────────</span>`);
                nl();
            });
        },

        contact() {
            nl();
            print(`<span class="t-green">[*] Contact Information</span>`);
            nl();
            print(`  <span class="t-green">[+] GitHub :</span> <span class="t-cyan"><a href="https://github.com/karanbhateja" target="_blank">github.com/karanbhateja</a></span>`);
            print(`  <span class="t-green">[+] Email  :</span> <span class="t-white">Available on request</span>`);
            nl();
            print(`<span class="t-dim">  Open to freelance, collaboration, and full-time opportunities.</span>`);
            nl();
        },

        async scan() {
            nl();
            print(`<span class="t-green">[*] Starting Nmap 7.94 ( https://nmap.org )</span>`);
            print(`<span class="t-dim">[*] Scanning target: 192.168.1.0/24...</span>`);
            nl();

            const fakeHosts = [
                { ip: '192.168.1.1', host: 'router.local', open: ['22/tcp  ssh', '80/tcp  http', '443/tcp https'] },
                { ip: '192.168.1.10', host: 'kali.local', open: ['22/tcp  ssh', '4444/tcp msf-listener'] },
                { ip: '192.168.1.15', host: 'rpi-seclab.local', open: ['22/tcp  ssh', '8080/tcp http-proxy'] },
                { ip: '192.168.1.42', host: 'win-host.local', open: ['135/tcp msrpc', '445/tcp microsoft-ds', '3389/tcp ms-wbt-server'] },
            ];

            for (const h of fakeHosts) {
                await sleep(600);
                print(`<span class="t-green">[+] Nmap scan report for ${h.host} (${h.ip})</span>`);
                print(`<span class="t-white">    Host is up (0.00${Math.floor(Math.random() * 9) + 1}s latency).</span>`);
                print(`<span class="t-dim">    PORT      STATE  SERVICE</span>`);
                h.open.forEach(p => print(`    <span class="t-cyan">${p.padEnd(14)}</span><span class="t-green">open</span>`));
                nl();
            }

            await sleep(400);
            print(`<span class="t-green">[*] Nmap done: 4 IP addresses (4 hosts up) scanned in ${(Math.random() * 3 + 1).toFixed(2)}s</span>`);
            print(`<span class="t-dim">[ This is a simulated scan — no real network activity. ]</span>`);
            nl();
        },

        banner() {
            output.innerHTML = '';
            showBanner();
        },

        history() {
            nl();
            if (history.length === 0) {
                print(`<span class="t-dim">No commands in history.</span>`);
            } else {
                history.forEach((cmd, i) => {
                    print(`  <span class="t-dim">${String(i + 1).padStart(3)}  </span><span class="t-white">${escHtml(cmd)}</span>`);
                });
            }
            nl();
        },

        clear() {
            output.innerHTML = '';
        },

        exit() {
            closeTerminal();
        },
    };

    // ── Unknown command ────────────────────────────────────────────────────────
    function unknown(cmd) {
        nl();
        print(`<span class="t-red">bash: ${escHtml(cmd)}: command not found</span>`);
        print(`<span class="t-dim">Type <span class="t-green">help</span> for available commands.</span>`);
        nl();
    }

    // ── Sleep helper ───────────────────────────────────────────────────────────
    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ── Run a command ──────────────────────────────────────────────────────────
    async function run(raw) {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        history.push(raw.trim());
        histIdx = history.length;

        prompt(raw.trim());

        if (commands[cmd]) {
            await commands[cmd]();
        } else {
            unknown(cmd);
        }
    }

    // ── Open / Close ───────────────────────────────────────
    function openTerminal() {
        modal.classList.add('active');
        if (output.children.length === 0) showBanner();
        setTimeout(() => input && input.focus(), 80);
    }

    function closeTerminal() {
        modal.classList.remove('active');
        input && input.blur();
    }

    // ── Input listeners ─────────────────────────────────────────────────
    function init() {
        input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const val = input.value; input.value = '';
                histIdx = history.length;
                await run(val);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (histIdx > 0) histIdx--;
                input.value = history[histIdx] || '';
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (histIdx < history.length - 1) histIdx++;
                else histIdx = history.length;
                input.value = history[histIdx] || '';
            }
        });

        document.getElementById('termBody').addEventListener('click', () => {
            if (modal.classList.contains('active')) input.focus();
        });

        // Escape to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) closeTerminal();
        });

        // Close buttons
        document.getElementById('termClose').addEventListener('click', closeTerminal);
        document.getElementById('termCloseBtn').addEventListener('click', closeTerminal);

        // Launch buttons
        document.querySelectorAll('.launch-terminal').forEach(btn => {
            btn.addEventListener('click', openTerminal);
        });
        // Click backdrop (outside .terminal-window) to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTerminal();
        });
    }

    return { init, openTerminal, closeTerminal };
})();
