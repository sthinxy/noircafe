# Noir Café Menu

> *"the menu is closed. the memory remains."*

Cardápio digital interativo para uma cafeteria fictícia chamada **Noir Café**.
Um site autoral, monocromático e levemente surreal — inspirado em jogos
narrativos, menus de RPG e na atmosfera entre **WHITE SPACE** e **BLACK SPACE**.

---

## ✦ Sobre

Projeto conceitual e funcional de cardápio digital, pronto para ser adaptado
para pequenos negócios — cafeterias, docerias, restaurantes autorais e marcas
independentes. Construído em **HTML + CSS + JavaScript puros**, sem build,
sem dependências, sem backend. Basta abrir o `index.html`.

---

## ✦ Funcionalidades

- **WHITE SPACE / BLACK SPACE** — alterne com a tecla `[T]` (desktop) ou o botão `WHITE/BLACK` (mobile)
- **Loading screen** estilo boot de sistema
- **Cursor customizado** no desktop (desativado no celular)
- **Cardápio** com 10 produtos em 4 categorias
- **Filtros funcionais** — Todos / Coffee / Sweets / Iced / Combos / Favoritos
- **Sistema de favoritos** persistente no localStorage
- **Login fictício** (criar conta, entrar, sair) — só no navegador
- **Quiz de preferências** em 4 perguntas que sugere produtos do menu
- **Carrinho ("inventário")** com quantidade, subtotal e total
- **Copiar pedido** para área de transferência
- **Enviar pedido por WhatsApp** com link direto
- **Easter egg** discreto na hero (`?` no canto) que desbloqueia `MEMORY_DISCOUNT -5%`
- **Caixa de diálogo estilo RPG** com efeito de digitação para todos os eventos
- **Animações sutis** — vapor, glitch, fade-up, scanlines no BLACK SPACE
- **100% responsivo** — desktop, tablet e celular

---

## ✦ Tecnologias

- HTML5 semântico
- CSS3 puro (custom properties, grid, flex, animações)
- JavaScript vanilla (ES2020)
- Fontes do Google Fonts: **Cormorant Garamond**, **Inter**, **JetBrains Mono**
- **Zero dependências, zero build, zero backend**

---

## ✦ Estrutura

```
noir-cafe-menu/
├── index.html          # marcação de todas as seções
├── css/
│   └── style.css       # design system + componentes + responsivo
├── js/
│   └── script.js       # estado, carrinho, quiz, auth, easter egg
├── assets/
│   └── images/         # 10 produtos + hero (line-art)
└── README.md
```

---

## ✦ Como executar

### Opção 1 — abrir direto
Dê duplo-clique em `index.html`. Funciona em qualquer navegador moderno.

### Opção 2 — servidor local (recomendado)
Para evitar qualquer aviso de CORS em assets locais:

```bash
# Python 3
python -m http.server 8000

# Node (http-server)
npx http-server -p 8000

# VSCode
# Instale a extensão "Live Server" e clique em "Go Live"
```

Acesse: `http://localhost:8000`

---

## ✦ Como hospedar

Como é 100% estático, hospede em qualquer lugar:

- **GitHub Pages** — suba a pasta para um repo, ative Pages em Settings → Pages
- **Vercel** / **Netlify** — drag-and-drop da pasta no painel
- **Cloudflare Pages** — conecte o repo, sem build command
- **Hospedagem tradicional** — envie todos os arquivos por FTP

---

## ✦ Customização rápida

| O que mudar             | Onde                                                 |
|-------------------------|------------------------------------------------------|
| Número do WhatsApp      | `js/script.js` — constante `WHATSAPP_NUMBER` no topo |
| Produtos / preços       | `js/script.js` — array `PRODUCTS`                    |
| Imagens dos produtos    | `assets/images/` (mantenha o mesmo nome de arquivo)  |
| Cores e tipografia      | `css/style.css` — bloco `:root` e `body.theme-white` |
| Texto da hero / about   | `index.html`                                         |
| Links de contato        | `index.html` (seção `#contact`)                      |

---

## ✦ Autora

Desenvolvido por **Ana Beatriz — Sthinxy**, 2026.

- GitHub: [@sthinxy](https://github.com/sthinxy)
- Discord: `832411401649258497`
- Email: <venanciobeatriz620@gmail.com>

---

> *something is sitting at the counter.*
