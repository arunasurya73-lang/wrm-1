// ==========================================
// Anti-Gravity Particle Physics Canvas Engine
// WebGL-inspired 2D Physics Particle Simulation
// ==========================================

const PARTICLE_DENSITY = 0.00014; // Main interactive particles density
const BG_PARTICLE_DENSITY = 0.000045; // Ambient drifting stars/dust density
const MOUSE_RADIUS = 180; // Radius of mouse influence
const RETURN_SPEED = 0.075; // Spring constant (return to origin)
const DAMPING = 0.90; // Velocity decay / friction
const REPULSION_STRENGTH = 1.2; // Mouse push multiplier

const randomRange = (min, max) => Math.random() * (max - min) + min;

export class AntiGravityBackground {
  constructor(containerId = 'anti-gravity-container', canvasId = 'anti-gravity-canvas') {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.bgParticles = [];
    this.mouse = { x: -1000, y: -1000, isActive: false };
    this.frameId = 0;
    this.lastTime = 0;
    this.width = 0;
    this.height = 0;
    this.isDarkTheme = true;

    this.init();
  }

  init() {
    this.handleThemeChange();
    this.handleResize();
    this.attachEvents();
    this.animate(0);
  }

  handleThemeChange() {
    const isLight = document.documentElement.classList.contains('light');
    this.isDarkTheme = !isLight;
  }

  initParticles(w, h) {
    this.width = w;
    this.height = h;

    // 1. Main Interactive Physics Particles
    const particleCount = Math.min(240, Math.floor(w * h * PARTICLE_DENSITY));
    const newParticles = [];

    const isLight = !this.isDarkTheme;
    const accentColors = isLight 
      ? ['#3B82F6', '#06B6D4', '#10B981', '#6366F1', '#475569']
      : ['#4285F4', '#60A5FA', '#34D399', '#38BDF8', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const chosenColor = Math.random() > 0.85 
        ? accentColors[Math.floor(Math.random() * (accentColors.length - 1))] 
        : (isLight ? '#64748B' : '#FFFFFF');

      newParticles.push({
        x: x,
        y: y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        size: randomRange(1.2, 2.8),
        color: chosenColor,
        angle: Math.random() * Math.PI * 2
      });
    }
    this.particles = newParticles;

    // 2. Ambient Drifting Background Particles (Stars/Dust)
    const bgCount = Math.min(80, Math.floor(w * h * BG_PARTICLE_DENSITY));
    const newBg = [];

    for (let i = 0; i < bgCount; i++) {
      newBg.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        size: randomRange(0.6, 1.6),
        alpha: randomRange(0.15, 0.45),
        phase: Math.random() * Math.PI * 2
      });
    }
    this.bgParticles = newBg;
  }

  handleResize() {
    if (!this.canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      this.ctx.scale(dpr, dpr);
    }

    this.initParticles(w, h);
  }

  attachEvents() {
    window.addEventListener('resize', () => this.handleResize());

    // Track mouse on entire window for responsive anti-gravity field
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.isActive = true;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.isActive = false;
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
        this.mouse.isActive = true;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isActive = false;
    });

    // Observe theme switch
    const observer = new MutationObserver(() => {
      this.handleThemeChange();
      this.initParticles(this.width, this.height);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-weather'] });
  }

  animate(time) {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear Canvas
    ctx.clearRect(0, 0, w, h);

    // --- Background Ambient Effects ---
    const centerX = w / 2;
    const centerY = h / 2;
    const pulseSpeed = 0.0008;
    const pulseOpacity = Math.sin(time * pulseSpeed) * 0.035 + 0.075;

    const glowColor = this.isDarkTheme 
      ? `rgba(66, 133, 244, ${pulseOpacity})` 
      : `rgba(59, 130, 246, ${pulseOpacity * 0.7})`;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(w, h) * 0.7
    );
    gradient.addColorStop(0, glowColor);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // --- Background Drifting Particles (Stars / Dust) ---
    const bgDotColor = this.isDarkTheme ? '#FFFFFF' : '#3B82F6';
    ctx.fillStyle = bgDotColor;

    for (let i = 0; i < this.bgParticles.length; i++) {
      const p = this.bgParticles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Screen wrapping
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Twinkling phase
      const twinkle = Math.sin(time * 0.002 + p.phase) * 0.5 + 0.5;
      const currentAlpha = p.alpha * (0.3 + 0.7 * twinkle);

      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // --- Main Foreground Anti-Gravity Physics ---
    const particles = this.particles;
    const mouse = this.mouse;

    // Phase 1: Apply Mouse Repulsion & Spring Return Forces
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 1. Distance to cursor
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distance = Math.hypot(dx, dy);

      // 2. Mouse Anti-Gravity Repulsion Force
      if (mouse.isActive && distance < MOUSE_RADIUS && distance > 0.001) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
        const repulsion = force * REPULSION_STRENGTH;

        p.vx -= forceDirectionX * repulsion * 5;
        p.vy -= forceDirectionY * repulsion * 5;
      }

      // 3. Spring Force to Return to Origin
      const springDx = p.originX - p.x;
      const springDy = p.originY - p.y;
      p.vx += springDx * RETURN_SPEED;
      p.vy += springDy * RETURN_SPEED;
    }

    // Phase 2: Resolve Elastic Collisions Between Particles
    const pLen = particles.length;
    for (let i = 0; i < pLen; i++) {
      for (let j = i + 1; j < pLen; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distSq = dx * dx + dy * dy;
        const minDist = p1.size + p2.size;

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq);

          if (dist > 0.01) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Static Resolution (prevent overlap)
            const overlap = minDist - dist;
            const pushX = nx * overlap * 0.5;
            const pushY = ny * overlap * 0.5;

            p1.x -= pushX;
            p1.y -= pushY;
            p2.x += pushX;
            p2.y += pushY;

            // Dynamic Elastic Collision
            const dvx = p1.vx - p2.vx;
            const dvy = p1.vy - p2.vy;
            const velocityAlongNormal = dvx * nx + dvy * ny;

            if (velocityAlongNormal > 0) {
              const m1 = p1.size;
              const m2 = p2.size;
              const restitution = 0.85;

              const impulseMagnitude = (-(1 + restitution) * velocityAlongNormal) / (1 / m1 + 1 / m2);
              const impulseX = impulseMagnitude * nx;
              const impulseY = impulseMagnitude * ny;

              p1.vx += impulseX / m1;
              p1.vy += impulseY / m1;
              p2.vx -= impulseX / m2;
              p2.vy -= impulseY / m2;
            }
          }
        }
      }
    }

    // Phase 3: Integration, Velocity Damping & Drawing
    for (let i = 0; i < pLen; i++) {
      const p = particles[i];

      p.vx *= DAMPING;
      p.vy *= DAMPING;

      p.x += p.vx;
      p.y += p.vy;

      const velocity = Math.hypot(p.vx, p.vy);
      const opacity = Math.min(0.35 + velocity * 0.12, 1);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      if (p.color === '#FFFFFF' || p.color === '#64748B') {
        ctx.fillStyle = this.isDarkTheme 
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(100, 116, 139, ${opacity * 0.9})`;
      } else {
        ctx.fillStyle = p.color;
      }

      ctx.fill();
    }

    this.frameId = requestAnimationFrame((t) => this.animate(t));
  }
}
