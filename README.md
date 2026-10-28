# Currículo online

Site estático (HTML, CSS e JavaScript puros, sem build) pronto para o GitHub Pages.

## Editar o conteúdo

Todo o texto fica em `data.js`. Substitua os campos marcados com `[ ]` pelas informações do seu LinkedIn.
Para usar uma foto, coloque o arquivo (ex.: `foto.jpg`) nesta pasta e preencha `foto: "foto.jpg"`.

## Publicar no GitHub Pages

1. Crie um repositório chamado **`seu-usuario.github.io`** (o site fica em `https://seu-usuario.github.io`).
   Com outro nome, o endereço vira `https://seu-usuario.github.io/nome-do-repo`.
2. No repositório, clique em **Add file → Upload files** e envie `index.html`, `style.css`, `script.js`, `data.js` (e a foto, se tiver).
3. Vá em **Settings → Pages**, em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em um ou dois minutos o site está no ar.

## Interações ao rolar a página

- Barra de progresso no topo e menu que destaca a seção atual
- Nome animado letra por letra e frases "digitando" no topo
- Fundo com parallax
- Seção "Sobre" fixa na tela, com as palavras acendendo conforme você rola
- Números que contam até o valor quando aparecem
- Linha da trajetória que vai sendo desenhada e cards que deslizam para dentro
- Barras de habilidade que se preenchem
- Tema claro/escuro e animações reduzidas para quem prefere menos movimento
