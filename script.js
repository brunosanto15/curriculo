(function () {
  const cv = window.CV;
  const $ = (sel) => document.querySelector(sel);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");

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
    if (e.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // ---------- render ----------
  const iniciais = cv.nome.split(" ").filter(Boolean);
  const sigla = (iniciais[0][0] + iniciais[iniciais.length - 1][0]).toUpperCase();
  $("#nav-logo").textContent = sigla;
  $("#hero-mark").textContent = sigla;
  $("#avatar").innerHTML = cv.foto ? `<img src="${esc(cv.foto)}" alt="${esc(cv.nome)}">` : esc(sigla);

  $("#hero-local").textContent = cv.localizacao;
  $("#hero-title").textContent = cv.titulo;
  // letras agrupadas por palavra (cada palavra é uma máscara) para o nome não quebrar no meio
  let n = 0;
  $("#hero-name").innerHTML = cv.nome
    .split(" ")
    .map(
      (palavra) =>
        `<span class="name-word">${[...palavra]
          .map((ch) => `<span class="char" style="animation-delay:${0.15 + n++ * 0.03}s">${esc(ch)}</span>`)
          .join("")}</span>`
    )
    .join(" ");

  const preenchido = (v) => v && !v.includes("[");
  const ctas = [
    preenchido(cv.links.linkedin) && `<a class="btn primary flip" href="${esc(cv.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`,
    preenchido(cv.links.github) && `<a class="btn flip" href="${esc(cv.links.github)}" target="_blank" rel="noopener">GitHub</a>`,
    preenchido(cv.links.email) && `<a class="btn flip" href="mailto:${esc(cv.links.email)}">E-mail</a>`
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

  // Formação e certificações viram uma única fila de cards na rolagem horizontal
  const itens = [
    ...cv.formacao.map((f) => ({ tag: "Formação", titulo: f.curso, sub: f.instituicao, meta: f.periodo, desc: f.descricao })),
    ...cv.certificacoes.map((c) => ({ tag: "Certificação", titulo: c.nome, sub: c.emissor, meta: "", desc: c.ano }))
  ];
  $("#formacao-cards").innerHTML = itens
    .map(
      (it, i) => `
    <article class="card hs-card">
      <p class="hs-num">${pad2(i + 1)}</p>
      <span class="tag">${esc(it.tag)}</span>
      <h3>${esc(it.titulo)}</h3>
      ${it.sub ? `<p class="empresa">${esc(it.sub)}</p>` : ""}
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
      ${it.meta ? `<div class="card-meta"><span>${esc(it.meta)}</span></div>` : ""}
    </article>`
    )
    .join("");
  $("#hs-progress").innerHTML = itens.map(() => "<span></span>").join("");

  $("#areas").innerHTML = cv.areas
    .map((a, i) => `<li class="reveal" style="transition-delay:${i * 0.1}s">${esc(a)}</li>`)
    .join("");

  $("#chips").innerHTML = cv.competencias
    .map((c, i) => `<span class="chip reveal" style="transition-delay:${i * 0.04}s">${esc(c)}</span>`)
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

  // ---------- letras que rolam no hover ----------
  document.querySelectorAll(".flip").forEach((el) => {
    const txt = el.textContent.trim();
    el.setAttribute("aria-label", txt);
    el.innerHTML = `<span class="flip-in" aria-hidden="true">${[...txt]
      .map((c, i) => `<span style="transition-delay:${i * 18}ms">${c === " " ? "&nbsp;" : esc(c)}</span>`)
      .join("")}</span>`;
  });

  // ---------- títulos com máscara, palavra por palavra ----------
  document.querySelectorAll(".split").forEach((el) => {
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w, i) => `<span class="mask"><span style="transition-delay:${i * 0.08}s">${esc(w)}</span></span>`)
      .join(" ");
  });

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
  document.querySelectorAll(".reveal, .split, .dashline").forEach((el) => io.observe(el));

  // ---------- rolagem horizontal da formação ----------
  const hs = $("#formacao");
  const hsViewport = hs.querySelector(".hscroll-viewport");
  const hsTrack = $("#formacao-cards");
  const hsCards = [...hsTrack.children];
  const hsBars = [...$("#hs-progress").children];
  const hsCount = $("#hs-count");
  let hsDist = 0, hsAtual = 0, hsAlvo = 0, hsRaf = null, hsAtivo = -1;

  function hsLayout() {
    // distância horizontal a percorrer = largura da fila além da área visível
    hsDist = Math.max(0, hsTrack.scrollWidth - hsViewport.clientWidth);
    hs.style.height = window.innerHeight + hsDist * 1.2 + "px";
  }
  function hsAnimar() {
    // movimento suavizado: a fila "persegue" a posição do scroll em vez de pular direto
    hsAtual += (hsAlvo - hsAtual) * 0.1;
    if (Math.abs(hsAlvo - hsAtual) < 0.5 || reduceMotion) hsAtual = hsAlvo;
    hsTrack.style.transform = `translate3d(${-hsAtual}px,0,0)`;
    hsRaf = hsAtual !== hsAlvo ? requestAnimationFrame(hsAnimar) : null;
  }
  function hsAtivar(i) {
    if (i === hsAtivo) return;
    hsAtivo = i;
    hsCards.forEach((c, k) => c.classList.toggle("is-active", k === i));
    hsBars.forEach((b, k) => b.classList.toggle("is-active", k === i));
    hsCount.textContent = `${pad2(i + 1)} / ${pad2(hsCards.length)}`;
  }

  // ---------- efeitos ligados à posição do scroll ----------
  const bar = $("#progress-bar");
  const nav = $("#nav");
  const parallax = document.querySelectorAll("[data-speed]");
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
      parallax.forEach((el) => (el.style.transform = `translateY(${y * el.dataset.speed}px)`));
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

    // Formação: rolagem vertical vira deslocamento horizontal
    const h = hs.getBoundingClientRect();
    const pH = clamp(-h.top / (h.height - vh));
    hsAlvo = pH * hsDist;
    hsAtivar(Math.round(pH * (hsCards.length - 1)));
    if (!hsRaf) hsRaf = requestAnimationFrame(hsAnimar);

    // Link ativo no menu
    let ativo = -1;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < vh * 0.4) ativo = i; });
    navLinks.forEach((a, i) => a.classList.toggle("active", i === ativo));

    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", () => { hsLayout(); onScroll(); });
  hsLayout();
  onScroll();
  // as fontes mudam a largura dos cards; recalcula quando terminarem de carregar
  if (document.fonts) document.fonts.ready.then(() => { hsLayout(); onScroll(); });
})();
