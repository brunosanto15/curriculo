# Histórico do projeto — Portfólio

**Site no ar:** https://brunosanto15.github.io/portfolio/
**Repositório:** https://github.com/brunosanto15/portfolio (branch `main`, GitHub Pages na raiz)
**Última atualização:** 30/10/2026

O repositório se chamava `curriculo` até 30/10/2026.

## O que é

Portfólio/currículo interativo em HTML, CSS e JavaScript puros, sem build e sem dependências. A estrutura de pastas está no README.md. Todo o conteúdo fica no `data.js`.

## Pasta local

```
Projetos/Portfólio/
├── portfolio/     o site (este repositório)
└── materiais/     originais que NÃO vão para o site: foto original, PDFs dos certificados,
                   PDF do LinkedIn e o e-mail com o histórico da outra máquina
```

## Como o site evoluiu

1. **Versão 1:** layout com gradientes, preenchido com os dados do currículo em PDF. O LinkedIn bloqueia leitura automática, por isso os dados vieram do PDF.
2. **Versão 2:** inspirada em oryzo.ai, com fontes Literata, Inter e DM Mono e uma seção "Sobre" menor e mais organizada.
3. **Versão 3:** cores simples (branco e cinza, com **azul-escuro `#0b2a5b`** como contraste), interações inspiradas no oryzo.ai e certificação CPA.
4. **Versão 4 (atual):** layout baseado em eduardojacobpontes.github.io, mantendo cores e fontes da versão 3:
   - capa azul com gráfico decorativo e foto redonda sobreposta; nome ajustado para caber em uma linha
   - card em estilo terminal no topo, "Sobre" com índice fixo, faixa de números, letreiro de competências
   - capacidades em lista + painel em destaque (avança sozinho; no celular vira sanfona)
   - experiência em abas, formação em linha do tempo
   - certificados com miniatura que amplia em um visualizador (setas, teclado, deslizar no celular)
   - contato com WhatsApp e botão de copiar e-mail

## Decisões tomadas

- **Data de nascimento fica de fora** porque o site é público.
- **WhatsApp:** os botões abrem conversa com o número do Bruno (decisão de 30/10/2026). O número fica visível no link.
- **Barras de nível só para idiomas.** Não há percentuais inventados para as competências.
- **Preferência de design:** paletas simples, com azul-escuro como contraste. De um site de referência, usar o **layout e as interações**, não as cores.
- **CR:** 8,0.
- **Certificados com imagem:** CPA, ANCORD (ago/2026), Pré-Mestrado em IA (Magno Maciel e Faculdade HUB, mar/2026) e UPenn IAPS. Ainda falta o ano da CPA.

## Pendências (do PDF do LinkedIn, ainda não aplicadas)

- Promoção a **Investor** na InvestSmartXP desde out/2026.
- Texas Tech: no LinkedIn consta jan/2020 – dez/2022, pelo Colégio Carolina Patrício.
- Idiomas: no LinkedIn consta inglês avançado, sem espanhol.

## Para continuar com o Claude

Abra a pasta do projeto no VS Code (ou o Claude Code nela) e cole:

> Este é o meu portfólio (HTML/CSS/JS puros, publicado no GitHub Pages em https://brunosanto15.github.io/portfolio/, repositório brunosanto15/portfolio). Leia o HISTORICO.md e os arquivos do projeto antes de mudar algo. Todo o conteúdo fica no data.js. Mantenha o estilo atual: base branca e cinza com azul-escuro #0b2a5b de contraste, fontes Literata, Inter e DM Mono, e as interações existentes. Edite só localmente e publique quando eu pedir. Quero: [descreva a mudança]
