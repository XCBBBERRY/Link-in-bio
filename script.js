document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.logo-animation');
    const textToAnimate = "R3P B3RRY";
    
    // Clear existing content
    container.innerHTML = '';

    // Create SVG Definitions for Gradient
    const svgNS = "http://www.w3.org/2000/svg";
    const defsSvg = document.createElementNS(svgNS, "svg");
    defsSvg.setAttribute('width', '0');
    defsSvg.setAttribute('height', '0');
    defsSvg.style.position = 'absolute';
    defsSvg.innerHTML = `
      <defs>
        <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4da6ff">
            <animate attributeName="stop-color" values="#4da6ff; #00ffff; #4da6ff" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stop-color="#00ffff">
            <animate attributeName="stop-color" values="#00ffff; #ffffff; #00ffff" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#4da6ff">
            <animate attributeName="stop-color" values="#4da6ff; #00ffff; #4da6ff" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
    `;
    container.appendChild(defsSvg);
    
    // Generate SVG letters
    const letters = [];
    
    for (const char of textToAnimate) {
        if (char === ' ') {
            // Spacer for space
            const spacer = document.createElement('span');
            spacer.style.width = '0.5em';
            spacer.style.display = 'inline-block';
            container.appendChild(spacer);
            // We push null or skip it in animation loop
            continue;
        }
        
        // Create SVG container
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.classList.add('letter-svg');
        svg.setAttribute('viewBox', '0 0 40 60'); // Approximate aspect ratio for text
        
        // Create Text element
        const textEl = document.createElementNS(svgNS, "text");
        textEl.textContent = char;
        textEl.setAttribute('x', '50%');
        textEl.setAttribute('y', '50%');
        textEl.setAttribute('dy', '.35em'); // Vertical center adjustment
        textEl.setAttribute('text-anchor', 'middle');
        textEl.classList.add('neon-text');
        
        svg.appendChild(textEl);
        container.appendChild(svg);
        letters.push(svg);
    }
    
    // Function to animate falling stars
    const animateFallingStars = () => {
        const avatar = document.querySelector('.avatar');
        const buttons = document.querySelectorAll('.btn');
        const container = document.querySelector('main.container');
        
        // Combine all targets: letters, avatar, buttons, container
        const targets = [
            ...letters.map(el => ({ el, type: 'letter' })),
            ...(avatar ? [{ el: avatar, type: 'block' }] : []),
            ...Array.from(buttons).map(el => ({ el, type: 'block' })),
            ...(container ? [{ el: container, type: 'block' }] : [])
        ];

        if (targets.length === 0) return;
        
        let delayCounter = 0;

        targets.forEach(({ el, type }) => {
            const rect = el.getBoundingClientRect();
            
            // Create the star
            const star = document.createElement('div');
            star.classList.add('falling-star');
            
            // Add white variant class if target is not a letter
            if (type !== 'letter') {
                star.classList.add('white-variant');
            }

            document.body.appendChild(star);
            
            // Calculate positions
            const starSize = 4;
            const startX = Math.random() * (window.innerWidth + 100) - 50;
            const startY = -(Math.random() * 250 + 50);
            
            const endX = rect.left + (rect.width / 2) - (starSize / 2);
            const endY = rect.top + (rect.height / 2) - (starSize / 2);
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const angleRad = Math.atan2(deltaY, deltaX);
            const angleDeg = angleRad * (180 / Math.PI) - 90;

            // Set initial position
            star.style.left = `${startX}px`;
            star.style.top = `${startY}px`;
            star.style.opacity = '0';
            
            // Animate
            const animation = star.animate(
                [
                    { transform: `translate(0px, 0px) rotate(${angleDeg}deg)`, opacity: 1, offset: 0 },
                    { transform: `translate(0px, 0px) rotate(${angleDeg}deg)`, opacity: 1, offset: 0.01 },
                    { transform: `translate(${deltaX}px, ${deltaY}px) rotate(${angleDeg}deg)`, opacity: 1, offset: 1 }
                ],
                {
                    duration: 1000,
                    delay: delayCounter * 200,
                    easing: 'ease-in',
                    fill: 'forwards'
                }
            );
            
            animation.onfinish = () => {
                star.remove();
                
                if (type === 'letter') {
                    // Activate neon effect on the text element inside SVG
                    const textEl = el.querySelector('.neon-text');
                    if (textEl) {
                        textEl.classList.add('active'); // Triggers dash animation & fill transition
                        
                        // After 2 seconds, remove gap (full stroke)
                        setTimeout(() => {
                            textEl.classList.add('filled');
                        }, 2000);
                    }
                } else {
                    // Activate neon effect for blocks (avatar/buttons)
                    el.classList.add('neon-active');
                    
                    // Optional: Slight brightness flash on impact for extra effect
                    el.animate([
                        { filter: 'brightness(1)' },
                        { filter: 'brightness(1.3)' },
                        { filter: 'brightness(1)' }
                    ], {
                        duration: 300,
                        easing: 'ease-out'
                    });
                }
            };

            delayCounter++;
        });
    };

    // Run animation after a short delay
    setTimeout(animateFallingStars, 500);

    // Initialize Background Stars
    createStarField();

    // Initialize Background Comet with Canvas
    initCanvasComet();
});

function createStarField() {
    const starCount = 100;
    const body = document.body;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('bg-star');
        
        // Random Position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;

        // Random Size
        const size = Math.random() * 2 + 1; // 1px to 3px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random Animation Duration & Delay
        const duration = Math.random() * 3 + 2; // 2s to 5s
        const delay = Math.random() * 5;
        star.style.setProperty('--duration', `${duration}s`);
        star.style.setProperty('--delay', `${delay}s`);

        // Randomly assign type: static (twinkling) or fading (disappearing)
        if (Math.random() < 0.7) {
            star.classList.add('static'); // 70% static blinking
        } else {
            star.classList.add('fading'); // 30% disappearing
        }

        body.appendChild(star);
    }
}

function initCanvasComet() {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Comet System
    class Comet {
        constructor(config) {
            this.config = config;
            this.active = false;
            // Start after delay defined in config
            setTimeout(() => this.reset(), this.config.respawnDelay * 1000);
        }

        reset() {
            // Constant trajectory based on config
            this.x = this.config.getStartX();
            this.y = this.config.getStartY();
            
            // Calculate speed
            const totalDistanceY = height + 200;
            const fps = 60;
            const totalFrames = this.config.duration * fps;
            const speed = totalDistanceY / totalFrames;
            
            this.dx = -speed; // Move left
            this.dy = speed;  // Move down
            this.size = 2;
            this.active = true;
        }

        update() {
            if (!this.active) return;

            this.x += this.dx;
            this.y += this.dy;

            // Check if out of bounds (bottom-left)
            if (this.y > height + 100 || this.x < -100) {
                this.active = false;
                setTimeout(() => this.reset(), this.config.respawnDelay * 1000);
            } else {
                // Draw comet head
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'white';
                ctx.fill();
                ctx.shadowBlur = 0;

                // Spawn particles
                if (particles.length < maxParticles) {
                    particles.push(createParticle(this.x, this.y, 'white', this.dx, this.dy));
                    
                    if (Math.random() < 0.3) {
                        particles.push(createParticle(this.x, this.y, 'black', this.dx, this.dy));
                    }
                }
            }
        }
    }

    const comets = [
        // Comet 1: Original (slow, high)
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -50,
            duration: 6,
            respawnDelay: 3
        }),
        // Comet 2: New (fast, lower)
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => height * 0.4, // Starts 40% down the screen
            duration: 2,
            respawnDelay: 10
        }),
        // Comet 3: Slowest, higher
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => height * 0.1, // Starts 10% down the screen (higher than 2nd)
            duration: 10,
            respawnDelay: 5
        }),
        // Comet 4: New (6s, even higher, 7s delay)
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -150, // Starts higher than the first one (-50)
            duration: 6,
            respawnDelay: 7
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -250, // Starts even higher
            duration: 20,
            respawnDelay: 7
        }),
        // Comet 6: Fast (2s), extremely high, 30s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -350, // Starts extremely high
            duration: 2,
            respawnDelay: 30
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -450, // Starts extremely high
            duration: 6,
            respawnDelay: 13
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -550, // Starts extremely high
            duration: 9,
            respawnDelay: 9
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -650, // Starts even higher
            duration: 20,
            respawnDelay: 7
        }),
        // Comet 6: Fast (2s), extremely high, 30s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -750, // Starts extremely high
            duration: 2,
            respawnDelay: 30
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -850, // Starts extremely high
            duration: 6,
            respawnDelay: 13
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -950, // Starts extremely high
            duration: 9,
            respawnDelay: 9
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1050, // Starts higher than the first one (-50)
            duration: 6,
            respawnDelay: 7
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1150, // Starts even higher
            duration: 19,
            respawnDelay: 7
        }),
        // Comet 6: Fast (2s), extremely high, 30s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1250, // Starts extremely high
            duration: 4,
            respawnDelay: 2
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1350, // Starts higher than the first one (-50)
            duration: 5,
            respawnDelay: 8
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1450, // Starts even higher
            duration: 20,
            respawnDelay: 5
        }),
        // Comet 6: Fast (2s), extremely high, 30s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1550, // Starts extremely high
            duration: 6,
            respawnDelay: 21
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1650, // Starts extremely high
            duration: 4,
            respawnDelay: 2
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1750, // Starts higher than the first one (-50)
            duration: 5,
            respawnDelay: 8
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => -1850, // Starts even higher
            duration: 20,
            respawnDelay: 5
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 100, // Starts extremely high
            duration: 6,
            respawnDelay: 15
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 200, // Starts extremely high
            duration: 5,
            respawnDelay: 5
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 300, // Starts higher than the first one (-50)
            duration: 5,
            respawnDelay: 8
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 400, // Starts even higher
            duration: 9,
            respawnDelay: 7
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 500, // Starts extremely high
            duration: 7,
            respawnDelay: 13
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 600, // Starts extremely high
            duration: 4,
            respawnDelay: 4
        }),
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 700, // Starts higher than the first one (-50)
            duration: 7,
            respawnDelay: 9
        }),
        // Comet 5: Very slow (115s), very high, 7s delay
        new Comet({
            getStartX: () => width + 50,
            getStartY: () => 800, // Starts even higher
            duration: 12,
            respawnDelay: 6
        })
    ];

    const particles = [];
    const maxParticles = 900; // Increased for multiple comets

    function createParticle(x, y, type, dx = 0, dy = 0) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * (type === 'black' ? 2 : 0.5),
            vy: (Math.random() - 0.5) * (type === 'black' ? 2 : 0.5),
            life: 1.0,
            decay: Math.random() * 0.01 + 0.005,
            type: type,
            size: type === 'white' ? Math.random() * 3 + 1 : Math.random() * 4 + 2,
            parentDx: dx,
            parentDy: dy
        };
    }

    function update() {
        ctx.clearRect(0, 0, width, height);

        // Update all comets
        comets.forEach(comet => comet.update());

        // Update and draw particles (always run this to clear trail)
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                p.x += p.vx;
                p.y += p.vy;

                // Drift trail relative to comet movement
                if (p.type === 'white') {
                    p.x -= p.parentDx * 0.1;
                    p.y -= p.parentDy * 0.1;
                } else {
                    // Black particles fly out
                    p.x += p.vx;
                    p.y += p.vy;
                }

                ctx.globalAlpha = p.life;
                
                if (p.type === 'white') {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                } else {
                    // Black pixels (square)
                    ctx.fillStyle = 'black';
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                }
                
                ctx.globalAlpha = 1.0;
            }
        }

        requestAnimationFrame(update);
    }

    update();
}
