# HBT — Handmade Brazilian Tobacco

Site institucional estático (HTML/CSS/JS puro), pronto para GitHub Pages.
Sem frameworks, sem dependências de build. Rápido e sóbrio.

## Estrutura

```
hbt-site/
├── index.html              # Home (pronta)
├── a-marca.html            # A Marca            (a construir)
├── special-serie.html      # Special Serie      (a construir)
├── experiencia.html        # Experiência        (a construir)
├── contato.html            # Contato            (a construir)
├── assets/
│   ├── css/style.css       # Estilos globais (paleta + tipografia)
│   ├── js/main.js          # Interações mínimas (nav, reveals)
│   └── img/leaf.svg        # Marca de origem (folha, branca)
├── .nojekyll               # Serve o site sem processamento Jekyll
└── README.md
```

## Identidade

| Token        | Hex       | Uso                          |
|--------------|-----------|------------------------------|
| Preto fosco  | `#0A0A0A` | Base / estrutura             |
| Branco puro  | `#FFFFFF` | Tipografia / voz             |
| Cinza        | `#9A9A9A` | Textos de apoio              |
| Âmbar        | `#C8A15A` | Holofote, hover, CTA (mínimo)|

Tipografia: **Cormorant Garamond** (serifada, títulos) + **Jost** (sans, corpo e rótulos).

## Publicar no GitHub Pages

1. Crie um repositório (ex.: `hbt-site` ou `hbt.github.io`).
2. Suba o conteúdo desta pasta na raiz do repositório:
   ```bash
   git init
   git add .
   git commit -m "HBT — home"
   git branch -M main
   git remote add origin git@github.com:SUA-CONTA/hbt-site.git
   git push -u origin main
   ```
3. Em **Settings → Pages**, defina Branch `main` / pasta `/root` e salve.
4. O site sobe em `https://SUA-CONTA.github.io/hbt-site/`.

Para domínio próprio (ex.: `hbt.com.br`), adicione um arquivo `CNAME`
com o domínio e configure o DNS.
