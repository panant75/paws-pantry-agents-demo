/* =========================================================
   Neighborhood Agents — interactive sales demo
   Change BUSINESS_CONFIG below to re-theme the whole demo.
   ========================================================= */

const BUSINESS_CONFIG = {
  name: "Paws & Pantry",
  type: "Pet food shop",
  size: "1–5 people",
  ownerFirstName: "Alex",
  tagline: "Neighborhood pet-food shop with subscription delivery",
  industryLabel: "Retail · Pet supplies",
};

const STEP_LABELS = [
  "Welcome",
  "Pains",
  "Agents",
  "Setup",
  "Dashboard",
  "Summary",
];

const PAINS = [
  {
    id: "stock",
    title: "Running out of stock / spoiled inventory",
    desc: "Shelves empty, food expires, suppliers chase you.",
    icon: "📦",
    color: "#FEF3C7",
    hours: 4,
    dollars: 420,
  },
  {
    id: "replies",
    title: "Slow replies to customers",
    desc: "DMs and emails pile up while you're on the floor.",
    icon: "💬",
    color: "#DBEAFE",
    hours: 6,
    dollars: 280,
  },
  {
    id: "churn",
    title: "Missed reorders & churned subscriptions",
    desc: "Subscribers quietly leave when boxes slip.",
    icon: "🔁",
    color: "#FCE8E2",
    hours: 3,
    dollars: 650,
  },
  {
    id: "marketing",
    title: "Not enough time for marketing",
    desc: "Instagram and promos keep slipping to 'someday'.",
    icon: "📣",
    color: "#EDE9FE",
    hours: 5,
    dollars: 310,
  },
  {
    id: "margins",
    title: "Unclear margins and pricing",
    desc: "Hard to see what's actually making money.",
    icon: "📊",
    color: "#DCFCE7",
    hours: 3,
    dollars: 480,
  },
  {
    id: "delivery",
    title: "Delivery / fulfillment chaos",
    desc: "Routes, boxes, and 'where's my order?' overwhelm.",
    icon: "🚚",
    color: "#CCFBF1",
    hours: 5,
    dollars: 360,
  },
];

const AGENTS = [
  {
    id: "captain",
    name: "Store Captain",
    role: "Your chief of staff",
    icon: "🧭",
    color: "#CCFBF1",
    desc: "Keeps the whole team coordinated and surfaces what needs your eye.",
    painIds: ["stock", "replies", "churn", "marketing", "margins", "delivery"],
    tasks: ["Morning briefing of what's urgent", "Routes work to the right agent", "Nags gently when approvals wait"],
    alwaysOn: true,
  },
  {
    id: "pal",
    name: "Customer Pal",
    role: "Customer care",
    icon: "🤝",
    color: "#DBEAFE",
    desc: "Answers common questions in your voice and flags the tricky ones.",
    painIds: ["replies"],
    tasks: ["Reply to FAQs in minutes", "Escalate angry messages", "Log requests for the team"],
  },
  {
    id: "orders",
    name: "Order Desk",
    role: "Sales & subscriptions",
    icon: "🧾",
    color: "#FCE8E2",
    desc: "Watches subscriptions, nudges renewals, and catches churn early.",
    painIds: ["churn"],
    tasks: ["Flag at-risk subscribers", "Draft win-back notes", "Confirm upcoming renewals"],
  },
  {
    id: "pantry",
    name: "Pantry Stock",
    role: "Inventory & suppliers",
    icon: "🥫",
    color: "#FEF3C7",
    desc: "Tracks low stock, drafts reorders, and watches for spoilage.",
    painIds: ["stock"],
    tasks: ["Draft supplier reorders", "Warn on near-expiry items", "Suggest safer order sizes"],
  },
  {
    id: "cash",
    name: "Cash Sense",
    role: "Money & margins",
    icon: "💰",
    color: "#DCFCE7",
    desc: "Makes pricing and margin clarity feel simple—not spreadsheet hell.",
    painIds: ["margins"],
    tasks: ["Highlight low-margin SKUs", "Compare weekly profit", "Suggest price tweaks"],
  },
  {
    id: "growth",
    name: "Growth Spark",
    role: "Marketing & social",
    icon: "✨",
    color: "#EDE9FE",
    desc: "Drafts promos and posts so marketing happens without a second job.",
    painIds: ["marketing"],
    tasks: ["Draft weekend promos", "Suggest Instagram captions", "Plan a simple campaign"],
  },
  {
    id: "ship",
    name: "Ship & Scoop",
    role: "Fulfillment & delivery",
    icon: "🐕",
    color: "#FFE4E6",
    desc: "Keeps delivery days tidy and customers informed without phone tag.",
    painIds: ["delivery"],
    tasks: ["Group same-block deliveries", "Send 'out for delivery' notes", "Flag address issues early"],
  },
];

const TOOLS = [
  { id: "gmail", name: "Gmail", desc: "Customer emails & replies", color: "#EA4335", initials: "Gm", defaultOn: true },
  { id: "pos", name: "Square / Shopify POS", desc: "Sales & inventory signal", color: "#006AFF", initials: "Sq", defaultOn: true },
  { id: "ig", name: "Instagram", desc: "DMs and social posts", color: "#E1306C", initials: "Ig", defaultOn: false },
  { id: "cal", name: "Google Calendar", desc: "Delivery & vendor days", color: "#4285F4", initials: "Cal", defaultOn: true },
  { id: "qb", name: "QuickBooks", desc: "Margins & expenses", color: "#2CA01C", initials: "QB", defaultOn: false },
];

const TONES = [
  { id: "friendly", title: "Friendly neighbor", sample: "Warm, helpful, a little playful—like chatting over the counter." },
  { id: "pro", title: "Clear & professional", sample: "Polite, concise, trustworthy. No fluff." },
  { id: "punchy", title: "Short & punchy", sample: "Quick answers. Emoji-ok. Gets to the point." },
];

const APPROVALS = [
  { id: "ask", title: "Ask me before sending anything", sample: "Safest start. You approve every outbound message or order." },
  { id: "guardrails", title: "Auto within guardrails", sample: "Routine FAQs go out; anything money-related still needs you." },
  { id: "auto", title: "Mostly hands-off", sample: "Agents act; you get a daily digest. Change anytime." },
];

/* ---------- State ---------- */
const state = {
  step: 0,
  business: {
    name: BUSINESS_CONFIG.name,
    type: BUSINESS_CONFIG.type,
    size: BUSINESS_CONFIG.size,
  },
  selectedPains: [], // {id, severity 1-5} in rank order (max 3)
  agentsOn: {},
  tools: {},
  tone: "friendly",
  approval: "ask",
  approvalsResolved: {}, // id -> 'approved' | 'edited'
  launched: false,
};

TOOLS.forEach((t) => { state.tools[t.id] = t.defaultOn; });

function recommendedAgents() {
  const painSet = new Set(state.selectedPains.map((p) => p.id));
  const ids = new Set(["captain"]);
  AGENTS.forEach((a) => {
    if (a.alwaysOn) ids.add(a.id);
    if (a.painIds.some((pid) => painSet.has(pid))) ids.add(a.id);
  });
  return ids;
}

function syncAgentDefaults() {
  const rec = recommendedAgents();
  AGENTS.forEach((a) => {
    if (state.agentsOn[a.id] === undefined) {
      state.agentsOn[a.id] = rec.has(a.id);
    } else if (a.alwaysOn) {
      state.agentsOn[a.id] = true;
    }
  });
}

function activeAgents() {
  return AGENTS.filter((a) => state.agentsOn[a.id]);
}

function tally() {
  let hours = 0;
  let dollars = 0;
  state.selectedPains.forEach((sel) => {
    const pain = PAINS.find((p) => p.id === sel.id);
    if (!pain) return;
    const mult = 0.6 + sel.severity * 0.2; // 0.8–1.6
    hours += Math.round(pain.hours * mult);
    dollars += Math.round(pain.dollars * mult);
  });
  return { hours, dollars };
}

/* ---------- DOM refs ---------- */
const stage = document.getElementById("stage");
const progressEl = document.getElementById("progress");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const navHint = document.getElementById("nav-hint");
const navfoot = document.getElementById("navfoot");
const launchOverlay = document.getElementById("launch-overlay");

/* ---------- Render helpers ---------- */
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

function renderProgress() {
  progressEl.innerHTML = STEP_LABELS.map((label, i) => {
    const cls = i < state.step ? "done" : i === state.step ? "active" : "";
    const line = i < STEP_LABELS.length - 1
      ? `<span class="progress-line ${i < state.step ? "done" : ""}"></span>`
      : "";
    return `<div class="progress-step"><div class="progress-dot ${cls}" title="${label}">${i < state.step ? "✓" : i + 1}</div>${line}</div>`;
  }).join("");
}

function setNav() {
  const last = state.step === STEP_LABELS.length - 1;
  const dash = state.step === 4;
  btnBack.disabled = state.step === 0;
  btnBack.style.visibility = state.step === 0 ? "hidden" : "visible";

  if (state.step === 3) {
    btnNext.textContent = "Launch my team";
    btnNext.classList.add("btn-launch");
  } else if (dash) {
    btnNext.textContent = "See summary";
    btnNext.classList.remove("btn-launch");
  } else if (last) {
    btnNext.textContent = "Get started";
    btnNext.classList.remove("btn-launch");
  } else {
    btnNext.textContent = "Next";
    btnNext.classList.remove("btn-launch");
  }

  // validation
  let ok = true;
  let hint = "";
  if (state.step === 0) {
    ok = !!(state.business.name.trim() && state.business.type.trim() && state.business.size);
  } else if (state.step === 1) {
    ok = state.selectedPains.length >= 1;
    hint = state.selectedPains.length
      ? `${state.selectedPains.length} of 3 ranked · illustrative estimates`
      : "Pick at least 1 pain (up to 3)";
  } else if (state.step === 2) {
    ok = activeAgents().length >= 1;
    hint = `${activeAgents().length} agents on your team`;
  } else if (state.step === 3) {
    hint = "Mock connections · nothing leaves this demo";
  } else if (state.step === 4) {
    hint = "All numbers are sample / illustrative";
  } else {
    hint = "";
  }
  btnNext.disabled = !ok;
  navHint.textContent = hint;

  // hide footer on closing? keep it for Restart + Get started via buttons in screen too
  navfoot.classList.toggle("hidden", false);
}

function go(step) {
  const toastEl = document.querySelector('.toast');
  if (toastEl) toastEl.classList.remove('show');
  state.step = Math.max(0, Math.min(STEP_LABELS.length - 1, step));
  if (state.step === 2) {
    // refresh recommendations when entering agents
    const rec = recommendedAgents();
    AGENTS.forEach((a) => {
      if (a.alwaysOn) state.agentsOn[a.id] = true;
      else if (state.agentsOn[a.id] === undefined || !state._agentsTouched) {
        state.agentsOn[a.id] = rec.has(a.id);
      }
    });
  }
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  renderProgress();
  setNav();
  const renderers = [renderWelcome, renderPains, renderAgents, renderSetup, renderDashboard, renderClosing];
  stage.innerHTML = "";
  const screen = document.createElement("div");
  screen.className = "screen";
  screen.dataset.step = String(state.step);
  screen.innerHTML = renderers[state.step]();
  stage.appendChild(screen);
  bindScreen();
}

/* ---------- Screens ---------- */
function renderWelcome() {
  const sizes = ["Just me", "1–5 people", "6–20 people", "20+ people"];
  const types = [
    "Pet food shop",
    "Cafe / bakery",
    "Boutique retail",
    "Home services",
    "Salon / spa",
    "Other local business",
  ];
  return `
    <div class="screen-eyebrow">Step 1 · About your shop</div>
    <h1 class="screen-title">Let's find where you're losing time and money</h1>
    <p class="screen-sub">Tell us a little about the business. We'll map the busywork to a small team of helpful agents—no jargon required.</p>
    <div class="welcome-hero">
      <div class="welcome-card">
        <div class="form-grid">
          <div class="field">
            <label for="biz-name">Business name</label>
            <input id="biz-name" type="text" value="${escapeHtml(state.business.name)}" autocomplete="organization" />
          </div>
          <div class="field">
            <label>What kind of business?</label>
            <div class="chip-row" id="type-chips">
              ${types.map((t) => `<button type="button" class="chip ${state.business.type === t ? "selected" : ""}" data-type="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("")}
            </div>
          </div>
          <div class="field">
            <label>Team size</label>
            <div class="chip-row" id="size-chips">
              ${sizes.map((s) => `<button type="button" class="chip ${state.business.size === s ? "selected" : ""}" data-size="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}
            </div>
          </div>
        </div>
      </div>
      <aside class="welcome-aside">
        <h3>How this demo works</h3>
        <p>In about two minutes you'll see how ${escapeHtml(BUSINESS_CONFIG.name)} could put an AI crew to work—with you still in charge.</p>
        <div class="aside-list">
          <div class="aside-item"><span class="aside-num">1</span><div><strong>Name the pains</strong>Pick where time and money leak.</div></div>
          <div class="aside-item"><span class="aside-num">2</span><div><strong>Meet your agents</strong>A recommended team, toggles included.</div></div>
          <div class="aside-item"><span class="aside-num">3</span><div><strong>Launch & peek</strong>Sample week of wins—clearly labeled illustrative.</div></div>
        </div>
      </aside>
    </div>
  `;
}

function renderPains() {
  const { hours, dollars } = tally();
  const selectedIds = state.selectedPains.map((p) => p.id);
  return `
    <div class="screen-eyebrow">Step 2 · Pain-point discovery</div>
    <h1 class="screen-title">Where does ${escapeHtml(state.business.name)} feel the pinch?</h1>
    <p class="screen-sub">Tap up to 3. Rank order matters—your first tap is #1. Nudge the severity slider on each pick. Numbers update live and are <strong>illustrative estimates</strong>.</p>
    <div class="pain-layout">
      <div class="card-grid" id="pain-grid">
        ${PAINS.map((pain) => {
          const idx = selectedIds.indexOf(pain.id);
          const selected = idx >= 0;
          const sev = selected ? state.selectedPains[idx].severity : 3;
          return `
            <button type="button" class="pain-card ${selected ? "selected" : ""}" data-pain="${pain.id}" aria-pressed="${selected}">
              ${selected ? `<span class="rank-badge">${idx + 1}</span>` : ""}
              <div class="pain-icon" style="background:${pain.color}">${pain.icon}</div>
              <h3>${escapeHtml(pain.title)}</h3>
              <p>${escapeHtml(pain.desc)}</p>
              <div class="severity" data-stop>
                <label>Severity</label>
                <input type="range" min="1" max="5" value="${sev}" data-sev="${pain.id}" ${selected ? "" : "disabled"} />
                <span class="severity-val">${sev}/5</span>
              </div>
            </button>
          `;
        }).join("")}
      </div>
      <aside class="tally-card" id="tally-card">
        <h3>At stake each week</h3>
        <p class="tally-note">Illustrative estimates based on your selections—not a quote or guarantee.</p>
        <div class="tally-metric">
          <div class="label">Hours lost / week</div>
          <div class="value" id="tally-hours">${hours}</div>
          <div class="unit">illustrative</div>
        </div>
        <div class="tally-metric money">
          <div class="label">$ at stake / week</div>
          <div class="value" id="tally-dollars">$${dollars.toLocaleString()}</div>
          <div class="unit">illustrative</div>
        </div>
        <ul class="tally-selected" id="tally-list">
          ${state.selectedPains.map((sel, i) => {
            const p = PAINS.find((x) => x.id === sel.id);
            return `<li><span>#${i + 1} ${escapeHtml(p.title.split("/")[0].trim())}</span><span>${sel.severity}/5</span></li>`;
          }).join("") || "<li style='color:var(--muted)'>No pains ranked yet</li>"}
        </ul>
      </aside>
    </div>
  `;
}

function renderAgents() {
  const rec = recommendedAgents();
  return `
    <div class="screen-eyebrow">Step 3 · Recommended agent team</div>
    <h1 class="screen-title">Meet the crew for ${escapeHtml(state.business.name)}</h1>
    <p class="screen-sub">Based on your top pains, we pre-selected a lean team. Toggle anyone on or off—Store Captain stays on to coordinate.</p>
    <div class="agent-grid" id="agent-grid">
      ${AGENTS.map((a) => {
        const on = !!state.agentsOn[a.id];
        const isRec = rec.has(a.id);
        const painLabel = a.painIds
          .map((pid) => PAINS.find((p) => p.id === pid))
          .filter(Boolean)
          .filter((p) => state.selectedPains.some((s) => s.id === p.id))
          .map((p) => p.title.split("/")[0].trim())
          .slice(0, 2)
          .join(" · ") || (a.alwaysOn ? "Coordinates the whole team" : "Optional add-on");
        return `
          <div class="agent-card ${on ? "on" : ""} ${isRec ? "recommended" : ""}" data-agent="${a.id}">
            <div class="agent-top">
              <div class="agent-avatar" style="background:${a.color}">${a.icon}</div>
              <div class="agent-meta">
                <h3>${escapeHtml(a.name)}</h3>
                <div class="agent-role">${escapeHtml(a.role)}</div>
              </div>
              <button type="button" class="agent-toggle" role="switch" aria-checked="${on}" aria-label="Toggle ${escapeHtml(a.name)}" data-toggle="${a.id}" ${a.alwaysOn ? "disabled" : ""}></button>
            </div>
            ${isRec ? `<span class="agent-flag">Recommended for you</span>` : ""}
            <p class="agent-desc">${escapeHtml(a.desc)}</p>
            <span class="agent-pain">Solves: ${escapeHtml(painLabel)}</span>
            <ul class="agent-tasks">
              ${a.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}
            </ul>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderSetup() {
  return `
    <div class="screen-eyebrow">Step 4 · One-click setup</div>
    <h1 class="screen-title">Connect tools & set the ground rules</h1>
    <p class="screen-sub">Mock toggles only—this demo never connects to real accounts. Choose how chatty agents sound and when they ask permission.</p>
    <div class="setup-grid">
      <section class="setup-section">
        <h3>Connect the tools you already use</h3>
        <p class="hint">Illustrative connections for the demo walkthrough.</p>
        <div class="tool-list" id="tool-list">
          ${TOOLS.map((t) => {
            const on = !!state.tools[t.id];
            return `
              <div class="tool-row ${on ? "connected" : ""}" data-tool="${t.id}">
                <div class="tool-icon" style="background:${t.color}">${t.initials}</div>
                <div class="tool-info">
                  <strong>${escapeHtml(t.name)}</strong>
                  <span>${escapeHtml(t.desc)}</span>
                </div>
                <span class="tool-status">${on ? "Connected" : "Not connected"}</span>
                <button type="button" class="btn btn-sm ${on ? "btn-ghost" : "btn-soft"}" data-tool-btn="${t.id}">${on ? "Disconnect" : "Connect"}</button>
              </div>
            `;
          }).join("")}
        </div>
      </section>

      <section class="setup-section">
        <h3>Tone of voice</h3>
        <p class="hint">How should agents sound when they write as ${escapeHtml(state.business.name)}?</p>
        <div class="tone-options" id="tone-options">
          ${TONES.map((t) => `
            <button type="button" class="option-card ${state.tone === t.id ? "selected" : ""}" data-tone="${t.id}">
              <strong>${escapeHtml(t.title)}</strong>
              <span>${escapeHtml(t.sample)}</span>
            </button>
          `).join("")}
        </div>
      </section>

      <section class="setup-section">
        <h3>Approval preference</h3>
        <p class="hint">Default is safest: ask before anything goes out.</p>
        <div class="approval-options" id="approval-options">
          ${APPROVALS.map((a) => `
            <button type="button" class="option-card ${state.approval === a.id ? "selected" : ""}" data-approval="${a.id}">
              <strong>${escapeHtml(a.title)}</strong>
              <span>${escapeHtml(a.sample)}</span>
            </button>
          `).join("")}
        </div>
      </section>
    </div>
  `;
}

function sampleApprovals() {
  const items = [];
  if (state.agentsOn.pantry) {
    items.push({
      id: "a1",
      agentId: "pantry",
      title: "Drafted reorder for 3 low-stock items",
      body: "Salmon treats, grain-free kibble (15lb), and dental chews — awaiting your OK before sending to the supplier.",
    });
  }
  if (state.agentsOn.orders) {
    items.push({
      id: "a2",
      agentId: "orders",
      title: "Flagged 2 subscriptions at risk",
      body: "Maya R. skipped twice; Jordan P. opened three 'pause' emails. Draft win-back notes ready.",
    });
  }
  if (state.agentsOn.growth) {
    items.push({
      id: "a3",
      agentId: "growth",
      title: "Suggested a weekend promo",
      body: "“Fill-a-bowl Friday” — 15% off subscription add-ons. Caption + story frames drafted for Instagram.",
    });
  }
  if (state.agentsOn.pal) {
    items.push({
      id: "a4",
      agentId: "pal",
      title: "Sensitive reply needs a human touch",
      body: "Customer upset about a late delivery. Draft ready — recommend personal apology from you.",
    });
  }
  if (!items.length) {
    items.push({
      id: "a0",
      agentId: "captain",
      title: "Morning briefing ready",
      body: "Store Captain summarized today's priorities. Approve to pin it to your phone.",
    });
  }
  return items.slice(0, 4);
}

function sampleFeed() {
  const feed = [];
  if (state.agentsOn.pal) feed.push({ agentId: "pal", text: "Replied to 12 customer questions", time: "Mon · 9:14a" });
  if (state.agentsOn.pantry) feed.push({ agentId: "pantry", text: "Warned on 4 near-expiry pouches", time: "Mon · 11:02a" });
  if (state.agentsOn.orders) feed.push({ agentId: "orders", text: "Confirmed 18 subscription renewals", time: "Tue · 8:40a" });
  if (state.agentsOn.ship) feed.push({ agentId: "ship", text: "Grouped 7 same-block deliveries", time: "Tue · 2:15p" });
  if (state.agentsOn.cash) feed.push({ agentId: "cash", text: "Flagged 2 low-margin SKUs this week", time: "Wed · 10:20a" });
  if (state.agentsOn.growth) feed.push({ agentId: "growth", text: "Scheduled 3 Instagram drafts for review", time: "Thu · 4:05p" });
  feed.push({ agentId: "captain", text: "Compiled Friday owner briefing", time: "Fri · 7:55a" });
  return feed;
}

function renderDashboard() {
  const approvals = sampleApprovals();
  const feed = sampleFeed();
  const { hours, dollars } = tally();
  const hoursSaved = Math.max(6, Math.round(hours * 0.7));
  return `
    <div class="dash-header">
      <div>
        <div class="screen-eyebrow">Step 5 · Day-one dashboard</div>
        <h1 class="screen-title">This week at ${escapeHtml(state.business.name)}</h1>
        <p class="screen-sub" style="margin-bottom:0">A sample look at what your agents already handled—and what still needs your OK.</p>
      </div>
      <span class="sample-pill">⚑ All figures are sample / illustrative</span>
    </div>

    <div class="kpi-row">
      <div class="kpi">
        <div class="label">Revenue (week)</div>
        <div class="value">$8,420</div>
        <div class="delta">↑ 6% vs last week</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Profit margin</div>
        <div class="value">24%</div>
        <div class="delta">↑ 1.2 pts</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Customer reply time</div>
        <div class="value">11 min</div>
        <div class="delta">↓ from ~4 hrs</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Hours saved</div>
        <div class="value">${hoursSaved}h</div>
        <div class="delta">~$${Math.round(dollars * 0.55).toLocaleString()} protected</div>
        <div class="sample">Illustrative</div>
      </div>
    </div>

    <div class="dash-grid">
      <section class="panel">
        <div class="panel-head">
          <h3>Needs your OK</h3>
          <span class="count" id="approval-count">${approvals.filter((a) => !state.approvalsResolved[a.id]).length} waiting</span>
        </div>
        <div id="approval-list">
          ${approvals.map((item) => {
            const agent = AGENTS.find((a) => a.id === item.agentId);
            const resolved = state.approvalsResolved[item.id];
            return `
              <div class="approval-item ${resolved ? "done" : ""} ${resolved === "edited" ? "edited" : ""}" data-approval-id="${item.id}">
                <div class="approval-top">
                  <div class="mini-avatar" style="background:${agent.color}">${agent.icon}</div>
                  <div class="approval-body">
                    <strong>${escapeHtml(agent.name)} · ${escapeHtml(item.title)}</strong>
                    <p>${escapeHtml(item.body)}</p>
                  </div>
                </div>
                <div class="approval-actions">
                  <button type="button" class="btn btn-sm btn-approve" data-approve="${item.id}">Approve</button>
                  <button type="button" class="btn btn-sm btn-edit" data-edit="${item.id}">Edit</button>
                </div>
                <div class="approval-status">${resolved === "edited" ? "Edited & saved — agent will revise" : "Approved — agent will proceed"}</div>
              </div>
            `;
          }).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <h3>Agent activity</h3>
          <span class="count">This week</span>
        </div>
        <div>
          ${feed.map((f) => {
            const agent = AGENTS.find((a) => a.id === f.agentId);
            return `
              <div class="feed-item">
                <div class="mini-avatar" style="background:${agent.color}">${agent.icon}</div>
                <div class="feed-body">
                  <strong>${escapeHtml(agent.name)}</strong>
                  <p>${escapeHtml(f.text)}</p>
                </div>
                <div class="feed-time">${f.time}</div>
              </div>
            `;
          }).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderClosing() {
  const pains = state.selectedPains.map((s) => PAINS.find((p) => p.id === s.id)).filter(Boolean);
  const agents = activeAgents();
  const { hours, dollars } = tally();
  return `
    <div class="close-wrap">
      <div class="screen-eyebrow" style="justify-content:center">Step 6 · Wrap-up</div>
      <h1 class="screen-title" style="text-align:center">From busywork to a quiet crew</h1>
      <p class="screen-sub" style="margin-left:auto;margin-right:auto;text-align:center">Here's the story you just walked for ${escapeHtml(state.business.name)}.</p>
      <div class="close-card">
        <div class="summary-path">
          <div class="summary-box">
            <h4>Pains</h4>
            <ul>${pains.map((p) => `<li>${p.icon} ${escapeHtml(p.title.split("/")[0].trim())}</li>`).join("") || "<li>None selected</li>"}</ul>
          </div>
          <div class="summary-arrow" aria-hidden="true">→</div>
          <div class="summary-box">
            <h4>Agents</h4>
            <ul>${agents.slice(0, 5).map((a) => `<li>${a.icon} ${escapeHtml(a.name)}</li>`).join("")}</ul>
          </div>
          <div class="summary-arrow" aria-hidden="true">→</div>
          <div class="summary-box">
            <h4>Impact</h4>
            <ul>
              <li>~${Math.max(6, Math.round(hours * 0.7))} hrs/week back</li>
              <li>~$${Math.round(dollars * 0.55).toLocaleString()} protected</li>
              <li>You stay in the loop</li>
            </ul>
          </div>
        </div>
        <div class="impact-row">
          <div class="impact-tile"><div class="n">${pains.length || "—"}</div><div class="l">Pains ranked</div></div>
          <div class="impact-tile"><div class="n">${agents.length}</div><div class="l">Agents on team</div></div>
          <div class="impact-tile"><div class="n">${Object.keys(state.tools).filter((k) => state.tools[k]).length}</div><div class="l">Tools connected</div></div>
        </div>
        <p style="font-size:13px;color:var(--muted);text-align:center;margin-bottom:18px">Impact figures are illustrative estimates from this demo—not a performance guarantee.</p>
        <div class="close-actions">
          <button type="button" class="btn btn-primary btn-launch" id="cta-start">Get started</button>
          <button type="button" class="btn btn-ghost" id="cta-restart">Restart demo</button>
        </div>
      </div>
      <p class="close-note">Neighborhood Agents · sales demo for small businesses</p>
    </div>
  `;
}

/* ---------- Bindings ---------- */
function bindScreen() {
  if (state.step === 0) {
    const name = document.getElementById("biz-name");
    name?.addEventListener("input", (e) => {
      state.business.name = e.target.value;
      setNav();
    });
    document.getElementById("type-chips")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-type]");
      if (!btn) return;
      state.business.type = btn.dataset.type;
      render();
    });
    document.getElementById("size-chips")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-size]");
      if (!btn) return;
      state.business.size = btn.dataset.size;
      render();
    });
  }

  if (state.step === 1) {
    document.getElementById("pain-grid")?.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop]")) return;
      const card = e.target.closest("[data-pain]");
      if (!card) return;
      const id = card.dataset.pain;
      const idx = state.selectedPains.findIndex((p) => p.id === id);
      if (idx >= 0) {
        state.selectedPains.splice(idx, 1);
      } else {
        if (state.selectedPains.length >= 3) {
          toast("Rank your top 3 only — deselect one first");
          return;
        }
        state.selectedPains.push({ id, severity: 3 });
      }
      // reset agent touch so recommendations refresh next step
      state._agentsTouched = false;
      AGENTS.forEach((a) => {
        if (!a.alwaysOn) delete state.agentsOn[a.id];
      });
      render();
    });
    document.getElementById("pain-grid")?.addEventListener("input", (e) => {
      const input = e.target.closest("[data-sev]");
      if (!input) return;
      e.stopPropagation();
      const id = input.dataset.sev;
      const sel = state.selectedPains.find((p) => p.id === id);
      if (!sel) return;
      sel.severity = Number(input.value);
      const val = input.parentElement.querySelector(".severity-val");
      if (val) val.textContent = `${sel.severity}/5`;
      updateTallyLive();
    });
  }

  if (state.step === 2) {
    document.getElementById("agent-grid")?.addEventListener("click", (e) => {
      const toggle = e.target.closest("[data-toggle]");
      if (!toggle || toggle.disabled) return;
      const id = toggle.dataset.toggle;
      state.agentsOn[id] = !state.agentsOn[id];
      state._agentsTouched = true;
      render();
    });
  }

  if (state.step === 3) {
    document.getElementById("tool-list")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tool-btn]");
      if (!btn) return;
      const id = btn.dataset.toolBtn;
      state.tools[id] = !state.tools[id];
      render();
    });
    document.getElementById("tone-options")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-tone]");
      if (!btn) return;
      state.tone = btn.dataset.tone;
      render();
    });
    document.getElementById("approval-options")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-approval]");
      if (!btn) return;
      state.approval = btn.dataset.approval;
      render();
    });
  }

  if (state.step === 4) {
    document.getElementById("approval-list")?.addEventListener("click", (e) => {
      const approve = e.target.closest("[data-approve]");
      const edit = e.target.closest("[data-edit]");
      if (approve) {
        state.approvalsResolved[approve.dataset.approve] = "approved";
        toast("Approved — agent will proceed");
        render();
      } else if (edit) {
        state.approvalsResolved[edit.dataset.edit] = "edited";
        toast("Marked for edit — agent will revise");
        render();
      }
    });
  }

  if (state.step === 5) {
    document.getElementById("cta-start")?.addEventListener("click", () => {
      toast("In a real pitch, this opens signup. Nice work!");
    });
    document.getElementById("cta-restart")?.addEventListener("click", restartDemo);
  }
}

function updateTallyLive() {
  const { hours, dollars } = tally();
  const h = document.getElementById("tally-hours");
  const d = document.getElementById("tally-dollars");
  const list = document.getElementById("tally-list");
  if (h) h.textContent = String(hours);
  if (d) d.textContent = `$${dollars.toLocaleString()}`;
  if (list) {
    list.innerHTML = state.selectedPains.map((sel, i) => {
      const p = PAINS.find((x) => x.id === sel.id);
      return `<li><span>#${i + 1} ${escapeHtml(p.title.split("/")[0].trim())}</span><span>${sel.severity}/5</span></li>`;
    }).join("") || "<li style='color:var(--muted)'>No pains ranked yet</li>";
  }
  setNav();
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function restartDemo() {
  state.step = 0;
  state.business = {
    name: BUSINESS_CONFIG.name,
    type: BUSINESS_CONFIG.type,
    size: BUSINESS_CONFIG.size,
  };
  state.selectedPains = [];
  state.agentsOn = {};
  state._agentsTouched = false;
  TOOLS.forEach((t) => { state.tools[t.id] = t.defaultOn; });
  state.tone = "friendly";
  state.approval = "ask";
  state.approvalsResolved = {};
  state.launched = false;
  go(0);
}

/* ---------- Launch sequence ---------- */
function runLaunchSequence() {
  return new Promise((resolve) => {
    const agents = activeAgents();
    launchOverlay.hidden = false;
    const list = document.getElementById("launch-list");
    const bar = document.getElementById("launch-bar-fill");
    list.innerHTML = agents.map((a) => `<li data-launch="${a.id}"><span class="dot"></span>${a.icon} ${escapeHtml(a.name)} — standing by</li>`).join("");
    bar.style.width = "0%";

    const totalMs = 5200;
    const stepMs = totalMs / (agents.length + 1);
    let i = 0;

    const tick = () => {
      if (i < agents.length) {
        const li = list.querySelector(`[data-launch="${agents[i].id}"]`);
        if (li) {
          li.classList.add("online");
          li.innerHTML = `<span class="dot"></span>${agents[i].icon} ${escapeHtml(agents[i].name)} — online`;
        }
        bar.style.width = `${Math.round(((i + 1) / agents.length) * 100)}%`;
        i += 1;
        setTimeout(tick, stepMs);
      } else {
        bar.style.width = "100%";
        setTimeout(() => {
          launchOverlay.hidden = true;
          state.launched = true;
          resolve();
        }, 450);
      }
    };
    setTimeout(tick, 400);
  });
}

/* ---------- Nav events ---------- */
btnBack.addEventListener("click", () => {
  if (state.step > 0) go(state.step - 1);
});

btnNext.addEventListener("click", async () => {
  if (btnNext.disabled) return;
  if (state.step === 3) {
    btnNext.disabled = true;
    await runLaunchSequence();
    go(4);
    return;
  }
  if (state.step === 5) {
    toast("In a real pitch, this opens signup. Nice work!");
    return;
  }
  go(state.step + 1);
});

/* ---------- Boot with helpful defaults for demo ---------- */
(function boot() {
  // Prefill top 3 pains so salesperson can skip ahead if needed, but leave unselected
  // so discovery feels interactive. Business fields prefilled via BUSINESS_CONFIG.
  syncAgentDefaults();
  render();
})();
