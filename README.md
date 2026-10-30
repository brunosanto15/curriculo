# Portfólio · Bruno Santopietro Machado

Site estático (HTML, CSS e JavaScript puros, sem build) publicado no GitHub Pages:
**https://brunosantopietro.github.io/portfolio/**

## Estrutura

```
portfolio/
├── index.html        estrutura das seções
├── data.js           TODO o conteúdo (textos, experiência, formação, certificados, links)
├── css/style.css     cores, fontes, layout e animações
├── js/script.js      monta a página a partir do data.js e controla as interações
└── img/
    ├── bruno.jpg     foto do topo
    └── certs/        imagens dos certificados (miniatura + visualizador)
```

## Editar o conteúdo

Quase tudo se muda só no `data.js`.

- **Foto:** troque `img/bruno.jpg` (quadrada, ~800 px).
- **Certificado com imagem:** salve o JPG em `img/certs/` e preencha `imagem: "img/certs/arquivo.jpg"`. Quem tem imagem aparece em destaque, com miniatura que amplia ao clicar; quem não tem vai para "ver mais".
- **WhatsApp:** `links.whatsapp` (só números, com 55 + DDD) e `links.whatsappMensagem`.

Para ver localmente, abra o `index.html` no navegador.

## Publicar

```
git add .
git commit -m "Descreva a mudança"
git push
```

O site atualiza em 1 a 2 minutos.
