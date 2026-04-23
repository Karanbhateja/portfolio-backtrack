// Enhanced Matrix Rain
(function () {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const chars  = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/\\|{}[]#$%@!?';
    const FONT   = 13;
    const SPEEDS = [1, 1, 1, 2]; // weighted speed pool

    let cols, drops, speeds, opacity;

    function reset() {
        cols   = Math.floor(W / FONT);
        drops  = Array.from({ length: cols }, () => Math.random() * -H / FONT);
        speeds = Array.from({ length: cols }, () => SPEEDS[Math.floor(Math.random() * SPEEDS.length)]);
        opacity= Array.from({ length: cols }, () => 0.4 + Math.random() * 0.6);
    }
    reset();

    function draw() {
        // Soft fade trail
        ctx.fillStyle = 'rgba(5,3,3,0.055)';
        ctx.fillRect(0, 0, W, H);

        ctx.font = FONT + 'px JetBrains Mono, monospace';

        for (let i = 0; i < cols; i++) {
            const y = drops[i] * FONT;
            if (y < 0) { drops[i] += speeds[i]; continue; }

            const char = chars[Math.floor(Math.random() * chars.length)];
            const x    = i * FONT;

            // Head character — bright warm white
            if (drops[i] % 22 < 1) {
                ctx.fillStyle = `rgba(255,220,200,${opacity[i]})`;
            } else if (Math.random() > 0.98) {
                // Occasional orange highlight
                ctx.fillStyle = `rgba(255,110,0,${opacity[i] * 0.7})`;
            } else {
                ctx.fillStyle = `rgba(204,34,0,${opacity[i] * 0.55})`;
            }

            ctx.fillText(char, x, y);

            // Reset drop
            if (y > H && Math.random() > 0.974) {
                drops[i]  = Math.random() * -10;
                speeds[i] = SPEEDS[Math.floor(Math.random() * SPEEDS.length)];
                opacity[i]= 0.4 + Math.random() * 0.6;
            }
            drops[i] += speeds[i];
        }
    }

    let raf = null;
    function loop() { draw(); raf = requestAnimationFrame(loop); }
    loop();

    // Pause when hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(raf); raf = null; }
        else { if (!raf) loop(); }
    });

    window.addEventListener('resize', () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        reset();
    });
})();
