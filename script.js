(function () {
  const cv = window.CV;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- tema ----------
  const root = document.documentElement;
  try {
    const saved = localStorage.getItem("tema");
    if (saved) root.dataset.theme = saved;
  } catch (e) {}
  $("#theme-btn").addEventListener("click", () => {
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
  });

  // ---------- menu mobile ----------
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // ---------- render ----------
  const iniciais = cv.nome.split(" ").filter(Boolean);
  $("#nav-logo").textContent = (iniciais[0][0] + iniciais[iniciais.length - 1][0]).toUpperCase();
  $("#avatar").innerHTML = cv.foto
    ? `<img src="${esc(cv.foto)}" alt="${esc(cv.nome)}">`
    : esc($("#nav-logo").textContent);

  $("#hero-mark").textContent = $("#nav-logo").textContent;
  $("#hero-local").textContent = cv.localizacao;
  $("#hero-title").textContent = cv.titulo;
  // letras agrupadas por palavra para o nome não quebrar no meio de uma palavra
  let n = 0;
  $("#hero-name").innerHTML = cv.nome
    .split(" ")
    .map(
      (palavra) =>
        `<span class="name-word">${[...palavra]
          .map((ch) => `<span class="char" style="animation-delay:${0.2 + n++ * 0.035}s">${esc(ch)}</span>`)
          .join("")}</span>`
    )
    .join(" ");

  const preenchido = (v) => v && !v.includes("[");
  const ctas = [
    preenchido(cv.links.linkedin) && `<a class="btn primary" href="${esc(cv.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    preenchido(cv.links.github) && `<a class="btn" href="${esc(cv.links.github)}" target="_blank" rel="noopener">GitHub</a>`,
    preenchido(cv.links.email) && `<a class="btn" href="mailto:${esc(cv.links.email)}">E-mail</a>`
  ].filter(Boolean).join("");
  $("#hero-cta").innerHTML = ctas;
  $("#contato-cta").innerHTML = ctas;

  $("#sobre-text").innerHTML = cv.sobre
    .split(/\s+/)
    .map((w) => `<span class="word">${esc(w)}</span>`)
    .join(" ");

  $("#fatos").innerHTML = (cv.fatos || [])
    .map((f, i) => `<div class="reveal" style="transition-delay:${0.2 + i * 0.08}s"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`)
    .join("");

  $("#numeros").innerHTML = cv.numeros
    .map(
      (n, i) => `
      <div class="numero reveal" style="transition-delay:${i * 0.12}s">
        <strong><span data-count="${Number(n.valor)}" data-decimals="${Number(n.casas) || 0}">0</span>${n.sufixo ? `<sup class="sufixo">${esc(n.sufixo)}</sup>` : ""}</strong>
        <span>${esc(n.rotulo)}</span>
      </div>`
    )
    .join("");

  $("#timeline").insertAdjacentHTML(
    "beforeend",
    cv.experiencias
      .map(
        (x, i) => `
      <div class="tl-item reveal ${i % 2 ? "from-right" : "from-left"}">
        <span class="tl-dot"></span>
        <article class="card">
          <div class="card-meta"><span>${esc(x.periodo)}</span><span>${esc(x.local)}</span></div>
          <h3>${esc(x.cargo)}</h3>
          <p class="empresa">${esc(x.empresa)}</p>
          <p>${esc(x.descricao)}</p>
          ${x.destaques?.length ? `<ul>${x.destaques.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
        </article>
      </div>`
      )
      .join("")
  );

  const formacao = cv.formacao.map(
    (f) => `
    <article class="card reveal">
      <span class="tag">Formação</span>
      <h3>${esc(f.curso)}</h3>
      <p class="empresa">${esc(f.instituicao)}</p>
      <div class="card-meta"><span>${esc(f.periodo)}</span></div>
      ${f.descricao ? `<p>${esc(f.descricao)}</p>` : ""}
    </article>`
  );
  const certs = cv.certificacoes.map(
    (c) => `
    <article class="card reveal">
      <span class="tag">Certificação</span>
      <h3>${esc(c.nome)}</h3>
      <p class="empresa">${esc(c.emissor)}</p>
      ${c.ano ? `<div class="card-meta"><span>${esc(c.ano)}</span></div>` : ""}
    </article>`
  );
  $("#formacao-cards").innerHTML = [...formacao, ...certs]
    .map((html, i) => html.replace('class="card reveal"', `class="card reveal" style="transition-delay:${i * 0.1}s"`))
    .join("");

  $("#areas").innerHTML = cv.areas
    .map((a, i) => `<li class="reveal" style="transition-delay:${i * 0.1}s">${esc(a)}</li>`)
    .join("");

  $("#chips").innerHTML = cv.competencias
    .map((c, i) => `<span class="chip reveal" style="transition-delay:${i * 0.05}s">${esc(c)}</span>`)
    .join("");

  $("#skills-bars").innerHTML = cv.idiomas
    .map(
      (l) => `
      <div class="skill reveal">
        <div class="skill-head"><span>${esc(l.idioma)}</span><span>${esc(l.rotulo)}</span></div>
        <div class="skill-bar"><span data-level="${Number(l.nivel)}"></span></div>
      </div>`
    )
    .join("");

  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${cv.nome}`;

  // ---------- efeito de digitação ----------
  const typed = $("#typed");
  if (reduceMotion || !cv.frases.length) {
    typed.textContent = cv.frases[0] || "";
  } else {
    let f = 0, c = 0, apagando = false;
    (function tick() {
      const frase = cv.frases[f];
      c += apagando ? -1 : 1;
      typed.textContent = frase.slice(0, c);
      let delay = apagando ? 35 : 75;
      if (!apagando && c === frase.length) { apagando = true; delay = 1600; }
      else if (apagando && c === 0) { apagando = false; f = (f + 1) % cv.frases.length; delay = 300; }
      setTimeout(tick, delay);
    })();
  }

  // ---------- contadores ----------
  function contar(el) {
    const alvo = Number(el.dataset.count);
    const casas = Number(el.dataset.decimals);
    const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
    if (reduceMotion) { el.textContent = fmt(alvo); return; }
    const inicio = performance.now();
    const dur = 1400;
    (function frame(t) {
      const p = Math.min((t - inicio) / dur, 1);
      el.textContent = fmt(alvo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    })(inicio);
  }

  // ---------- revelar ao entrar na tela ----------
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("visible");
        el.querySelectorAll("[data-count]").forEach(contar);
        el.querySelectorAll("[data-level]").forEach((b) => (b.style.width = b.dataset.level + "%"));
        io.unobserve(el);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // ---------- efeitos ligados à posição do scroll ----------
  const bar = $("#progress-bar");
  const nav = $("#nav");
  const blobs = document.querySelectorAll("[data-speed]");
  const sobre = $("#sobre");
  const sobreText = $("#sobre-text");
  const words = sobre.querySelectorAll(".word");
  const sobreFixo = window.matchMedia("(min-width: 761px)");
  const timeline = $("#timeline");
  const fill = $("#timeline-fill");
  const navLinks = [...links.querySelectorAll("a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));
  const clamp = (v) => Math.max(0, Math.min(1, v));

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("scrolled", y > 40);

    if (!reduceMotion) {
      blobs.forEach((b) => (b.style.transform = `translateY(${y * b.dataset.speed}px)`));
    }

    // Sobre: acende palavra por palavra enquanto a seção fica fixa (no celular, enquanto o texto cruza a tela)
    let pSobre;
    if (sobreFixo.matches) {
      const r = sobre.getBoundingClientRect();
      pSobre = clamp((-r.top / (r.height - vh)) * 1.25);
    } else {
      const r = sobreText.getBoundingClientRect();
      pSobre = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    }
    const acesas = Math.round(pSobre * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < acesas));

    // Linha da timeline cresce conforme o centro da tela avança
    const t = timeline.getBoundingClientRect();
    fill.style.transform = `scaleY(${clamp((vh * 0.6 - t.top) / t.height)})`;

    // Link ativo no menu
    let ativo = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * 0.4) ativo = i; });
    navLinks.forEach((a, i) => a.classList.toggle("active", i === ativo));

    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
