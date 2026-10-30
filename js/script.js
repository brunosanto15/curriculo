(function () {
  const cv = window.CV;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const temMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad2 = (n) => String(n).padStart(2, "0");
  const clamp = (v) => Math.max(0, Math.min(1, v));
  const icone = (id, cls = "i") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const preenchido = (v) => v && !String(v).includes("[");

  // ---------- tema (o valor salvo já foi aplicado no <head>) ----------
  const root = document.documentElement;
  $("#theme-btn").addEventListener("click", () => {
    // o padrão é o claro; o escuro só existe quando a pessoa escolhe
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
  });

  // ---------- menu mobile ----------
  const nav = $("#nav");
  const toggle = $("#nav-toggle");
  const links = $("#nav-links");
  function menuAberto(sim) {
    links.classList.toggle("open", sim);
    nav.classList.toggle("menu-aberto", sim);
    toggle.setAttribute("aria-expanded", sim);
    toggle.setAttribute("aria-label", sim ? "Fechar menu" : "Abrir menu");
  }
  toggle.addEventListener("click", () => menuAberto(!links.classList.contains("open")));
  links.addEventListener("click", (e) => { if (e.target.closest("a")) menuAberto(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && links.classList.contains("open")) { menuAberto(false); toggle.focus(); } });

  // ---------- links ----------
  const L = cv.links;
  const wa = preenchido(L.whatsapp)
    ? `https://wa.me/${String(L.whatsapp).replace(/\D/g, "")}` + (L.whatsappMensagem ? `?text=${encodeURIComponent(L.whatsappMensagem)}` : "")
    : "";
  const redes = [
    preenchido(L.linkedin) && { id: "in", nome: "LinkedIn", url: L.linkedin },
    preenchido(L.github) && { id: "gh", nome: "GitHub", url: L.github },
    wa && { id: "wa", nome: "WhatsApp", url: wa }
  ].filter(Boolean);
  const externo = 'target="_blank" rel="noopener"';

  $("#nav-social").innerHTML = redes
    .map((r) => `<a class="ico" href="${esc(r.url)}" ${externo} aria-label="${r.nome}" title="${r.nome}">${icone(r.id)}</a>`)
    .join("");

  // ---------- topo ----------
  const partes = cv.nome.split(" ").filter(Boolean);
  const sigla = (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  $("#nav-logo").textContent = sigla;
  $(".capa-mark").textContent = sigla;
  const avatar = $("#avatar");
  avatar.textContent = sigla;
  if (cv.foto) {
    const img = new Image();
    img.alt = `Foto de ${cv.nome}`;
    img.onload = () => avatar.replaceChildren(img);
    img.src = cv.foto;
  }

  $("#hero-local").textContent = cv.localizacao;
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
  // nome em uma linha: começa no tamanho máximo e encolhe até caber na largura disponível
  const heroName = $("#hero-name");
  function ajustarNome() {
    const max = 4.4 * parseFloat(getComputedStyle(root).fontSize);
    const min = 20;
    heroName.style.whiteSpace = "nowrap";
    heroName.style.fontSize = max + "px";
    const disp = heroName.clientWidth;
    const largura = heroName.scrollWidth;
    const fs = largura > disp ? (max * disp) / largura - 0.5 : max;
    heroName.style.fontSize = Math.max(min, fs) + "px";
    // em telas estreitíssimas, melhor quebrar do que ficar ilegível
    if (fs < min) heroName.style.whiteSpace = "normal";
  }
  ajustarNome();
  window.addEventListener("resize", ajustarNome);
  if (document.fonts) document.fonts.ready.then(ajustarNome);
  $("#hero-chamada").textContent = cv.chamada;
  $("#hero-resumo").textContent = cv.resumo;
  $("#hero-status").textContent = cv.status;

  const btnWa = (cls) =>
    wa ? `<a class="btn ${cls} mag" href="${esc(wa)}" ${externo}>${icone("wa")}<span class="flip">Chamar no WhatsApp</span></a>` : "";
  $("#hero-cta").innerHTML = [
    `<a class="btn btn-p mag" href="#experiencia"><span class="flip">Ver experiência</span>${icone("seta", "i seta")}</a>`,
    btnWa(""),
    preenchido(L.linkedin) && `<a class="btn mag" href="${esc(L.linkedin)}" ${externo}>${icone("in")}<span class="flip">LinkedIn</span></a>`
  ].filter(Boolean).join("");

  const ficha = $("#ficha");
  $("#ficha-dl").innerHTML = cv.ficha
    .map((f, i) => `<div style="--d:${i}"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`)
    .join("");
  ficha.setAttribute("aria-label", "Resumo: " + cv.ficha.map((f) => `${f.k}: ${f.v}`).join("; "));

  // ---------- sobre ----------
  $("#sobre-text").innerHTML = cv.sobre
    .split(/\s+/)
    .map((w) => `<span class="word">${esc(w)}</span>`)
    .join(" ");
  $("#fatos").innerHTML = (cv.fatos || [])
    .map((f) => `<div class="reveal"><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`)
    .join("");
  $("#chips").innerHTML = cv.competencias.map((c) => `<li class="reveal">${esc(c)}</li>`).join("");

  // ---------- capacidades: lista + painel em destaque ----------
  const CAPS = cv.capacidades;
  const capsEl = $("#caps");
  const capsLista = $("#caps-lista");
  const capsPainel = $("#caps-painel");
  capsLista.innerHTML = CAPS.map(
    (c, i) => `
      <button class="cl" type="button" role="tab" id="cl-${i}" aria-controls="caps-painel" aria-selected="false" tabindex="-1">
        <span class="cl-num">${pad2(i + 1)}</span>
        <span class="cl-t">${esc(c.titulo)}</span>
        <span class="cl-onde">${esc(c.onde || "")}</span>
        <span class="cl-txt"><span>${esc(c.texto)}</span></span>
        <span class="cl-prog" aria-hidden="true"><i></i></span>
      </button>`
  ).join("");
  const capsBtns = $$(".cl", capsLista);
  let capAtual = -1;
  function ativarCap(i, foco) {
    i = (i + CAPS.length) % CAPS.length;
    const c = CAPS[i];
    capsBtns.forEach((b, k) => {
      b.setAttribute("aria-selected", k === i);
      b.tabIndex = k === i ? 0 : -1;
    });
    capsPainel.setAttribute("aria-labelledby", `cl-${i}`);
    if (i !== capAtual) {
      capsPainel.innerHTML = `
        <div class="cp-in">
          <span class="cp-n" aria-hidden="true">${pad2(i + 1)}</span>
          <span class="cp-ico">${icone(c.icone)}</span>
          <div class="cp-txt">
            <p class="cp-k mono">${pad2(i + 1)} / ${pad2(CAPS.length)}</p>
            <h4>${esc(c.titulo)}</h4>
            <p>${esc(c.texto)}</p>
            ${c.onde ? `<small>ex.: ${esc(c.onde)}</small>` : ""}
          </div>
        </div>`;
    }
    capAtual = i;
    // reinicia o cronômetro do item ativo
    const barra = $(".cl-prog i", capsBtns[i]);
    barra.style.animation = "none";
    void barra.offsetWidth;
    barra.style.animation = "";
    if (foco) capsBtns[i].focus();
  }
  // avanço automático: só no desktop, só com a seção na tela, e para de vez quando a pessoa escolhe um item
  const capsAuto = !reduceMotion && window.matchMedia("(min-width: 961px)").matches;
  let capsEscolhido = false;
  function escolherCap(i, foco) {
    capsEscolhido = true;
    capsEl.classList.remove("rodando");
    ativarCap(i, foco);
  }
  capsBtns.forEach((b, i) => b.addEventListener("click", () => escolherCap(i)));
  capsLista.addEventListener("keydown", (e) => {
    const mapa = { ArrowDown: capAtual + 1, ArrowRight: capAtual + 1, ArrowUp: capAtual - 1, ArrowLeft: capAtual - 1, Home: 0, End: CAPS.length - 1 };
    if (e.key in mapa) { e.preventDefault(); escolherCap(mapa[e.key], true); }
  });
  capsLista.addEventListener("animationend", (e) => {
    if (e.animationName === "tempo" && capsEl.classList.contains("rodando")) ativarCap(capAtual + 1);
  });
  if (capsAuto) {
    new IntersectionObserver(([e]) => {
      capsEl.classList.toggle("rodando", e.isIntersecting && !capsEscolhido);
    }, { threshold: 0.4 }).observe(capsEl);
  }
  ativarCap(0);
  $("#caps-dica").textContent = capsAuto
    ? `${CAPS.length} capacidades · passam sozinhas · clique em uma para fixar`
    : `${CAPS.length} capacidades · toque em uma para abrir`;

  const icDif = ["escudo", "capelo", "financas", "globo"];
  $("#dif").innerHTML = cv.diferenciais
    .map(
      (d, i) => `
      <li class="reveal">
        <span class="dif-ico">${icone(icDif[i % icDif.length])}</span>
        <div><b>${esc(d.titulo)}</b><span>${esc(d.texto)}</span></div>
      </li>`
    )
    .join("");
  $("#idiomas").innerHTML = cv.idiomas
    .map(
      (l) => `
      <div class="reveal">
        <div class="skill-head"><span>${esc(l.idioma)}</span><span>${esc(l.rotulo)}</span></div>
        <div class="skill-bar"><span data-level="${Number(l.nivel)}"></span></div>
      </div>`
    )
    .join("");

  // ---------- números e letreiro ----------
  $("#numeros").innerHTML = cv.numeros
    .map(
      (x) => `
      <div class="pv reveal">
        <strong><span data-count="${Number(x.valor)}" data-decimals="${Number(x.casas) || 0}">0</span>${x.sufixo ? `<sup>${esc(x.sufixo)}</sup>` : ""}</strong>
        <p>${esc(x.rotulo)}</p>
        ${x.link ? `<a href="${esc(x.link)}">${esc(x.acao || "ver mais")}${icone("seta")}</a>` : ""}
      </div>`
    )
    .join("");

  const trilho = $("#trilho");
  const umaVolta = cv.competencias.map((c) => `<span>${esc(c)}</span>`).join("");
  trilho.innerHTML = umaVolta + umaVolta; // duas cópias: quando a primeira sai, a segunda está no lugar

  // ---------- experiência (abas) ----------
  const exps = cv.experiencias;
  const abas = $("#abas");
  abas.innerHTML =
    exps
      .map(
        (x, i) => `
      <button class="aba" role="tab" type="button" id="tab-${i}" aria-controls="painel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">
        <span class="aba-ico">${icone("maleta")}</span>
        <span><b>${esc(x.empresa)}</b><small>${esc(x.periodo)}</small></span>
      </button>`
      )
      .join("") + `<span class="abas-ind" aria-hidden="true"></span>`;

  $("#paineis").innerHTML = exps
    .map(
      (x, i) => `
      <div class="painel" role="tabpanel" id="painel-${i}" aria-labelledby="tab-${i}" tabindex="0"${i ? " hidden" : ""}>
        <article class="exp spot">
          <div>
            <p class="exp-meta mono">
              ${/atual/i.test(x.periodo) ? `<span class="selo-atual"><i></i>atual</span>` : ""}
              <span>${esc(x.periodo)}</span><span>${esc(x.local)}</span>
            </p>
            <h3>${esc(x.cargo)}</h3>
            <p class="exp-empresa">${esc(x.empresa)}</p>
            ${x.descricao ? `<p class="exp-desc">${esc(x.descricao)}</p>` : ""}
            <ul class="exp-lista">${(x.destaques || []).map((d, k) => `<li style="--d:${k}">${icone("ok")}<span>${esc(d)}</span></li>`).join("")}</ul>
          </div>
          <aside class="exp-lado">
            <span class="exp-num" aria-hidden="true">${pad2(i + 1)}</span>
            ${x.tags?.length ? `<p class="mono">competências</p><ul class="tags">${x.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </aside>
        </article>
      </div>`
    )
    .join("");

  const tabs = $$(".aba", abas);
  const paineis = $$(".painel");
  const ind = $(".abas-ind", abas);
  const prox = $("#aba-prox");
  let abaAtual = 0;
  function moverIndicador() {
    const t = tabs[abaAtual];
    ind.style.width = t.offsetWidth - 18 + "px";
    ind.style.transform = `translateX(${t.offsetLeft}px)`;
  }
  function ativarAba(i, foco) {
    abaAtual = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => {
      t.setAttribute("aria-selected", k === abaAtual);
      t.tabIndex = k === abaAtual ? 0 : -1;
    });
    paineis.forEach((p, k) => {
      p.hidden = k !== abaAtual;
      p.classList.remove("entra");
    });
    void paineis[abaAtual].offsetWidth; // reinicia a animação de entrada
    paineis[abaAtual].classList.add("entra");
    if (foco) tabs[abaAtual].focus();
    // só a fileira de abas rola na horizontal (scrollIntoView rolaria a página inteira)
    abas.scrollTo({ left: Math.max(0, tabs[abaAtual].offsetLeft - 16), behavior: reduceMotion ? "auto" : "smooth" });
    moverIndicador();
    const seguinte = exps[(abaAtual + 1) % exps.length];
    prox.innerHTML = `<span>${abaAtual + 1} de ${exps.length}</span><span>Próxima: ${esc(seguinte.empresa)}</span>${icone("seta")}`;
  }
  tabs.forEach((t, i) => t.addEventListener("click", () => ativarAba(i)));
  abas.addEventListener("keydown", (e) => {
    const mapa = { ArrowRight: abaAtual + 1, ArrowLeft: abaAtual - 1, Home: 0, End: tabs.length - 1 };
    if (e.key in mapa) { e.preventDefault(); ativarAba(mapa[e.key], true); }
  });
  prox.addEventListener("click", () => ativarAba(abaAtual + 1));
  if (exps.length < 2) prox.hidden = true;
  ativarAba(0);
  paineis[0].classList.remove("entra");

  // ---------- formação (linha do tempo) ----------
  $("#tl-lista").innerHTML = cv.formacao
    .map(
      (f) => `
      <li class="reveal">
        <p class="d mono">${esc(f.periodo)}</p>
        <h3>${esc(f.curso)}</h3>
        <p class="inst">${esc(f.instituicao)}</p>
        ${f.descricao ? `<p>${esc(f.descricao)}</p>` : ""}
      </li>`
    )
    .join("");

  // ---------- certificações: as que têm imagem ficam em destaque, o resto em "ver mais" ----------
  const destaque = cv.certificacoes.filter((c) => c.imagem);
  const resto = cv.certificacoes.filter((c) => !c.imagem);
  const subCert = (c) => [c.emissor, c.ano].filter(Boolean).map(esc).join(" · ");
  $("#cert-top").innerHTML = destaque
    .map(
      (c, i) => `
      <button class="cert spot reveal" type="button" data-i="${i}" aria-label="Ver certificado: ${esc(c.nome)}">
        <span class="cert-mini">
          <img src="${esc(c.imagem)}" alt="" loading="lazy">
          <span class="cert-lupa">${icone("lupa")}</span>
        </span>
        <span class="cert-txt">
          <b>${esc(c.nome)}</b>
          ${subCert(c) ? `<small>${subCert(c)}</small>` : ""}
          ${c.detalhe ? `<small>${esc(c.detalhe)}</small>` : ""}
          <span class="cert-ver">ver certificado ${icone("lupa")}</span>
        </span>
      </button>`
    )
    .join("");
  $("#cert-lista").innerHTML = resto
    .map(
      (c) => `<li><b>${esc(c.nome)}</b>${subCert(c) || c.detalhe ? `<small>${[subCert(c), esc(c.detalhe)].filter(Boolean).join(" · ")}</small>` : ""}</li>`
    )
    .join("");

  const certBtn = $("#cert-btn");
  const certMais = $("#cert-mais");
  const rotuloCert = (aberto) =>
    aberto ? "Ver menos" : `Ver mais ${resto.length} ${resto.length === 1 ? "certificação" : "certificações"}`;
  certBtn.innerHTML = `<span>${rotuloCert(false)}</span>${icone("baixo")}`;
  if (!resto.length) certBtn.hidden = true;
  certBtn.addEventListener("click", () => {
    const abrir = certBtn.getAttribute("aria-expanded") !== "true";
    certBtn.setAttribute("aria-expanded", abrir);
    certBtn.firstElementChild.textContent = rotuloCert(abrir);
    // anima a altura de 0 até o conteúdo (ou o inverso) e depois devolve "auto"
    if (abrir) certMais.hidden = false;
    if (reduceMotion) { certMais.hidden = !abrir; return; }
    const alto = certMais.scrollHeight;
    certMais.style.height = (abrir ? 0 : alto) + "px";
    void certMais.offsetHeight;
    certMais.style.height = (abrir ? alto : 0) + "px";
    clearTimeout(certMais._t);
    certMais._t = setTimeout(() => {
      certMais.style.height = "";
      if (!abrir) certMais.hidden = true;
    }, 520);
  });

  // ---------- contato ----------
  $("#contato-sub").textContent = cv.contato;
  $("#contato-acoes").innerHTML = [
    btnWa("btn-p"),
    preenchido(L.email) &&
      `<span class="email-pill">
        <a href="mailto:${esc(L.email)}">${icone("mail")}<span>${esc(L.email)}</span></a>
        <button type="button" id="copiar" aria-label="Copiar e-mail" title="Copiar e-mail">${icone("copia")}</button>
      </span>`
  ].filter(Boolean).join("");
  $("#contato-links").innerHTML = redes
    .filter((r) => r.id !== "wa")
    .map((r) => `<a href="${esc(r.url)}" ${externo}>${icone(r.id)}<span class="flip">${r.nome}</span></a>`)
    .join("");

  $("#footer-text").textContent = `© ${new Date().getFullYear()} ${cv.nome} · ${cv.localizacao}`;

  // ---------- copiar e-mail ----------
  const toast = $("#toast");
  function avisar(msg) {
    toast.textContent = msg;
    toast.classList.add("on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("on"), 2200);
  }
  async function copiarTexto(txt) {
    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch (e) {
      // reserva para quando a API não está disponível (ex.: arquivo aberto direto do disco)
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) {}
      ta.remove();
      return ok;
    }
  }
  const copiar = $("#copiar");
  if (copiar) {
    copiar.addEventListener("click", async () => {
      const ok = await copiarTexto(L.email);
      avisar(ok ? "E-mail copiado" : L.email);
      if (!ok) return;
      copiar.innerHTML = icone("ok");
      setTimeout(() => (copiar.innerHTML = icone("copia")), 1800);
    });
  }

  // ---------- letras que rolam no hover ----------
  $$(".flip").forEach((el) => {
    const txt = el.textContent.trim();
    el.innerHTML =
      `<span class="sr">${esc(txt)}</span><span class="flip-in" aria-hidden="true">${[...txt]
        .map((c, i) => `<span style="transition-delay:${i * 18}ms">${c === " " ? "&nbsp;" : esc(c)}</span>`)
        .join("")}</span>`;
  });

  // ---------- títulos com máscara, palavra por palavra ----------
  $$(".split").forEach((el) => {
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
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  $$(".reveal").forEach((el) => {
    // atraso em cascata só entre irmãos: um card não espera a página inteira
    const irmao = el.parentNode ? [...el.parentNode.children].indexOf(el) : 0;
    el.style.transitionDelay = Math.min(irmao, 6) * 70 + "ms";
  });
  $$(".reveal, .split, .sec-h").forEach((el) => io.observe(el));

  // ---------- botões magnéticos, card inclinado e luz que segue o ponteiro ----------
  if (temMouse && !reduceMotion) {
    $$(".mag").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      b.addEventListener("pointerleave", () => (b.style.transform = ""));
    });

    $$(".tilt").forEach((c) => {
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -7}deg) rotateY(${(px - 0.5) * 7}deg)`;
        c.style.setProperty("--mx", px * 100 + "%");
        c.style.setProperty("--my", py * 100 + "%");
      });
      c.addEventListener("pointerleave", () => (c.style.transform = ""));
    });

    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".spot");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    }, { passive: true });
  }

  // ---------- capa: gráfico decorativo que se desenha; a mira segue o ponteiro ----------
  const capa = $("#capa");
  const capaSvg = $("#capa-svg");
  const W = 1600, H = 360, PASSO = 16;
  let semente = 11;
  const aleatorio = () => (semente = (semente * 16807) % 2147483647) / 2147483647;
  const pts = [];
  for (let x = 0, y = 262; x <= W; x += PASSO) {
    y = Math.max(70, Math.min(300, y + (aleatorio() - 0.56) * 26));
    pts.push([x, +y.toFixed(1)]);
  }
  const linha = "M" + pts.map((p) => p.join(",")).join(" L");
  const fim = pts[pts.length - 1];
  const grade =
    Array.from({ length: W / 100 + 1 }, (_, i) => `<line x1="${i * 100}" x2="${i * 100}" y1="0" y2="${H}"/>`).join("") +
    Array.from({ length: H / 60 + 1 }, (_, i) => `<line x1="0" x2="${W}" y1="${i * 60}" y2="${i * 60}"/>`).join("");
  capaSvg.innerHTML = `
    <defs><linearGradient id="cp-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient></defs>
    <g class="cp-grade">${grade}</g>
    <line class="cp-base" x1="0" x2="${W}" y1="${pts[0][1]}" y2="${pts[0][1]}"/>
    <path class="cp-area" d="${linha} L${W},${H} L0,${H} Z" fill="url(#cp-grad)"/>
    <path class="cp-linha" d="${linha}" pathLength="1"/>
    <circle class="cp-pulso" cx="${fim[0] - 40}" cy="${fim[1]}" r="5"/>
    <circle class="cp-fim" cx="${fim[0] - 40}" cy="${fim[1]}" r="5"/>
    <g class="cp-mira">
      <line class="cp-mira-v" x1="0" x2="0" y1="0" y2="${H}"/>
      <line class="cp-mira-h" x1="0" x2="${W}" y1="0" y2="0"/>
      <circle class="cp-halo" r="14"/><circle class="cp-ponto" r="4.5"/>
    </g>`;
  if (temMouse && !reduceMotion) {
    const mira = $(".cp-mira", capaSvg);
    const [mv, mh] = $$("line", mira);
    const circulos = $$("circle", mira);
    const pt = capaSvg.createSVGPoint();
    capa.addEventListener("pointermove", (e) => {
      pt.x = e.clientX; pt.y = e.clientY;
      const x = Math.max(0, Math.min(W, pt.matrixTransform(capaSvg.getScreenCTM().inverse()).x));
      // valor da linha nessa posição (interpolado entre os dois pontos vizinhos)
      const k = Math.min(pts.length - 2, Math.floor(x / PASSO));
      const y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * ((x - pts[k][0]) / PASSO);
      mv.setAttribute("x1", x); mv.setAttribute("x2", x);
      mh.setAttribute("y1", y); mh.setAttribute("y2", y);
      circulos.forEach((c) => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
      capa.classList.add("mirando");
    });
    capa.addEventListener("pointerleave", () => capa.classList.remove("mirando"));
  }

  // ---------- capacidades: número e ícone do painel seguem o mouse em sentidos opostos ----------
  if (temMouse && !reduceMotion) {
    capsPainel.addEventListener("pointermove", (e) => {
      const r = capsPainel.getBoundingClientRect();
      capsPainel.style.setProperty("--px", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      capsPainel.style.setProperty("--py", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    capsPainel.addEventListener("pointerleave", () => {
      capsPainel.style.setProperty("--px", 0);
      capsPainel.style.setProperty("--py", 0);
    });
  }

  // ---------- visualizador de certificados ----------
  const lb = $("#lb");
  const lbImg = $("#lb-img");
  const certCards = $$("#cert-top .cert");
  const lbBotoes = () => $$("button, a", lb);
  let lbI = 0;
  function lbPreencher(i) {
    const c = destaque[i];
    lbImg.src = c.imagem;
    lbImg.alt = `Certificado: ${c.nome}`;
    $("#lb-nome").textContent = c.nome;
    $("#lb-sub").textContent = [c.emissor, c.ano].filter(Boolean).join(" · ");
    $("#lb-cont").textContent = `${i + 1} / ${destaque.length}`;
    $("#lb-orig").href = c.imagem;
  }
  // a imagem "voa" da miniatura até o centro (e volta ao fechar)
  function lbVoar(i, entrando) {
    const mini = certCards[i] && $("img", certCards[i]);
    if (!mini || reduceMotion || !lbImg.animate) return Promise.resolve();
    const a = mini.getBoundingClientRect();
    const b = lbImg.getBoundingClientRect();
    if (!b.width) return Promise.resolve();
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    const anim = lbImg.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(${a.width / b.width})`, opacity: 0.5 }, { transform: "none", opacity: 1 }],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)", direction: entrando ? "normal" : "reverse", fill: "both" }
    );
    return anim.finished.catch(() => {});
  }
  function lbAbrir(i) {
    lbI = i;
    lbPreencher(i);
    lb.classList.toggle("um", destaque.length < 2);
    lb.hidden = false;
    document.body.classList.add("lb-aberto");
    $("#lb-x").focus({ preventScroll: true });
    (lbImg.decode ? lbImg.decode() : Promise.resolve()).catch(() => {}).then(() => {
      lb.classList.add("on");
      lbVoar(i, true);
    });
  }
  function lbFechar() {
    if (lb.hidden) return;
    lb.classList.remove("on");
    lbVoar(lbI, false).then(() => {
      lb.hidden = true;
      lbImg.getAnimations().forEach((a) => a.cancel());
      document.body.classList.remove("lb-aberto");
      certCards[lbI]?.focus({ preventScroll: true });
    });
  }
  function lbIr(d) {
    if (destaque.length < 2) return;
    lbI = (lbI + d + destaque.length) % destaque.length;
    lbImg.getAnimations().forEach((a) => a.cancel());
    lbPreencher(lbI);
    if (!reduceMotion) {
      lbImg.animate([{ opacity: 0, transform: `translateX(${d * 40}px)` }, { opacity: 1, transform: "none" }], { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" });
    }
  }
  certCards.forEach((c, i) => c.addEventListener("click", () => lbAbrir(i)));
  $("#lb-x").addEventListener("click", lbFechar);
  $("#lb-fundo").addEventListener("click", lbFechar);
  $("#lb-ant").addEventListener("click", () => lbIr(-1));
  $("#lb-prox").addEventListener("click", () => lbIr(1));
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbFechar();
    else if (e.key === "ArrowRight") lbIr(1);
    else if (e.key === "ArrowLeft") lbIr(-1);
    else if (e.key === "Tab") {
      // mantém o foco dentro do visualizador
      const bs = lbBotoes().filter((b) => b.offsetParent);
      const k = bs.indexOf(document.activeElement);
      e.preventDefault();
      bs[(k + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus();
    }
  });
  // no celular: deslizar para o lado troca de certificado
  let toqueX = null;
  lb.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") toqueX = e.clientX; });
  lb.addEventListener("pointerup", (e) => {
    if (toqueX === null) return;
    const dx = e.clientX - toqueX;
    toqueX = null;
    if (Math.abs(dx) > 50) lbIr(dx < 0 ? 1 : -1);
  });

  // ---------- letreiro: anda sozinho, acelera e muda de sentido com a rolagem ----------
  const letreiro = $(".letreiro");
  let lx = 0, lVel = 0, lAtual = 0, lDir = 1, lPausa = false, lVisivel = false, lRaf = null, ultimoY = window.scrollY;
  function animarLetreiro() {
    if (!lVisivel) { lRaf = null; return; }
    const metade = trilho.scrollWidth / 2;
    const alvo = lPausa ? 0 : 0.5 + Math.min(Math.abs(lVel), 60) * 0.22;
    lAtual += (alvo - lAtual) * 0.08;
    lx -= lAtual * lDir;
    if (lx <= -metade) lx += metade;
    if (lx > 0) lx -= metade;
    trilho.style.transform = `translate3d(${lx}px,0,0)`;
    lVel *= 0.9;
    lRaf = requestAnimationFrame(animarLetreiro);
  }
  if (!reduceMotion) {
    letreiro.addEventListener("pointerenter", () => (lPausa = true));
    letreiro.addEventListener("pointerleave", () => (lPausa = false));
    new IntersectionObserver(([e]) => {
      lVisivel = e.isIntersecting;
      if (lVisivel && !lRaf) lRaf = requestAnimationFrame(animarLetreiro);
    }).observe(letreiro);
  }

  // ---------- efeitos ligados à posição do scroll ----------
  const bar = $("#progress-bar");
  const parallax = $$("[data-speed]");
  const sobreText = $("#sobre-text");
  const words = $$(".word", sobreText);
  const indice = $("#indice");
  const iLinks = $$("a", indice);
  const blocos = iLinks.map((a) => $(a.getAttribute("href")));
  const tl = $("#tl");
  const tlFill = $("#tl-fill");
  const tlItens = $$("li", tl);
  const topoBtn = $("#topo-btn");
  const anel = $("#anel");
  const navLinks = $$("a", links);
  const sections = navLinks.map((a) => $(a.getAttribute("href")));
  let blocoAtual = -1;

  function marcarIndice(k) {
    if (k === blocoAtual) return;
    blocoAtual = k;
    iLinks.forEach((a, i) => {
      a.classList.toggle("on", i === k);
      if (i === k) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const p = max > 0 ? y / max : 0;

    bar.style.transform = `scaleX(${p})`;
    nav.classList.toggle("na-capa", y < capa.offsetHeight - nav.offsetHeight);

    if (!reduceMotion) {
      parallax.forEach((el) => (el.style.transform = `translateY(${y * el.dataset.speed}px)`));
    }

    // Sobre: as palavras acendem enquanto o texto cruza a tela
    const r = sobreText.getBoundingClientRect();
    const acesas = Math.round(clamp((vh * 0.85 - r.top) / (r.height + vh * 0.3)) * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < acesas));

    // Índice do Sobre marca o bloco que passou da linha de 40% da tela
    let k = 0;
    blocos.forEach((b, i) => { if (b.getBoundingClientRect().top <= vh * 0.4) k = i; });
    marcarIndice(k);

    // Linha do tempo cresce conforme o centro da tela avança, e acende cada ponto
    const t = tl.getBoundingClientRect();
    tlFill.style.transform = `scaleY(${clamp((vh * 0.6 - t.top) / t.height)})`;
    tlItens.forEach((li) => li.classList.toggle("on", li.getBoundingClientRect().top < vh * 0.6));

    // Botão de voltar ao topo, com anel de progresso
    topoBtn.classList.toggle("on", y > vh * 0.9);
    anel.style.strokeDashoffset = 1 - p;

    // Link ativo no menu: a seção que passou de 40% da tela mais recentemente
    let ativo = -1, topo = -Infinity;
    sections.forEach((s, i) => {
      const top = s ? s.getBoundingClientRect().top : Infinity;
      if (top < vh * 0.4 && top > topo) { topo = top; ativo = i; }
    });
    navLinks.forEach((a, i) => a.classList.toggle("active", i === ativo));

    // velocidade da rolagem alimenta o letreiro
    const dy = y - ultimoY;
    if (dy) { lVel = dy; lDir = dy > 0 ? 1 : -1; }
    ultimoY = y;

    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener("resize", () => { moverIndicador(); onScroll(); });
  onScroll();
  // as fontes mudam a largura das abas; recalcula quando terminarem de carregar
  if (document.fonts) document.fonts.ready.then(moverIndicador);
})();
