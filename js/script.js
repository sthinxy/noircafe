/* =========================================================
   NOIR CAFÉ MENU — script.js
   Tudo em vanilla JS. Persistência via localStorage.
   Para trocar o número de WhatsApp, edite WHATSAPP_NUMBER abaixo.
   ========================================================= */

// >>>>>> EDITE AQUI O NÚMERO DO WHATSAPP (formato internacional, só dígitos) <<<<<<
const WHATSAPP_NUMBER = "5571996356879";

// ============ DATA ============
const PRODUCTS = [
  {
    id: "espresso-silent",
    name: "Espresso Silencioso",
    cat: "coffee",
    desc: "Café curto, intenso e direto.",
    price: 7,
    img: "assets/images/espresso.jpg",
    mood: "silent"
  },
  {
    id: "white-space-latte",
    name: "Latte White Space",
    cat: "coffee",
    desc: "Latte suave com leite vaporizado e final delicado.",
    price: 12,
    img: "assets/images/latte.jpg",
    mood: "delicate"
  },
  {
    id: "black-space-mocha",
    name: "Mocha Black Space",
    cat: "coffee",
    desc: "Mocha escuro com chocolate intenso e final amargo.",
    price: 14,
    img: "assets/images/mocha.jpg",
    mood: "intense"
  },
  {
    id: "brownie-fragment",
    name: "Fragmento de Brownie",
    cat: "sweet",
    desc: "Brownie denso com casquinha fina e centro macio.",
    price: 10,
    img: "assets/images/brownie.jpg",
    mood: "deep"
  },
  {
    id: "moon-cheesecake",
    name: "Cheesecake Lunar",
    cat: "sweet",
    desc: "Cheesecake leve com cobertura clara e textura cremosa.",
    price: 13,
    img: "assets/images/cheesecake.jpg",
    mood: "delicate"
  },
  {
    id: "memory-cookie",
    name: "Cookie de Memória",
    cat: "sweet",
    desc: "Cookie amanteigado com gotas de chocolate.",
    price: 8,
    img: "assets/images/cookie.jpg",
    mood: "silent"
  },
  {
    id: "iced-void-coffee",
    name: "Café Gelado do Vazio",
    cat: "iced",
    desc: "Café gelado com toque de baunilha.",
    price: 13,
    img: "assets/images/iced.jpg",
    mood: "silent"
  },
  {
    id: "cold-brew-something",
    name: "Cold Brew de Algo",
    cat: "iced",
    desc: "Cold brew encorpado, servido lentamente.",
    price: 15,
    img: "assets/images/coldbrew.jpg",
    mood: "deep"
  },
  {
    id: "quiet-morning",
    name: "Manhã Silenciosa",
    cat: "combo",
    desc: "Latte + cookie.",
    price: 18,
    img: "assets/images/combo-morning.jpg",
    mood: "delicate"
  },
  {
    id: "table-for-one",
    name: "Mesa Para Um",
    cat: "combo",
    desc: "Espresso + brownie.",
    price: 16,
    img: "assets/images/combo-table.jpg",
    mood: "intense"
  }
];

const CAT_LABEL = {
  coffee: "CAFÉ",
  sweet: "DOCE",
  iced: "GELADO",
  combo: "COMBO"
};

const MOOD_LABEL = {
  silent: "SILENCIOSA",
  intense: "INTENSA",
  delicate: "DELICADA",
  deep: "PROFUNDA"
};

const findP = (id) => PRODUCTS.find((p) => p.id === id);

// ============ STATE ============
const ls = {
  get: (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
};

let state = {
  theme: ls.get("noir.theme", "black"),
  favorites: ls.get("noir.favorites", []),
  cart: ls.get("noir.cart", []),
  user: ls.get("noir.user", null),
  discount: ls.get("noir.discount", false),
  filter: "all"
};

const save = () => {
  ls.set("noir.theme", state.theme);
  ls.set("noir.favorites", state.favorites);
  ls.set("noir.cart", state.cart);
  ls.set("noir.user", state.user);
  ls.set("noir.discount", state.discount);
};

// ============ DIALOG ============
let dialogTimer = null;
let typeTimer = null;

function dialog(text) {
  const box = document.getElementById("dialog");
  const out = document.getElementById("dialog-text");

  if (!box || !out) return;

  clearTimeout(dialogTimer);
  clearInterval(typeTimer);

  box.classList.remove("hidden");
  requestAnimationFrame(() => box.classList.add("is-show"));

  let i = 0;
  out.textContent = "";

  typeTimer = setInterval(() => {
    i++;
    out.textContent = text.slice(0, i);

    if (i >= text.length) {
      clearInterval(typeTimer);
    }
  }, 18);

  dialogTimer = setTimeout(() => {
    box.classList.remove("is-show");

    setTimeout(() => {
      box.classList.add("hidden");
    }, 350);
  }, 4200);
}

// ============ THEME ============
function applyTheme() {
  document.body.classList.toggle("theme-black", state.theme === "black");
  document.body.classList.toggle("theme-white", state.theme === "white");

  const label = document.getElementById("theme-label");

  if (label) {
    label.textContent = state.theme === "black" ? "BLACK" : "WHITE";
  }
}

function toggleTheme() {
  state.theme = state.theme === "black" ? "white" : "black";

  applyTheme();
  save();

  dialog(
    state.theme === "black"
      ? "O espaço escureceu. Bem-vindo ao BLACK SPACE."
      : "A luz voltou. Você atravessou para o WHITE SPACE."
  );
}

// ============ MENU / CARDS ============
function visibleProducts() {
  if (state.filter === "all") return PRODUCTS;

  if (state.filter === "fav") {
    return PRODUCTS.filter((p) => state.favorites.includes(p.id));
  }

  return PRODUCTS.filter((p) => p.cat === state.filter);
}

function renderMenu() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const items = visibleProducts();

  if (items.length === 0) {
    grid.innerHTML = '<p class="cart-empty">Nenhum item neste espaço.</p>';
    return;
  }

  grid.innerHTML = items.map((p) => {
    const isFavorite = state.favorites.includes(p.id);
    const price = p.price.toFixed(2).replace(".", ",");

    return `
      <article class="card" data-id="${p.id}">
        <div class="card__media">
          <span class="card__badge">${CAT_LABEL[p.cat]}</span>

          <button
            class="card__fav ${isFavorite ? "is-on" : ""}"
            onclick="toggleFav('${p.id}')"
            aria-label="Favoritar"
          >
            ★
          </button>

          <img src="${p.img}" alt="${p.name}" loading="lazy" />
        </div>

        <div class="card__body">
          <h3 class="card__name">${p.name}</h3>
          <p class="card__desc">${p.desc}</p>

          <div class="card__foot">
            <span class="card__price">R$ ${price}</span>
            <button class="card__add" onclick="addToCart('${p.id}')">+ ADICIONAR</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// ============ FAVORITES ============
function toggleFav(id) {
  const has = state.favorites.includes(id);

  state.favorites = has
    ? state.favorites.filter((itemId) => itemId !== id)
    : [...state.favorites, id];

  save();
  renderMenu();

  dialog(has ? "Removido dos favoritos." : "Uma memória foi guardada.");
}

// ============ CART ============
function addToCart(id, qty = 1) {
  const index = state.cart.findIndex((item) => item.id === id);

  if (index >= 0) {
    state.cart[index].qty += qty;
  } else {
    state.cart.push({ id, qty });
  }

  save();
  renderCart();

  dialog("Uma xícara foi adicionada ao inventário.");
}

function updateQty(id, qty) {
  if (qty <= 0) {
    state.cart = state.cart.filter((item) => item.id !== id);
  } else {
    state.cart = state.cart.map((item) => {
      return item.id === id ? { ...item, qty } : item;
    });
  }

  save();
  renderCart();
}

function removeItem(id) {
  state.cart = state.cart.filter((item) => item.id !== id);

  save();
  renderCart();

  dialog("Item removido. O silêncio voltou um pouco.");
}

function clearCart() {
  state.cart = [];

  save();
  renderCart();

  dialog("O inventário está vazio. O silêncio voltou.");
}

function cartCount() {
  return state.cart.reduce((total, item) => total + item.qty, 0);
}

function cartSubtotal() {
  return state.cart.reduce((total, item) => {
    const product = findP(item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const countElement = document.getElementById("cart-count");
  const wrap = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");
  const discountRow = document.getElementById("cart-discount-row");
  const discountElement = document.getElementById("cart-discount");

  if (countElement) {
    countElement.textContent = cartCount();
  }

  if (!wrap) return;

  if (state.cart.length === 0) {
    wrap.innerHTML = '<p class="cart-empty">o inventário está vazio.</p>';
  } else {
    wrap.innerHTML = state.cart.map((item) => {
      const product = findP(item.id);

      if (!product) return "";

      const unitPrice = product.price.toFixed(2).replace(".", ",");
      const linePrice = (product.price * item.qty).toFixed(2).replace(".", ",");

      return `
        <div class="cart-item">
          <img src="${product.img}" alt="${product.name}" />

          <div>
            <div class="cart-item__name">${product.name}</div>
            <div class="cart-item__meta">R$ ${unitPrice} · R$ ${linePrice}</div>

            <div class="cart-item__qty">
              <button onclick="updateQty('${product.id}', ${item.qty - 1})">−</button>
              <span class="mono small">${item.qty}</span>
              <button onclick="updateQty('${product.id}', ${item.qty + 1})">+</button>
              <button class="cart-item__remove" onclick="removeItem('${product.id}')">REMOVER</button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  const subtotal = cartSubtotal();
  const discount = state.discount ? subtotal * 0.05 : 0;
  const total = subtotal - discount;

  if (subtotalElement) {
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  }

  if (totalElement) {
    totalElement.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }

  if (discountRow && discountElement) {
    if (state.discount && subtotal > 0) {
      discountRow.classList.remove("hidden");
      discountElement.textContent = `- R$ ${discount.toFixed(2).replace(".", ",")}`;
    } else {
      discountRow.classList.add("hidden");
    }
  }
}

function openCart() {
  const drawer = document.getElementById("cart");
  if (!drawer) return;

  drawer.classList.remove("hidden");
  drawer.setAttribute("aria-hidden", "false");

  requestAnimationFrame(() => drawer.classList.add("is-open"));

  dialog("Inventário aberto.");
}

function closeCart() {
  const drawer = document.getElementById("cart");
  if (!drawer) return;

  drawer.classList.remove("is-open");

  setTimeout(() => {
    drawer.classList.add("hidden");
    drawer.setAttribute("aria-hidden", "true");
  }, 350);
}

// ============ ORDER / WHATSAPP ============
function orderText() {
  if (state.cart.length === 0) return null;

  let lines = ["Olá! Gostaria de fazer um pedido no Noir Café:\n"];
  let total = 0;

  state.cart.forEach((item) => {
    const product = findP(item.id);

    if (!product) return;

    const subtotal = product.price * item.qty;
    total += subtotal;

    lines.push(`${item.qty}x ${product.name} — R$ ${subtotal.toFixed(2).replace(".", ",")}`);
  });

  if (state.discount) {
    const discount = total * 0.05;

    lines.push(`\nDesconto da Memória (-5%): - R$ ${discount.toFixed(2).replace(".", ",")}`);
    total -= discount;
  }

  lines.push(`\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`);

  return lines.join("\n");
}

async function copyOrder() {
  const text = orderText();

  if (!text) {
    dialog("O inventário está vazio.");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    dialog("Pedido copiado para a memória.");
  } catch {
    dialog("Não foi possível copiar. Selecione manualmente.");
  }
}

function sendWhatsApp() {
  const text = orderText();

  if (!text) {
    dialog("O inventário está vazio.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  window.open(url, "_blank");

  dialog("Canal de pedido aberto.");
}

// ============ AUTH ============
let authTab = "signin";

function openAuth() {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;

  modal.classList.remove("hidden");

  const form = document.getElementById("auth-form");
  const tabs = document.querySelector(".tabs");
  const logged = document.getElementById("auth-logged");
  const username = document.getElementById("auth-username");

  if (state.user) {
    if (form) form.classList.add("hidden");
    if (tabs) tabs.classList.add("hidden");
    if (logged) logged.classList.remove("hidden");
    if (username) username.textContent = state.user;
  } else {
    if (form) form.classList.remove("hidden");
    if (tabs) tabs.classList.remove("hidden");
    if (logged) logged.classList.add("hidden");
  }
}

function closeAuth() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.add("hidden");
}

function switchAuthTab(tab) {
  authTab = tab;

  document.querySelectorAll(".tab").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tab);
  });

  const submit = document.getElementById("auth-submit");

  if (submit) {
    submit.textContent = tab === "signin" ? "▸ ENTRAR" : "▸ CRIAR CONTA";
  }
}

function authSubmit() {
  const userInput = document.getElementById("auth-user");
  const passInput = document.getElementById("auth-pass");
  const error = document.getElementById("auth-error");

  if (!userInput || !passInput || !error) return;

  const username = userInput.value.trim();
  const password = passInput.value;

  error.textContent = "";

  if (!username || !password) {
    error.textContent = "Preencha usuário e senha.";
    return;
  }

  const accounts = ls.get("noir.accounts", []);

  if (authTab === "signup") {
    const exists = accounts.find((account) => account.username === username);

    if (exists) {
      error.textContent = "Usuário já existe.";
      return;
    }

    accounts.push({ username, password });
    ls.set("noir.accounts", accounts);

    state.user = username;

    save();
    updateAuthUI();
    closeAuth();

    dialog("Conta registrada na memória.");
  } else {
    const account = accounts.find((item) => {
      return item.username === username && item.password === password;
    });

    if (!account) {
      error.textContent = "Usuário ou senha inválidos.";
      return;
    }

    state.user = username;

    save();
    updateAuthUI();
    closeAuth();

    dialog(`Bem-vindo(a) de volta, ${username}.`);
  }
}

function signOut() {
  state.user = null;

  save();
  updateAuthUI();
  closeAuth();

  dialog("Sessão encerrada. Até a próxima visita.");
}

function updateAuthUI() {
  const label = document.getElementById("auth-label");

  if (label) {
    label.textContent = state.user ? state.user.toUpperCase() : "ENTRAR";
  }
}

// ============ QUIZ ============
const QUIZ = [
  {
    q: "Qual atmosfera combina mais com você?",
    o: [
      { l: "Silenciosa", t: "silent" },
      { l: "Intensa", t: "intense" },
      { l: "Delicada", t: "delicate" },
      { l: "Profunda", t: "deep" }
    ]
  },
  {
    q: "Você prefere:",
    o: [
      { l: "Café forte", t: "intense" },
      { l: "Café suave", t: "delicate" },
      { l: "Algo doce", t: "delicate" },
      { l: "Algo gelado", t: "silent" }
    ]
  },
  {
    q: "Seu momento ideal é:",
    o: [
      { l: "Manhã tranquila", t: "delicate" },
      { l: "Fim de tarde", t: "silent" },
      { l: "Noite silenciosa", t: "deep" },
      { l: "Pausa rápida", t: "intense" }
    ]
  },
  {
    q: "Você procura:",
    o: [
      { l: "Algo quente", t: "intense" },
      { l: "Algo gelado", t: "silent" },
      { l: "Algo doce", t: "delicate" },
      { l: "Um combo", t: "deep" }
    ]
  }
];

let quizStep = 0;
let quizScore = {};

function openQuiz() {
  quizStep = 0;
  quizScore = {
    silent: 0,
    intense: 0,
    delicate: 0,
    deep: 0
  };

  const modal = document.getElementById("quiz-modal");
  const result = document.getElementById("quiz-result");
  const options = document.getElementById("quiz-options");

  if (modal) modal.classList.remove("hidden");
  if (result) result.classList.add("hidden");
  if (options) options.classList.remove("hidden");

  renderQuiz();
}

function closeQuiz() {
  const modal = document.getElementById("quiz-modal");
  if (modal) modal.classList.add("hidden");
}

function renderQuiz() {
  const step = QUIZ[quizStep];

  const title = document.getElementById("quiz-title");
  const progress = document.getElementById("quiz-progress");
  const options = document.getElementById("quiz-options");

  if (!step || !title || !progress || !options) return;

  title.textContent = step.q;

  progress.innerHTML = QUIZ.map((_, index) => {
    return `<span class="${index <= quizStep ? "is-done" : ""}"></span>`;
  }).join("");

  options.innerHTML = step.o.map((option, index) => {
    return `<button onclick="answerQuiz(${index})">${option.l}</button>`;
  }).join("");
}

function answerQuiz(index) {
  const tag = QUIZ[quizStep].o[index].t;

  quizScore[tag] = (quizScore[tag] || 0) + 1;
  quizStep++;

  if (quizStep < QUIZ.length) {
    renderQuiz();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const best = Object.entries(quizScore).sort((a, b) => b[1] - a[1])[0][0];
  const matches = PRODUCTS.filter((product) => product.mood === best);
  const drink = matches.find((product) => product.cat === "coffee" || product.cat === "iced") || matches[0] || PRODUCTS[0];
  const food = matches.find((product) => product.cat === "sweet") || PRODUCTS.find((product) => product.cat === "sweet");
  const combo = PRODUCTS.find((product) => product.cat === "combo" && product.mood === best);
  const picks = combo ? [combo] : [drink, food].filter(Boolean);

  const title = document.getElementById("quiz-title");
  const options = document.getElementById("quiz-options");
  const result = document.getElementById("quiz-result");

  if (!title || !options || !result) return;

  title.textContent = "sua atmosfera foi lida.";
  options.classList.add("hidden");
  result.classList.remove("hidden");

  const resultTitle = combo
    ? `você parece pertencer ao ${combo.name}.`
    : `sua combinação ideal é ${picks.map((product) => product.name).join(" + ")}.`;

  const picksIds = JSON.stringify(picks.map((product) => product.id));

  result.innerHTML = `
    <p class="mono tiny muted">// RESULTADO — atmosfera: ${MOOD_LABEL[best]}</p>

    <h4>${resultTitle}</h4>

    <div class="picks">
      ${picks.map((product) => {
        const price = product.price.toFixed(2).replace(".", ",");

        return `
          <div class="pick">
            <img src="${product.img}" alt="${product.name}" />
            <div class="serif lg">${product.name}</div>
            <div class="mono tiny muted">R$ ${price}</div>
          </div>
        `;
      }).join("")}
    </div>

    <div class="quiz-result__actions">
      <button class="btn btn-primary mono" onclick='addPicks(${picksIds})'>
        ▸ ADICIONAR AO INVENTÁRIO
      </button>

      <button class="btn btn-outline mono" onclick="openQuiz()">
        ▸ REFAZER QUIZ
      </button>
    </div>
  `;

  dialog("Sua atmosfera foi registrada.");
}

function addPicks(ids) {
  ids.forEach((id) => addToCart(id));

  closeQuiz();
  openCart();
}

// ============ EASTER EGG ============
function findSomething() {
  const button = document.getElementById("easter");

  if (button) {
    button.classList.add("found");
  }

  if (!state.discount) {
    state.discount = true;

    save();
    renderCart();

    dialog("Algo encontrou você primeiro. DESCONTO_DA_MEMÓRIA desbloqueado: -5%.");
  } else {
    dialog("Algo se moveu perto do balcão.");
  }
}

// ============ LOADING SCREEN ============
const STAGES = [
  "NOIR_CAFE.EXE",
  "abrindo cardápio...",
  "preparando memórias...",
  "carregando mesa...",
  "bem-vindo(a) ao Noir Café."
];

function runLoading() {
  const bar = document.getElementById("progress-bar");
  const pct = document.getElementById("progress-pct");
  const stage = document.getElementById("loading-stage");
  const loading = document.getElementById("loading");

  if (!bar || !pct || !stage || !loading) return;

  const start = performance.now();
  const duration = 1800;

  function tick(time) {
    const progress = Math.min(1, (time - start) / duration);

    bar.style.width = (progress * 100) + "%";
    pct.textContent = String(Math.floor(progress * 100)).padStart(3, "0") + "%";

    const stageIndex = Math.min(
      STAGES.length - 1,
      Math.floor(progress * STAGES.length)
    );

    stage.textContent = STAGES[stageIndex];
    stage.setAttribute("data-glitch", STAGES[stageIndex]);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        const finalText = "bem-vindo(a) ao Noir Café.";

        stage.textContent = finalText;
        stage.setAttribute("data-glitch", finalText);
        stage.classList.add("loading-finish-glitch");
        loading.classList.add("is-finishing");

        setTimeout(() => {
          stage.classList.remove("loading-finish-glitch");
          loading.classList.remove("is-finishing");
          loading.classList.add("is-out");

          setTimeout(() => {
            loading.remove();
          }, 500);

          dialog("Bem-vindo(a) ao Noir Café.");
        }, 1200);
      }, 300);
    }
  }

  requestAnimationFrame(tick);
}

// ============ CUSTOM CURSOR ============
function initCursor() {
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  if (!mediaQuery.matches) return;

  document.body.classList.add("has-cursor");

  const ring = document.getElementById("cursor-ring");
  const dot = document.getElementById("cursor-dot");

  if (!ring || !dot) return;

  document.addEventListener("mousemove", (event) => {
    ring.style.left = event.clientX + "px";
    ring.style.top = event.clientY + "px";

    dot.style.left = event.clientX + "px";
    dot.style.top = event.clientY + "px";

    const target = event.target;

    ring.classList.toggle(
      "is-hover",
      Boolean(target && target.closest && target.closest("button, a, input, .card"))
    );
  });
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  renderMenu();
  renderCart();
  updateAuthUI();
  initCursor();
  runLoading();

  const filters = document.getElementById("filters");

  if (filters) {
    filters.addEventListener("click", (event) => {
      const button = event.target.closest(".filter");

      if (!button) return;

      document.querySelectorAll(".filter").forEach((item) => {
        item.classList.remove("is-active");
      });

      button.classList.add("is-active");

      state.filter = button.dataset.filter;

      renderMenu();
    });
  }

  const themeToggle = document.getElementById("theme-toggle");
  const openCartButton = document.getElementById("open-cart");
  const openAuthButton = document.getElementById("open-auth");
  const easterButton = document.getElementById("easter");
  const authSubmitButton = document.getElementById("auth-submit");
  const authForm = document.getElementById("auth-form");

  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  if (openCartButton) {
    openCartButton.addEventListener("click", openCart);
  }

  if (openAuthButton) {
    openAuthButton.addEventListener("click", openAuth);
  }

  if (easterButton) {
    easterButton.addEventListener("click", findSomething);
  }

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  if (authSubmitButton) {
    authSubmitButton.addEventListener("click", authSubmit);
  }

  if (authForm) {
    authForm.addEventListener("submit", (event) => {
      event.preventDefault();
      authSubmit();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA"].includes(event.target.tagName)) return;

    if (event.key === "t" || event.key === "T") {
      toggleTheme();
    }

    if (event.key === "Escape") {
      closeCart();
      closeAuth();
      closeQuiz();
    }
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
});

// ============ GLOBAL FUNCTIONS ============
window.addToCart = addToCart;
window.toggleFav = toggleFav;
window.updateQty = updateQty;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openAuth = openAuth;
window.closeAuth = closeAuth;
window.signOut = signOut;
window.openQuiz = openQuiz;
window.closeQuiz = closeQuiz;
window.answerQuiz = answerQuiz;
window.addPicks = addPicks;
window.copyOrder = copyOrder;
window.sendWhatsApp = sendWhatsApp;