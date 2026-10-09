/* ---------- helpers ---------- */
const $ = (id) => document.getElementById(id);
const state = { food: [], drinks: [], date: "", time: "", places: [] };

function showPage(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  $(id).classList.add("active");
  window.scrollTo(0, 0);
  if (id === "p-funny2") startMeter();
  if (id === "p-final") buildSummary();
}

document.querySelectorAll(".next[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => showPage(btn.dataset.next));
});

/* ---------- confetti (party poppers) ---------- */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let raf = null;
const colors = ["#D4A24C", "#2F7F5F", "#3B82C4", "#B5483F", "#17324D", "#F6ECD6"];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burst(x, y, angleCenter) {
  for (let i = 0; i < 90; i++) {
    const angle = angleCenter + (Math.random() - 0.5) * 1.1;
    const speed = 9 + Math.random() * 12;
    pieces.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      life: 0
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += 0.3;
    p.vx *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20 && p.life < 220);
  if (pieces.length) raf = requestAnimationFrame(tick);
  else { ctx.clearRect(0, 0, canvas.width, canvas.height); raf = null; }
}

function partyPoppers() {
  const w = canvas.width, h = canvas.height;
  burst(0, h, -Math.PI / 3);            // left popper
  burst(w, h, -Math.PI + Math.PI / 3);  // right popper
  setTimeout(() => {
    burst(0, h, -Math.PI / 3);
    burst(w, h, -Math.PI + Math.PI / 3);
  }, 350);
  if (!raf) raf = requestAnimationFrame(tick);
}

/* ---------- page 1: yes / no ---------- */
const noBtn = $("noBtn");
const yesBtn = $("yesBtn");
let noCount = 0;

function dodge(e) {
  if (e) e.preventDefault();
  noCount++;
  noBtn.classList.add("running");
  const pad = 10;
  const maxX = window.innerWidth - noBtn.offsetWidth - pad;
  const maxY = window.innerHeight - noBtn.offsetHeight - pad;
  noBtn.style.left = pad + Math.random() * Math.max(maxX - pad, 0) + "px";
  noBtn.style.top = pad + Math.random() * Math.max(maxY - pad, 0) + "px";
  // Yes grows a little every time No runs away
  yesBtn.style.transform = "scale(" + Math.min(1 + noCount * 0.08, 1.8) + ")";
}
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: false });
noBtn.addEventListener("click", dodge);

yesBtn.addEventListener("click", () => {
  noBtn.style.display = "none";
  partyPoppers();
  setTimeout(() => showPage("p-happy"), 1200);
});

/* ---------- multi-select builder ---------- */
function buildChips(gridId, items, selectedArr, min, nextBtnId, hintId, label) {
  const grid = $(gridId);

  function refresh() {
    const left = min - selectedArr.length;
    $(nextBtnId).disabled = left > 0;
    $(hintId).textContent = left > 0 ? "Pick " + left + " more " + label + "." : "";
  }

  function addChip(icon, name, selected) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (selected ? " selected" : "");
    b.innerHTML = '<i class="' + icon + '"></i><span></span>';
    b.lastChild.textContent = name;
    b.addEventListener("click", () => {
      const i = selectedArr.indexOf(name);
      if (i === -1) { selectedArr.push(name); b.classList.add("selected"); }
      else { selectedArr.splice(i, 1); b.classList.remove("selected"); }
      refresh();
    });
    grid.appendChild(b);
  }

  items.forEach(([icon, name]) => addChip(icon, name, false));
  refresh();
  return { addChip, refresh, selectedArr };
}

function wireAdd(inputId, btnId, builder, icon) {
  const input = $(inputId);
  function add() {
    const v = input.value.trim();
    if (!v) return;
    if (builder.selectedArr.indexOf(v) !== -1) { input.value = ""; return; }
    builder.selectedArr.push(v);
    builder.addChip(icon, v, true);
    builder.refresh();
    input.value = "";
  }
  $(btnId).addEventListener("click", add);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") add(); });
}

/* ---------- page 3: food ---------- */
buildChips("foodGrid", [
  ["fa-solid fa-pizza-slice", "Pizza"], ["fa-solid fa-bowl-food", "Pasta"],
  ["fa-solid fa-burger", "Zinger burger"], ["fa-solid fa-drumstick-bite", "Fried chicken"],
  ["fa-solid fa-hotdog", "Hot dog"], ["fa-solid fa-bread-slice", "Club sandwich"],
  ["fa-solid fa-cookie-bite", "Nuggets"], ["fa-solid fa-utensils", "French fries"]
], state.food, 3, "foodNext", "foodHint", "more item(s)");

/* ---------- page 4: drinks ---------- */
const drinks = buildChips("drinkGrid", [
  ["fa-solid fa-mug-hot", "Chai"], ["fa-solid fa-bottle-water", "Cold drink"],
  ["fa-solid fa-mug-saucer", "Hot coffee"], ["fa-solid fa-glass-water", "Cold coffee"]
], state.drinks, 2, "drinkNext", "drinkHint", "more drink(s)");
wireAdd("drinkInput", "drinkAdd", drinks, "fa-solid fa-martini-glass-citrus");

/* ---------- page 5: date & time ---------- */
const dateInput = $("dateInput");
const timeInput = $("timeInput");
dateInput.min = new Date().toISOString().split("T")[0];

function checkWhen() {
  state.date = dateInput.value;
  state.time = timeInput.value;
  const ok = state.date && state.time;
  $("whenNext").disabled = !ok;
  $("whenHint").textContent = ok ? "" : "Both date and time are required.";
}
dateInput.addEventListener("input", checkWhen);
timeInput.addEventListener("input", checkWhen);
checkWhen();

/* ---------- page 6: other places ---------- */
const places = buildChips("placeGrid", [
  ["fa-solid fa-ice-cream", "Ice cream"], ["fa-solid fa-tree", "Park walk"],
  ["fa-solid fa-film", "Cinema"], ["fa-solid fa-bag-shopping", "Shopping mall"],
  ["fa-solid fa-car-side", "Long drive"], ["fa-solid fa-camera", "Photo spot"]
], state.places, 2, "placeNext", "placeHint", "more place(s)");
wireAdd("placeInput", "placeAdd", places, "fa-solid fa-location-dot");

/* ---------- funny page 2: hunger meter ---------- */
const meterMessages = [
  "Measuring your hunger…",
  "Hunger level: high.",
  "Stomach noises detected.",
  "Almost done. Please don't eat your phone.",
  "Result: you need dinner right now."
];
let meterTimer = null;
function startMeter() {
  clearInterval(meterTimer);
  let pct = 0;
  $("meterNext").disabled = true;
  $("meterFill").style.width = "0%";
  $("meterText").textContent = meterMessages[0];
  meterTimer = setInterval(() => {
    pct += 5;
    $("meterFill").style.width = pct + "%";
    $("meterText").textContent = meterMessages[Math.min(Math.floor(pct / 21), meterMessages.length - 1)];
    if (pct >= 100) { clearInterval(meterTimer); $("meterNext").disabled = false; }
  }, 150);
}

/* ---------- funny page 3: who pays ---------- */
const youMessages = [
  "Nice try. Choose again.",
  "That's not the answer I was hoping for.",
  "Think about it once more.",
  "You're funny. Now pick again."
];
let youCount = 0;
$("youBtn").addEventListener("click", () => {
  $("payHint").textContent = youMessages[youCount % youMessages.length];
  youCount++;
  const b = $("meBtn");
  b.style.transform = "scale(" + Math.min(1 + youCount * 0.1, 1.6) + ")";
});
$("meBtn").addEventListener("click", () => {
  $("payHint").style.color = "#2FA36B";
  $("payHint").textContent = "Just kidding. I'll take care of the bill.";
  $("payNext").classList.remove("hidden");
});

/* ---------- final page ---------- */
function formatDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  return ((h % 12) || 12) + ":" + String(m).padStart(2, "0") + " " + ap;
}
function row(icon, title, text) {
  const d = document.createElement("div");
  const b = document.createElement("b");
  const i = document.createElement("i");
  i.className = icon;
  b.appendChild(i);
  b.appendChild(document.createTextNode(title));
  d.appendChild(b);
  d.appendChild(document.createTextNode(text));
  return d;
}
function buildSummary() {
  const s = $("summary");
  s.innerHTML = "";
  s.appendChild(row("fa-solid fa-pizza-slice", "Food", state.food.join(", ")));
  s.appendChild(row("fa-solid fa-mug-hot", "Drinks", state.drinks.join(", ")));
  s.appendChild(row("fa-regular fa-calendar", "When", formatDate(state.date) + " at " + formatTime(state.time)));
  s.appendChild(row("fa-solid fa-location-dot", "After dinner", state.places.join(", ")));
}

const payMsgs = [
  "Total bill: one big smile.",
  "Payment accepted. Please bring your appetite.",
  "See you at Papa's Kitchen."
];
let payCount = 0;
$("payBtn").addEventListener("click", () => {
  $("payMsg").style.color = "#2FA36B";
  $("payMsg").textContent = payMsgs[Math.min(payCount, payMsgs.length - 1)];
  payCount++;
  partyPoppers();
});
