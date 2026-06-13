/* ============================================
   PRELOADER
   ============================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const canvas = document.getElementById('preloaderCanvas');
  const bar = document.getElementById('preloaderBar');
  const percentEl = document.getElementById('preloaderPercent');
  if (!preloader) return;

  document.documentElement.classList.add('no-scroll');

  // Animated particle burst background
  let ctx, w, h, particles = [];
  if (canvas) {
    ctx = canvas.getContext('2d');
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.6;
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 1.8 + 0.4,
        o: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '94, 196, 182' : '244, 162, 89'
      });
    }

    let pFrame = 0;
    function drawParticles() {
      pFrame++;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        // wrap / respawn
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          p.x = w / 2;
          p.y = h / 2;
        }
        ctx.fillStyle = `rgba(${p.color}, ${p.o})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      if (!preloader.classList.contains('hidden')) {
        requestAnimationFrame(drawParticles);
      }
    }
    drawParticles();
  }

  // Progress bar
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress >= 100) progress = 100;
    if (bar) bar.style.width = progress + '%';
    if (percentEl) percentEl.textContent = Math.floor(progress) + '%';
    if (progress >= 100) clearInterval(progressInterval);
  }, 180);

  function finishPreload() {
    progress = 100;
    if (bar) bar.style.width = '100%';
    if (percentEl) percentEl.textContent = '100%';
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.documentElement.classList.remove('no-scroll');
    }, 350);
  }

  window.addEventListener('load', () => {
    setTimeout(finishPreload, 900);
  });
  // Fallback in case load event already fired or takes too long
  setTimeout(finishPreload, 3500);
})();

/* ============================================
   GLOBAL ANIMATED BACKGROUND
   ============================================ */
(function initBgCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  let w, h;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // Debounce resize to avoid mobile address-bar resize flicker
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  const blobs = [
    { x: 0.15, y: 0.05, r: 480, color: 'rgba(94, 196, 182, 0.07)', sx: 0.00012, sy: 0.00009, phase: 0 },
    { x: 0.85, y: 0.25, r: 560, color: 'rgba(244, 162, 89, 0.05)', sx: 0.00009, sy: 0.00013, phase: 1.4 },
    { x: 0.25, y: 0.6, r: 520, color: 'rgba(94, 196, 182, 0.05)', sx: 0.00011, sy: 0.0001, phase: 2.8 },
    { x: 0.8, y: 0.85, r: 600, color: 'rgba(244, 162, 89, 0.04)', sx: 0.0001, sy: 0.00012, phase: 4.2 }
  ];

  // Faint dot grid
  const dots = [];
  for (let i = 0; i < 50; i++) {
    dots.push({
      xr: Math.random(),
      yr: Math.random(),
      r: Math.random() * 1.5 + 0.5,
      o: Math.random() * 0.25 + 0.05
    });
  }

  let frame = 0;
  function draw() {
    frame++;
    ctx.fillStyle = '#0b0d10';
    ctx.fillRect(0, 0, w, h);

    blobs.forEach(b => {
      const x = (b.x + Math.sin(frame * b.sx + b.phase) * 0.06) * w;
      const y = (b.y + Math.cos(frame * b.sy + b.phase) * 0.06) * h;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    dots.forEach(d => {
      const x = d.xr * w;
      const y = d.yr * h;
      ctx.fillStyle = `rgba(94, 196, 182, ${d.o})`;
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
  });
  function cursorLoop() {
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    cursorDot.style.left = cx + 'px';
    cursorDot.style.top = cy + 'px';
    requestAnimationFrame(cursorLoop);
  }
  cursorLoop();

  document.querySelectorAll('a, button, .pill, .project-card, .code-card, .stat-card, .icon-card, .cert-card, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('hover'));
  });

  // Link/button variant: small filled ring with "view"/"open" feel
  document.querySelectorAll('.btn, .social-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('cursor-link'));
  });

  // Magnetic pull effect on primary buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const mx = e.clientX - rect.left - rect.width / 2;
      const my = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${mx * 0.18}px, ${my * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ============================================
   NAVBAR SCROLL + ACTIVE LINK
   ============================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navLinksContainer.classList.toggle('open');
});
navLinks.forEach(link => {
  link.addEventListener('click', () => navLinksContainer.classList.remove('open'));
});

const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === id);
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ============================================
   SCROLL-TRIGGERED FADE-INS
   ============================================ */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'MERN Stack Developer',
  'Competitive Programmer',
  'Software Developer Intern',
  'Problem Solver'
];
let twPhraseIndex = 0;
let twCharIndex = 0;
let twDeleting = false;

function typewriterTick() {
  const current = phrases[twPhraseIndex];
  if (!twDeleting) {
    twCharIndex++;
    typewriterEl.textContent = current.slice(0, twCharIndex);
    if (twCharIndex === current.length) {
      twDeleting = true;
      setTimeout(typewriterTick, 1600);
      return;
    }
    setTimeout(typewriterTick, 70);
  } else {
    twCharIndex--;
    typewriterEl.textContent = current.slice(0, twCharIndex);
    if (twCharIndex === 0) {
      twDeleting = false;
      twPhraseIndex = (twPhraseIndex + 1) % phrases.length;
      setTimeout(typewriterTick, 400);
      return;
    }
    setTimeout(typewriterTick, 35);
  }
}
typewriterTick();

/* ============================================
   CURSOR SPOTLIGHT ON CARDS
   ============================================ */
document.querySelectorAll('.code-card, .project-card-inner, .icon-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ============================================
   COUNT-UP NUMBERS
   ============================================ */
function animateCount(el, target, opts = {}) {
  const { suffix = '', decimal = false, duration = 1400 } = opts;
  const startTime = performance.now();
  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (decimal ? value.toFixed(2) : Math.floor(value)) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = (decimal ? target.toFixed(2) : target) + suffix;
    }
  }
  requestAnimationFrame(step);
}

const countEls = document.querySelectorAll('.stat-number');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimal = el.dataset.decimal === 'true';
      animateCount(el, target, { suffix, decimal });
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
countEls.forEach(el => countObserver.observe(el));

/* ============================================
   THREE.JS HERO BACKGROUND
   ============================================ */
(function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const hero = document.getElementById('hero');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, hero.clientWidth / hero.clientHeight, 0.1, 1000);
  camera.position.z = 26;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  // Central wireframe icosahedron — "engineering model"
  const geo = new THREE.IcosahedronGeometry(7, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x5ec4b6,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // Inner solid-ish core
  const coreGeo = new THREE.IcosahedronGeometry(3.2, 0);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xf4a259,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  scene.add(core);

  // Floating particle field
  const particleCount = 220;
  const particlesGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0x5ec4b6,
    size: 0.12,
    transparent: true,
    opacity: 0.5
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  function resize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    targetRotX += (mouseY * 0.4 - targetRotX) * 0.04;
    targetRotY += (mouseX * 0.4 - targetRotY) * 0.04;

    mesh.rotation.x = elapsed * 0.08 + targetRotX;
    mesh.rotation.y = elapsed * 0.12 + targetRotY;

    core.rotation.x = -elapsed * 0.15 - targetRotX;
    core.rotation.y = elapsed * 0.1 - targetRotY;

    particles.rotation.y = elapsed * 0.02;

    renderer.render(scene, camera);
  }
  animate();
})();

/* ============================================
   PROJECT CARD 3D TILT
   ============================================ */
document.querySelectorAll('[data-tilt]').forEach(card => {
  const inner = card.querySelector('.project-card-inner');
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
  });
  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
});

/* ============================================
   CODE CARD 3D TILT (Coding Profiles)
   ============================================ */
document.querySelectorAll('[data-tilt-card]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0)';
  });
});

/* ============================================
   ICON CARD 3D TILT (Skills)
   ============================================ */
document.querySelectorAll('[data-tilt-small]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
});

/* ============================================
   SCROLL-DRIVEN SECTION PARALLAX
   ============================================ */
const parallaxSections = document.querySelectorAll('.section-inner');
let lastScrollY = window.scrollY;
let parallaxTicking = false;

function updateParallax() {
  parallaxSections.forEach(el => {
    const rect = el.getBoundingClientRect();
    const viewportH = window.innerHeight;
    if (rect.top < viewportH && rect.bottom > 0) {
      const progress = (rect.top) / viewportH; // 1 at bottom entering, 0 at center, -ve when above
      const translate = progress * 24;
      el.style.transform = `translateY(${translate}px)`;
    }
  });
  parallaxTicking = false;
}

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
});
updateParallax();

/* ============================================
   LIVE CODING STATS
   ============================================ */

// --- GitHub ---
(async function loadGithub() {
  const note = document.getElementById('githubNote');
  const stats = document.querySelectorAll('#githubStats .cstat-num');
  const repoList = document.getElementById('githubRepos');
  try {
    const res = await fetch('https://api.github.com/users/Aryan-developer613');
    if (!res.ok) throw new Error('GitHub API error');
    const data = await res.json();
    const values = [data.public_repos, data.followers, data.following];
    stats.forEach((el, i) => {
      const target = values[i] || 0;
      el.dataset.target = target;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(el, target);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(el);
    });

    // Top repos by stars
    try {
      const reposRes = await fetch('https://api.github.com/users/Aryan-developer613/repos?sort=updated&per_page=100');
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const top = [...repos]
          .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)))
          .slice(0, 3);
        top.forEach(repo => {
          const row = document.createElement('a');
          row.className = 'repo-item';
          row.href = repo.html_url;
          row.target = '_blank';
          row.rel = 'noopener';
          const name = document.createElement('span');
          name.className = 'repo-name';
          name.textContent = repo.name;
          const meta = document.createElement('span');
          meta.className = 'repo-meta';
          meta.textContent = `★ ${repo.stargazers_count}`;
          row.appendChild(name);
          row.appendChild(meta);
          repoList.appendChild(row);
        });
      }
    } catch (e) { /* skip repo list */ }

  } catch (err) {
    note.textContent = 'Live data unavailable — visit profile';
    stats.forEach(el => el.textContent = '—');
  }
})();

// --- LeetCode ---
(async function loadLeetcode() {
  const note = document.getElementById('leetcodeNote');
  const stats = document.querySelectorAll('#leetcodeStats .cstat-num');
  const donut = document.getElementById('leetcodeDonut');

  const endpoints = [
    'https://leetcode-stats-api.herokuapp.com/aryans_logic',
    'https://alfa-leetcode-api.onrender.com/aryans_logic/solved'
  ];

  let data = null;
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const json = await res.json();
      if (json && (json.totalSolved !== undefined || json.solvedProblem !== undefined)) {
        data = json;
        break;
      }
    } catch (e) { /* try next */ }
  }

  if (!data) {
    note.textContent = 'Live data unavailable — visit profile';
    stats.forEach(el => el.textContent = '—');
    if (donut) donut.style.display = 'none';
    return;
  }

  const total = data.totalSolved ?? data.solvedProblem ?? 0;
  const easy = data.easySolved ?? data.easySolved ?? 0;
  const medium = data.mediumSolved ?? 0;
  const hard = data.hardSolved ?? 0;
  const values = [total, easy, medium, hard];

  stats.forEach((el, i) => {
    const target = values[i] || 0;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(el, target);
          drawDonut(donut, easy, medium, hard);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
  });

  // Badges based on solve count milestones
  const badgeWrap = document.getElementById('leetcodeBadges');
  const globalRankEl = document.getElementById('lcGlobalRank');
  const contestRatingEl = document.getElementById('lcContestRating');

  if (badgeWrap) {
    const milestones = [
      { threshold: 50, label: '50+ Solved', cls: 'badge-bronze' },
      { threshold: 100, label: '100+ Solved', cls: 'badge-silver' },
      { threshold: 200, label: '200+ Solved', cls: 'badge-gold' }
    ];
    milestones.forEach(m => {
      if (total >= m.threshold) {
        const b = document.createElement('span');
        b.className = 'badge ' + m.cls;
        b.textContent = m.label;
        badgeWrap.appendChild(b);
      }
    });
  }

  if (data.ranking && globalRankEl) {
    globalRankEl.textContent = '#' + data.ranking.toLocaleString();
  }

  // Try to fetch contest ranking data separately
  try {
    const contestRes = await fetch('https://alfa-leetcode-api.onrender.com/aryans_logic/contest');
    if (contestRes.ok) {
      const contestJson = await contestRes.json();
      const rating = contestJson.contestRating ?? contestJson.contestParticipation?.[0]?.rating;
      if (rating && contestRatingEl) {
        contestRatingEl.textContent = Math.round(rating);
      } else if (contestRatingEl) {
        contestRatingEl.textContent = 'Unrated';
      }
      const globalRanking = contestJson.contestGlobalRanking;
      if (globalRanking && globalRankEl && globalRankEl.textContent === '--') {
        globalRankEl.textContent = '#' + Number(globalRanking).toLocaleString();
      }
    } else if (contestRatingEl) {
      contestRatingEl.textContent = 'Unrated';
    }
  } catch (e) {
    if (contestRatingEl) contestRatingEl.textContent = 'Unrated';
  }

  if (globalRankEl && globalRankEl.textContent === '--') {
    globalRankEl.textContent = 'N/A';
  }
})();

function drawDonut(canvas, easy, medium, hard) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const total = easy + medium + hard;
  if (total === 0) { canvas.style.display = 'none'; return; }
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 38;
  const lineWidth = 12;
  const segments = [
    { value: easy, color: '#5ec4b6' },
    { value: medium, color: '#f4a259' },
    { value: hard, color: '#e76f51' }
  ];
  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    const sliceAngle = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'butt';
    ctx.stroke();
    startAngle += sliceAngle;
  });
}

// --- Codeforces ---
(async function loadCodeforces() {
  const note = document.getElementById('codeforcesNote');
  const ratingEl = document.querySelectorAll('#codeforcesStats .cstat-num')[0];
  const maxRatingEl = document.querySelectorAll('#codeforcesStats .cstat-num')[1];
  const rankEl = document.getElementById('cfRank');
  const contestsEl = document.getElementById('cfContests');
  const rankBar = document.getElementById('cfRankBar');
  const subWrap = document.getElementById('cfSubmissions');

  // Rating tier thresholds (Codeforces-style) for the progress bar
  const RATING_CEILING = 3000;

  try {
    const res = await fetch('https://codeforces.com/api/user.info?handles=aryan2025');
    const json = await res.json();
    if (json.status !== 'OK') throw new Error('CF user not found');
    const user = json.result[0];

    const rating = user.rating || 0;
    const maxRating = user.maxRating || 0;
    rankEl.textContent = user.rank ? user.rank.charAt(0).toUpperCase() + user.rank.slice(1) : 'Unrated';

    [ratingEl, maxRatingEl].forEach((el, i) => {
      const target = i === 0 ? rating : maxRating;
      if (!target) { el.textContent = '—'; return; }
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(el, target);
            obs.unobserve(el);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(el);
    });

    // Rating progress bar
    if (rankBar) {
      const fill = document.createElement('div');
      fill.className = 'cf-rank-bar-fill';
      const pct = Math.min(100, (rating / RATING_CEILING) * 100);
      rankBar.appendChild(fill);
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => { fill.style.width = pct + '%'; });
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(rankBar);
    }

    // Contest count
    try {
      const ratingRes = await fetch('https://codeforces.com/api/user.rating?handle=aryan2025');
      const ratingJson = await ratingRes.json();
      if (ratingJson.status === 'OK' && contestsEl) {
        const count = ratingJson.result.length;
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCount(contestsEl, count);
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.4 });
        obs.observe(contestsEl);
      } else if (contestsEl) {
        contestsEl.textContent = '0';
      }
    } catch (e) {
      if (contestsEl) contestsEl.textContent = '—';
    }

    // Recent submissions
    try {
      const subRes = await fetch('https://codeforces.com/api/user.status?handle=aryan2025&count=5');
      const subJson = await subRes.json();
      if (subJson.status === 'OK' && subJson.result.length) {
        subJson.result.forEach(sub => {
          const row = document.createElement('div');
          row.className = 'cf-row';
          const name = document.createElement('span');
          name.textContent = sub.problem.name;
          const verdict = document.createElement('span');
          verdict.textContent = sub.verdict;
          verdict.className = 'cf-verdict-' + sub.verdict;
          row.appendChild(name);
          row.appendChild(verdict);
          subWrap.appendChild(row);
        });
      } else {
        subWrap.textContent = 'No recent submissions found.';
      }
    } catch (e) {
      subWrap.textContent = '';
    }

  } catch (err) {
    note.textContent = 'Live data unavailable — visit profile';
    ratingEl.textContent = '—';
    maxRatingEl.textContent = '—';
    rankEl.textContent = '—';
    if (contestsEl) contestsEl.textContent = '—';
  }
})();

/* ============================================
   CONTACT FORM (EmailJS)
   ============================================ */
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// === EMAILJS CONFIG ===
// Replace these with your own EmailJS credentials from https://www.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById('contactSubmit');
  const originalText = submitBtn.textContent;

  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    showToast('Contact form not yet configured — see script.js comments.', true);
    return;
  }

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
    showToast('Message sent — thanks for reaching out!');
    contactForm.reset();
  } catch (err) {
    showToast('Something went wrong. Please email directly.', true);
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
