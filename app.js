/* =========================================================
   Gemini agent team — interactive sales demo (Paws & Pantry)
   Change BUSINESS_CONFIG below to re-theme the whole demo.
   All numbers are SAMPLE / ILLUSTRATIVE.
   ========================================================= */

const BUSINESS_CONFIG = {
  name: "Paws & Pantry",
  type: "Pet food shop",
  size: "1–5 people",
  ownerFirstName: "Alex",
  street: "Elm St",
  tagline: "Neighborhood pet-food shop with subscription delivery",
};

/* Step 1 choices. Nothing is preselected; Pet food uses the Paws & Pantry sample, others swap name/type text. */
const BIZ_TYPES = [
  { id: "pet", label: "Pet food & supplies", icon: "🐾", noun: "pet food shop", sample: "Paws & Pantry" },
  { id: "cafe", label: "Coffee shop / café", icon: "☕", noun: "café", sample: "Corner Café" },
  { id: "bakery", label: "Bakery", icon: "🥐", noun: "bakery", sample: "Rise Bakery" },
  { id: "boutique", label: "Boutique / apparel", icon: "👗", noun: "boutique", sample: "Thread & Co." },
  { id: "salon", label: "Salon / spa", icon: "💇", noun: "salon", sample: "Glow Studio" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️", noun: "restaurant", sample: "Elm Street Kitchen" },
  { id: "other", label: "Other", icon: "✳️", noun: "business", sample: "Your shop" },
];
const BIZ_SIZES = [
  { id: "solo", label: "Just me", phrase: "just you" },
  { id: "2-5", label: "2–5", phrase: "2–5 people" },
  { id: "6-20", label: "6–20", phrase: "6–20 people" },
  { id: "20+", label: "20+", phrase: "20+ people" },
];
const bizType = () => BIZ_TYPES.find((t) => t.id === state.business.type);
const bizSize = () => BIZ_SIZES.find((x) => x.id === state.business.size);
function bizName() {
  const n = (state.business.name || "").trim();
  if (n) return n;
  const t = bizType();
  return t ? t.sample : BUSINESS_CONFIG.name;
}
function bizNoun() {
  const t = bizType();
  if (!t) return "business";
  if (t.id === "other") return (state.business.other || "").trim().toLowerCase() || "business";
  return t.noun;
}

const STEP_LABELS = ["Welcome", "Pains", "Agents", "Connect", "Dashboard", "Home"];

/* Two-level, MECE pain structure. Hours/$ per sub-point are a fixed ILLUSTRATIVE typical weekly estimate (editable in the source card). */
const PAIN_GROUPS = [
  {
    id: "acquire", short: "New customers", title: "I can't get enough new customers.", icon: "🧲", color: "#EDE9FE",
    subs: [
      { id: "acq_find", title: "I have no steady way to find and win new customers.", short: "No steady way to win new customers", hours: 4, dollars: 540, agents: ["growth"] },
      { id: "acq_budget", title: "I don't know how to split my ads and social budget, or whether it's working.", short: "Unclear ad & social budget results", hours: 2, dollars: 360, agents: ["growth"] },
      { id: "acq_time", title: "I don't have time to market consistently.", short: "No time to market consistently", hours: 5, dollars: 300, agents: ["growth"] },
    ],
    connectors: [{ id: "gads" }, { id: "meta" }, { id: "tiktok" }, { id: "gbp" }, { id: "klaviyo", label: "Klaviyo or Mailchimp" }],
  },
  {
    id: "retain", short: "Losing customers", title: "I lose customers I already have.", icon: "🔁", color: "#FCE8E2",
    subs: [
      { id: "ret_slow", title: "I'm slow to reply to questions and complaints.", short: "Slow replies to questions & complaints", hours: 7, dollars: 336, agents: ["pal"] },
      { id: "ret_drop", title: "Subscribers and regulars quietly drop off.", short: "Subscribers & regulars dropping off", hours: 4, dollars: 780, agents: ["orders"] },
    ],
    connectors: [{ id: "gmail" }, { id: "sms" }, { id: "igdm" }, { id: "recharge" }, { id: "klaviyo", label: "Klaviyo" }],
  },
  {
    id: "ops", short: "Operations", title: "Day-to-day operations are chaos.", icon: "📦", color: "#FEF3C7",
    subs: [
      { id: "ops_stock", title: "I run out of best sellers or get stuck with stock that expires.", short: "Stockouts & expiring stock", hours: 5, dollars: 504, agents: ["pantry"] },
      { id: "ops_ship", title: "Packing and delivery keep going wrong.", short: "Packing & delivery mistakes", hours: 6, dollars: 432, agents: ["ship"] },
    ],
    connectors: [{ id: "shopify", label: "Shopify or WooCommerce" }, { id: "square", label: "Square POS" }, { id: "supplier" }, { id: "shipstation" }],
  },
  {
    id: "numbers", short: "Numbers", title: "I don't really know my numbers.", icon: "📊", color: "#DCFCE7",
    subs: [
      { id: "num_margin", title: "I don't know my margins or where the money goes.", short: "Unclear margins & money flow", hours: 4, dollars: 576, agents: ["cash"] },
      { id: "num_data", title: "My data is spread across apps, so I never see the whole picture.", short: "Data scattered across apps", hours: 2, dollars: 180, agents: ["cash"] },
    ],
    connectors: [{ id: "quickbooks" }, { id: "stripe" }, { id: "square", label: "Square" }, { id: "shopify", label: "Shopify" }, { id: "sheets" }],
  },
  {
    id: "stretched", short: "Stretched thin", title: "I'm stretched too thin to run it all.", icon: "⏳", color: "#CCFBF1",
    subs: [
      { id: "str_tools", title: "My tools don't talk to each other, and setting up new ones takes forever.", short: "Tools don't connect; setup is slow", hours: 4, dollars: 144, agents: ["captain"] },
      { id: "str_decide", title: "I can't keep up with every decision.", short: "Can't keep up with every decision", hours: 5, dollars: 240, agents: ["captain"] },
      { id: "str_trust", title: "I don't trust automation, so I check everything myself.", short: "Checking every automation myself", hours: 4, dollars: 120, agents: ["captain"] },
    ],
    connectors: [{ id: "approvals" }, { id: "gcal" }, { id: "gmail" }],
  },
];
const ALL_SUBS = PAIN_GROUPS.flatMap((g) => g.subs.map((s) => ({ ...s, group: g.id })));
const AGENT_HOME_GROUP = { growth: "acquire", pal: "retain", orders: "retain", pantry: "ops", ship: "ops", cash: "numbers", captain: "stretched" };

const CONNECTORS = {
  gads: { name: "Google Ads", desc: "Search ad spend & results", initials: "GA", color: "#4285F4" },
  meta: { name: "Meta (Facebook & Instagram)", desc: "Ads, posts & audiences", initials: "Me", color: "#0866FF" },
  tiktok: { name: "TikTok", desc: "Short videos & ads", initials: "Tk", color: "#EE1D52" },
  gbp: { name: "Google Business Profile", desc: "Maps listing & reviews", initials: "GB", color: "#34A853" },
  klaviyo: { name: "Klaviyo or Mailchimp", desc: "Email & SMS campaigns", initials: "Kl", color: "#232323" },
  gmail: { name: "Gmail", desc: "Customer emails & replies", initials: "Gm", color: "#EA4335" },
  sms: { name: "SMS (Twilio)", desc: "Text replies & alerts", initials: "Tw", color: "#F22F46" },
  igdm: { name: "Instagram DMs", desc: "Customer messages", initials: "Ig", color: "#E1306C" },
  recharge: { name: "Recharge (subscriptions)", desc: "Subscription skips & renewals", initials: "Rc", color: "#3901F1" },
  shopify: { name: "Shopify or WooCommerce", desc: "Online orders & inventory", initials: "Sh", color: "#5E8E3E" },
  square: { name: "Square POS", desc: "In-store sales & stock", initials: "Sq", color: "#006AFF" },
  supplier: { name: "Supplier email / inventory", desc: "Reorders & price lists", initials: "Su", color: "#B45309" },
  shipstation: { name: "ShipStation", desc: "Labels & delivery tracking", initials: "SS", color: "#6B8E23" },
  quickbooks: { name: "QuickBooks", desc: "Costs, margins & expenses", initials: "QB", color: "#2CA01C" },
  stripe: { name: "Stripe", desc: "Payments & payouts", initials: "St", color: "#635BFF" },
  sheets: { name: "Google Sheets", desc: "Your existing spreadsheets", initials: "GS", color: "#0F9D58" },
  approvals: { name: "Slack or text (one-tap approvals)", desc: "Approve from your phone", initials: "OK", color: "#4A154B" },
  gcal: { name: "Google Calendar", desc: "Delivery & vendor days", initials: "Cal", color: "#4285F4" },
};
const DEFAULT_CONNECTED = ["gmail", "square", "gcal"];

const AGENTS = [
  { id: "captain", name: "Store Captain", role: "Your chief of staff", icon: "🧭", color: "#CCFBF1", desc: "Keeps the whole team coordinated and surfaces what needs your eye.", tasks: ["Morning briefing of what's urgent", "Routes work to the right agent", "Nags gently when approvals wait"], alwaysOn: true },
  { id: "pal", name: "Customer Pal", role: "Customer care", icon: "🤝", color: "#DBEAFE", desc: "Answers common questions in your voice and flags the tricky ones.", tasks: ["Reply to FAQs in minutes", "Escalate upset messages to you", "Log requests for the team"] },
  { id: "orders", name: "Order Desk", role: "Sales & subscriptions", icon: "🧾", color: "#FCE8E2", desc: "Watches subscriptions, nudges renewals, and catches churn early.", tasks: ["Flag at-risk subscribers", "Draft win-back notes", "Confirm upcoming renewals"] },
  { id: "pantry", name: "Pantry Stock", role: "Inventory & suppliers", icon: "🥫", color: "#FEF3C7", desc: "Tracks low stock, drafts reorders, and watches for spoilage.", tasks: ["Draft supplier reorders", "Warn on near-expiry items", "Suggest safer order sizes"] },
  { id: "cash", name: "Cash Sense", role: "Money & margins", icon: "💰", color: "#DCFCE7", desc: "Makes pricing and margin clarity feel simple, not spreadsheet hell.", tasks: ["Highlight low-margin items", "Compare weekly profit", "Suggest price tweaks"] },
  { id: "growth", name: "Growth Spark", role: "Marketing & social", icon: "✨", color: "#EDE9FE", desc: "Drafts promos and posts so marketing happens without a second job.", tasks: ["Draft weekend promos", "Suggest Instagram captions", "Plan a simple campaign"] },
  { id: "ship", name: "Ship & Scoop", role: "Fulfillment & delivery", icon: "🐕", color: "#FFE4E6", desc: "Keeps delivery days tidy and customers informed without phone tag.", tasks: ["Group same-block deliveries", "Send 'out for delivery' texts", "Flag address issues early"] },
];

const APPROVALS = [
  { id: "ask", title: "Ask me before sending anything", sample: "Safest start. You approve every outbound message or order." },
  { id: "guardrails", title: "Auto within guardrails", sample: "Routine FAQs go out; anything money-related still needs you." },
  { id: "auto", title: "Mostly hands-off", sample: "Agents act; you get a daily digest. Change anytime." },
];

/* ---------- Voice & tone ---------- */
const PRESETS = [
  { id: "warm", label: "Warm & friendly", formality: 2, emoji: true },
  { id: "pro", label: "Professional", formality: 4, emoji: false },
  { id: "playful", label: "Playful", formality: 1, emoji: true },
  { id: "concise", label: "Concise", formality: 3, emoji: false },
  { id: "local", label: "Neighborly / local", formality: 2, emoji: false },
  { id: "premium", label: "Premium / expert", formality: 5, emoji: false },
];
/* One-line meaning per voice (shown under the chips, Mindtrip "Communication style" pattern). */
const PRESET_DESC = { warm: "friendly, owns mistakes", pro: "clear and polished", playful: "light, a little fun", concise: "short and to the point", local: "first-name, neighborhood feel", premium: "expert and courteous" };
const FORMALITY_LABELS = ["", "Very casual", "Casual", "Balanced", "Polished", "Formal"];
const DEFAULT_VOICE_PRESET = { captain: "concise", pal: "warm", orders: "warm", pantry: "pro", cash: "concise", growth: "playful", ship: "local" };

const VOICE_LINES = {
  captain: {
    context: "Morning briefing to you", to: "owner", from: "agent", emoji: "🧭",
    lines: {
      warm: "Here's your day: 2 approvals are waiting, the salmon-treat reorder is the big one, and Saturday deliveries look calm.",
      pro: "Today's priorities: two approvals pending, the salmon-treat reorder is time-sensitive, and Saturday deliveries are on schedule.",
      playful: "Coffee first, then this: 2 approvals are waiting, the salmon treats are almost gone, and Saturday looks breezy.",
      concise: "2 approvals waiting. Salmon-treat reorder is urgent. Saturday deliveries on track.",
      local: "Quick rundown before you open up: 2 approvals waiting, salmon treats running low, and Saturday's route is an easy loop around the block.",
      premium: "Your briefing: two items await approval, the salmon-treat replenishment is the priority, and Saturday fulfillment is fully on schedule.",
    },
    detail: "Everything else is handled. I'll check back at noon.",
  },
  pal: {
    context: "Reply to a late-delivery question", to: "Maya", from: "biz", emoji: "🐾",
    lines: {
      warm: "So sorry your order's running late. That's on us! It's out with our driver now and will reach you by 4pm today.",
      pro: "Thank you for reaching out. Your order was delayed and is now scheduled to arrive by 4:00 PM today.",
      playful: "Biscuit's dinner took a little detour, but it's back on the road and will be at your door by 4pm!",
      concise: "Your order's delayed. Arriving by 4pm today.",
      local: "Our driver got held up over on {street}, but your order's on its way and will be with you by 4pm.",
      premium: "Please accept our apologies for the delay. Your order has been prioritized and will arrive by 4:00 PM today.",
    },
    detail: "We've added a free bag of training treats to say sorry.",
  },
  orders: {
    context: "Win-back note to a paused subscriber", to: "Jordan", from: "biz", emoji: "💌",
    lines: {
      warm: "We noticed you paused your monthly box and wanted to check in. We'd love to keep Luna's favorites coming.",
      pro: "We noticed your subscription is paused. We'd be glad to adjust the timing or contents to better suit you.",
      playful: "Luna's food bowl misses us! Want us to restart your box, or tweak what's inside?",
      concise: "Your box is paused. Restart or adjust anytime. Just reply.",
      local: "We missed seeing your box on our delivery list this month. Want us to swing it by again?",
      premium: "Your subscription is currently paused. We'd be pleased to tailor the schedule or selection for Luna.",
    },
    detail: "Reply 'yes' and we'll take 15% off your next box.",
  },
  pantry: {
    context: "Reorder email to your supplier", to: "Sam", from: "biz", emoji: "📦",
    lines: {
      warm: "Hope your week's going well! Could we get 12 bags of grain-free kibble, 20 salmon treat packs, and 10 dental chew tins?",
      pro: "Please process the following order: 12× grain-free kibble (15 lb), 20× salmon treats, 10× dental chews.",
      playful: "Our shelves are looking hungry! Could you send 12 kibble bags, 20 salmon treats, and 10 dental chew tins?",
      concise: "Order: 12 kibble (15 lb), 20 salmon treats, 10 dental chews.",
      local: "Same as usual for the shop on {street}: 12 kibble bags, 20 salmon treats, and 10 dental chews, please.",
      premium: "We'd like to place a replenishment order: 12 grain-free kibble (15 lb), 20 salmon treats, and 10 dental chews.",
    },
    detail: "Delivery by Thursday would be ideal so we're stocked for the weekend.",
  },
  cash: {
    context: "Weekly margin note to you", to: "owner", from: "agent", emoji: "💰",
    lines: {
      warm: "Good news: margin is up a bit this week. Two items are selling below cost after the supplier increase. Worth a look.",
      pro: "Gross margin improved this week. Two items are now below target margin following the supplier price increase.",
      playful: "Margins are flexing this week! But two items are sneakily selling at a loss. Let's fix that.",
      concise: "Margin up. 2 items below cost. Review pricing.",
      local: "Margins are up a little. Two items got pricier from the supplier and we're losing a bit on each sale.",
      premium: "Margin performance improved this week. Two items now fall below target after supplier cost changes; a pricing review is recommended.",
    },
    detail: "A $1 increase on each would bring them back to your 30% target.",
  },
  growth: {
    context: "Instagram caption for a weekend promo", to: null, from: "biz", emoji: "🐶✨",
    lines: {
      warm: "Fill-a-bowl Friday is here! 15% off all subscription add-ons this weekend.",
      pro: "This weekend only: 15% off all subscription add-ons at {biz}.",
      playful: "Tails up! Fill-a-bowl Friday means 15% off every add-on all weekend long.",
      concise: "15% off subscription add-ons. This weekend.",
      local: "Neighbors: Fill-a-bowl Friday is back. 15% off add-ons, in store and on delivery.",
      premium: "An exclusive weekend offer: 15% off our curated subscription add-ons.",
    },
    detail: "Pick from salmon treats, dental chews, or our new calming chews.",
    cta: ["", "Swing by and say hi!", "Come say hi this weekend!", "See you this weekend.", "We'd be glad to see you this weekend.", "We look forward to welcoming you."],
  },
  ship: {
    context: "'Out for delivery' text to a customer", to: "Maya", from: "biz", emoji: "🚚",
    lines: {
      warm: "Your order is out for delivery and should arrive between 2 and 4pm.",
      pro: "Your order is out for delivery. Estimated arrival: 2:00–4:00 PM.",
      playful: "Zoom zoom! Your goodies are on the way. See you between 2 and 4pm.",
      concise: "Out for delivery. ETA 2–4pm.",
      local: "We're heading your way now. You're the 3rd stop on our block run, around 2–4pm.",
      premium: "Your order is en route and will arrive between 2:00 and 4:00 PM.",
    },
    detail: "Reply here if you'd like us to leave it at the side door.",
  },
};


/* ---------- Data inputs (sample) ---------- */
const DEFAULT_INPUTS = (() => {
  const o = {
    revenueWeek: 8420, revenuePrev: 7945, weekCosts: 6400, marginPrev: 22.8,
    replyMin: 11, replyBeforeMin: 240, savingsRate: 70, protectRate: 55,
    "act.faq": 12, "act.expiry": 4, "act.renewals": 18, "act.deliveries": 7,
    "act.lowMargin": 2, "act.igDrafts": 3, "act.reorder": 3, "act.atRisk": 2,
    "scn.atRisk": 30, "scn.atRiskValue": 210, "scn.margin": 31, "scn.sold": 27, "scn.revenue": 187, "scn.waste": 108, "scn.newCust": 6, "scn.reach": 2140, "scn.clicks": 186,
  };
  ALL_SUBS.forEach((p) => { o[`subHours.${p.id}`] = p.hours; o[`subDollars.${p.id}`] = p.dollars; });
  return o;
})();

/* ---------- State ---------- */
const state = {};
function freshState() {
  Object.assign(state, {
    step: 0,
    business: { name: "", type: null, size: null, other: "" },
    selectedSubs: [],
    painGroup: null,
    showMore: false,
    homeTasks: [],
    fixes: {},
    ui: {},
    voiceEdit: null,
    voiceHint: null,
    agentsOn: {},
    _agentsTouched: false,
    tools: {},
    voices: {},
    openVoice: new Set(),
    approval: "ask",
    approvalsResolved: {},
    inputs: { ...DEFAULT_INPUTS },
    overrides: {},
    editedAt: {},
    estimatesConfirmed: null,
    estimateMode: "per-category",
    categoryHours: {},
    totalHours: null,
    costPerHour: null,
    savedEstimates: null,
  });
  Object.keys(CONNECTORS).forEach((id) => { state.tools[id] = DEFAULT_CONNECTED.includes(id); });
  AGENTS.forEach((a) => { state.voices[a.id] = defaultVoice(a.id); });
}
freshState();

/* ---------- Helpers ---------- */
const groupById = (id) => PAIN_GROUPS.find((g) => g.id === id);
const subById = (id) => ALL_SUBS.find((s) => s.id === id);
const subSel = (id) => state.selectedSubs.find((s) => s.id === id);
const countIn = (g) => g.subs.filter((s) => subSel(s.id)).length;
const selectedGroups = () => PAIN_GROUPS.filter((g) => countIn(g) > 0);
const agentById = (id) => AGENTS.find((a) => a.id === id);
const inp = (k) => Number(state.inputs[k]);
function merchantReportedHours() {
  if (state.estimateMode === "total") return Number(state.totalHours) || 0;
  return Object.values(state.categoryHours).reduce((sum, h) => sum + (Number(h) || 0), 0);
}
function merchantReportedCost() {
  return merchantReportedHours() * (Number(state.costPerHour) || 0);
}
function fmtEstHoursNum(n) {
  const v = Number(n) || 0;
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10);
}
function fmtEstHours(n) {
  return `${fmtEstHoursNum(n)}h`;
}
function estFieldVal(v) {
  return v == null || v === "" ? "" : v;
}
function snapshotEstimates() {
  return {
    estimateMode: state.estimateMode,
    categoryHours: { ...state.categoryHours },
    totalHours: state.totalHours,
    costPerHour: state.costPerHour,
  };
}
function restoreEstimates(snap) {
  if (!snap) {
    state.estimateMode = "per-category";
    state.categoryHours = {};
    state.totalHours = null;
    state.costPerHour = null;
    return;
  }
  state.estimateMode = snap.estimateMode;
  state.categoryHours = { ...snap.categoryHours };
  state.totalHours = snap.totalHours;
  state.costPerHour = snap.costPerHour;
}
function readEstimateForm() {
  if (state.estimateMode === "per-category") {
    const next = {};
    selectedGroups().forEach((g) => {
      const el = document.getElementById(`cat-${g.id}`);
      if (!el || el.value === "") return;
      next[g.id] = Number(el.value);
    });
    state.categoryHours = next;
  } else {
    const el = document.getElementById("est-total-hours");
    if (el) state.totalHours = el.value === "" ? null : Number(el.value);
  }
  const costEl = document.getElementById("est-cost-per-hour");
  if (costEl) state.costPerHour = costEl.value === "" ? null : Number(costEl.value);
}
function estimateFormHTML() {
  const cats = selectedGroups();
  const perCat = state.estimateMode === "per-category";
  return `
      <div class="estimate-card editing" data-r="edit-estimates">
        <div class="estimate-content">
          <h3 class="estimate-title">Your time &amp; cost</h3>
          <p class="estimate-sub">Only what you enter is used. Nothing is pre-filled from our numbers.</p>
          <div class="estimate-mode-toggle" role="tablist" aria-label="How to enter hours">
            <button type="button" class="mode-btn ${perCat ? "active" : ""}" data-mode="per-category" role="tab" aria-selected="${perCat}">By category</button>
            <button type="button" class="mode-btn ${perCat ? "" : "active"}" data-mode="total" role="tab" aria-selected="${!perCat}">Just give one total</button>
          </div>
          <div class="estimate-inputs">
            ${perCat ? `
              <div class="category-hours-section">
                <p class="section-label">Hours per week this costs you</p>
                ${cats.map((g) => `
                  <div class="category-field">
                    <label for="cat-${g.id}">${g.icon} ${escapeHtml(g.short)}</label>
                    <div class="input-with-unit">
                      <input type="number" id="cat-${g.id}" class="cat-hours-input" data-cat="${g.id}" value="${estFieldVal(state.categoryHours[g.id])}" placeholder="—" min="0" step="0.5" inputmode="decimal" />
                      <span class="unit-label">hrs/week</span>
                    </div>
                  </div>
                `).join("")}
                <div class="running-total">
                  <strong>Total:</strong> <span id="hours-total">${fmtEstHoursNum(merchantReportedHours())}</span> hrs/week
                </div>
              </div>
            ` : `
              <div class="field">
                <label for="est-total-hours">Total hours per week</label>
                <div class="input-with-unit">
                  <input type="number" id="est-total-hours" value="${estFieldVal(state.totalHours)}" placeholder="—" min="0" step="0.5" inputmode="decimal" />
                  <span class="unit-label">hrs/week</span>
                </div>
                <p class="field-hint">Across ${cats.map((g) => escapeHtml(g.short.toLowerCase())).join(", ")}</p>
              </div>
            `}
            <div class="field cost-field">
              <label for="est-cost-per-hour">Your hourly cost</label>
              <div class="input-with-unit">
                <input type="number" id="est-cost-per-hour" value="${estFieldVal(state.costPerHour)}" placeholder="—" min="0" step="5" inputmode="decimal" />
                <span class="unit-label">$/hr</span>
              </div>
              <p class="field-hint">What an hour of your time is worth to the shop</p>
            </div>
          </div>
          <div class="estimate-actions">
            <button type="button" class="btn btn-sm btn-primary" data-save-estimates>Save</button>
            <button type="button" class="btn btn-sm btn-ghost" data-cancel-edit-estimates>Cancel</button>
          </div>
        </div>
      </div>`;
}
function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nowLabel() {
  return "Today " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function fmt(kind, v) {
  const n = Number(v) || 0;
  if (kind === "money") return `$${Math.round(n).toLocaleString()}`;
  if (kind === "pct") return `${Math.round(n)}%`;
  if (kind === "hours") return `${Math.round(n)}h`;
  if (kind === "minutes") return `${Math.round(n)} min`;
  return `${Math.round(n)}`;
}
function fmtInput(unit, v) {
  if (unit === "$") return `$${Number(v).toLocaleString()}`;
  if (unit) return `${v} ${unit}`;
  return `${v}`;
}
function fmtDuration(min) {
  return min >= 60 ? `~${Math.round(min / 60)} hrs` : `${Math.round(min)} min`;
}

/* ---------- Datapoint registry: every number has a source ---------- */
const SAMPLE_SYNC = "Sample sync · Today 7:02 AM";
function countDP(key, label, source, formula) {
  return { label, kind: "count", source, formula, inputs: () => [{ key, label, unit: "" }], compute: () => inp(key), noOverride: true, updated: SAMPLE_SYNC };
}
const DP = {
  hoursLost: {
    label: "Hours lost / week", kind: "hours",
    source: "Estimate · the problems you picked × typical weekly hours for a shop your size",
    formula: "Sum of the typical hours/week for each problem you picked. Edit any estimate below.",
    inputs: () => state.selectedSubs.map((s) => ({ key: `subHours.${s.id}`, label: `${subById(s.id).short} · typical hrs/week`, unit: "hrs" })),
    breakdown: () => state.selectedSubs.map((s) => `${subById(s.id).short}: ${inp(`subHours.${s.id}`)}h`),
    compute: () => state.selectedSubs.reduce((a, s) => a + inp(`subHours.${s.id}`), 0),
    updated: "Live · recalculates as you pick",
  },
  dollarsAtStake: {
    label: "$ at stake / week", kind: "money",
    source: "Estimate · the problems you picked × typical weekly $ impact (lost sales, spoilage, churn)",
    formula: "Sum of the typical $/week for each problem you picked (lost sales, spoilage, churn). Edit any estimate below.",
    inputs: () => state.selectedSubs.map((s) => ({ key: `subDollars.${s.id}`, label: `${subById(s.id).short} · typical $/week`, unit: "$" })),
    breakdown: () => state.selectedSubs.map((s) => `${subById(s.id).short}: $${inp(`subDollars.${s.id}`).toLocaleString()}`),
    compute: () => state.selectedSubs.reduce((a, s) => a + inp(`subDollars.${s.id}`), 0),
    updated: "Live · recalculates as you pick",
  },
  revenue: {
    label: "Revenue (week)", kind: "money",
    source: "Square POS · net sales, last 7 days",
    formula: "Sum of net sales Mon–Sun. Change % compares with the prior 7 days.",
    inputs: () => [{ key: "revenueWeek", label: "Net sales, last 7 days", unit: "$" }, { key: "revenuePrev", label: "Net sales, prior 7 days", unit: "$" }],
    compute: () => inp("revenueWeek"), updated: SAMPLE_SYNC,
  },
  margin: {
    label: "Profit margin", kind: "pct",
    source: "QuickBooks · gross margin, last 7 days",
    formula: "(Revenue − cost of goods) ÷ Revenue. Change compares with the prior 7 days.",
    deps: ["revenue"],
    inputs: () => [{ key: "weekCosts", label: "Cost of goods, last 7 days", unit: "$" }, { key: "marginPrev", label: "Margin, prior 7 days", unit: "%" }],
    compute: () => { const r = val("revenue"); return r > 0 ? ((r - inp("weekCosts")) / r) * 100 : 0; },
    updated: SAMPLE_SYNC,
  },
  replyTime: {
    label: "Customer reply time", kind: "minutes",
    source: "Gmail + Instagram DMs · avg first reply, last 7 days",
    formula: "Average minutes from a customer's message to the first reply, compared with your pre-agent baseline.",
    inputs: () => [{ key: "replyMin", label: "Avg first reply, last 7 days", unit: "min" }, { key: "replyBeforeMin", label: "Baseline before agents", unit: "min" }],
    compute: () => inp("replyMin"), updated: SAMPLE_SYNC,
  },
  hoursSaved: {
    label: "Hours saved / week", kind: "hours",
    source: "Estimate · share of your lost hours the agents take on",
    formula: "Hours lost/week × share handled by agents",
    deps: ["hoursLost"],
    inputs: () => [{ key: "savingsRate", label: "Share handled by agents", unit: "%" }],
    compute: () => Math.round((val("hoursLost") * inp("savingsRate")) / 100),
    updated: "Illustrative · recalculates live",
  },
  dollarsProtected: {
    label: "$ protected / week", kind: "money",
    source: "Estimate · share of $ at stake the agents help protect",
    formula: "$ at stake/week × share protected by agents",
    deps: ["dollarsAtStake"],
    inputs: () => [{ key: "protectRate", label: "Share protected by agents", unit: "%" }],
    compute: () => Math.round((val("dollarsAtStake") * inp("protectRate")) / 100),
    updated: "Illustrative · recalculates live",
  },
  act_faq: countDP("act.faq", "Customer questions answered", "Gmail + Instagram DMs + SMS · Mon–Fri", "Count of conversations Customer Pal replied to this week"),
  act_expiry: countDP("act.expiry", "Near-expiry items flagged", "Square inventory · expiry dates on file", "Items expiring within 14 days"),
  act_renewals: countDP("act.renewals", "Subscription renewals confirmed", "Recharge subscriptions · this week", "Renewals confirmed without a manual check"),
  act_deliveries: countDP("act.deliveries", "Same-block deliveries grouped", "Google Calendar · delivery slots", "Deliveries combined into shared routes"),
  act_lowMargin: countDP("act.lowMargin", "Low-margin items flagged", "QuickBooks costs + POS prices", "Items whose margin fell below your 30% target"),
  act_igDrafts: countDP("act.igDrafts", "Instagram drafts queued", "Growth Spark drafts · awaiting review", "Posts drafted and waiting for your OK"),
  act_reorder: countDP("act.reorder", "Low-stock items in reorder", "Square inventory · below reorder point", "Items at or below their reorder point"),
  scn_atRisk: countDP("scn.atRisk", "Salmon pouches at risk", "Square inventory · 48 on hand, 21 days to expiry", "On hand − (weekly sales × weeks to expiry): 48 − 6 × 3 = 30"),
  scn_atRiskValue: { label: "Value at risk", kind: "money", source: "Square inventory × shelf price", formula: "Units at risk × $7 shelf price", inputs: () => [{ key: "scn.atRiskValue", label: "Value at risk", unit: "$" }], compute: () => inp("scn.atRiskValue"), noOverride: true, updated: SAMPLE_SYNC },
  scn_margin: { label: "Bundle margin", kind: "pct", source: "QuickBooks unit costs · Cash Sense check", formula: "($20.80 bundle price − $14.40 cost) ÷ $20.80", inputs: () => [{ key: "scn.margin", label: "Bundle margin", unit: "%" }], compute: () => inp("scn.margin"), noOverride: true, updated: SAMPLE_SYNC },
  scn_sold: countDP("scn.sold", "Pouches sold in bundles", "Shopify + Square orders tagged SALMON-BUNDLE · Fri–Sun", "9 bundles × 3 pouches"),
  scn_revenue: { label: "Revenue recovered", kind: "money", source: "Shopify + Square · bundle orders Fri–Sun", formula: "9 bundles × $20.80", inputs: () => [{ key: "scn.revenue", label: "Revenue recovered", unit: "$" }], compute: () => inp("scn.revenue"), noOverride: true, updated: "Sample · Monday after the promo" },
  scn_waste: { label: "Waste avoided", kind: "money", source: "Square inventory · unit cost", formula: "27 pouches sold before expiry × $4 unit cost", inputs: () => [{ key: "scn.waste", label: "Waste avoided", unit: "$" }], compute: () => inp("scn.waste"), noOverride: true, updated: "Sample · Monday after the promo" },
  scn_newCust: countDP("scn.newCust", "New customers from the promo", "Shopify customers · first order used the bundle", "First-time buyers who ordered the bundle"),
  scn_reach: countDP("scn.reach", "Promo reach", "Instagram insights + Klaviyo email opens", "Accounts reached + emails opened (clicks tracked separately)"),
  scn_clicks: countDP("scn.clicks", "Promo clicks", "Instagram link taps + email clicks", "Total clicks to the bundle page"),
  act_atRisk: countDP("act.atRisk", "Subscriptions at risk", "Subscription activity · skips & 'pause' clicks", "Subscribers with 2+ skips or pause clicks in 30 days"),
  sel_pains: { label: "Problems picked", kind: "count", source: "Your choices in Step 2", formula: "Sub-problems you picked across the 5 pain areas", compute: () => state.selectedSubs.length, jump: 1, updated: "Live" },
  sel_agents: { label: "Agents on team", kind: "count", source: "Your choices in Step 3", formula: "Agents toggled on", compute: () => activeAgents().length, jump: 2, updated: "Live" },
  sel_tools: { label: "Tools connected", kind: "count", source: "Your choices in Step 4 (mock connections)", formula: "Connectors toggled to Connected (all groups + More connectors)", compute: () => Object.values(state.tools).filter(Boolean).length, jump: 3, updated: "Live" },
};

function val(id) {
  const o = state.overrides[id];
  return o !== undefined ? o : DP[id].compute();
}
function dpEdited(id) {
  const d = DP[id];
  if (d.jump !== undefined) return false;
  if (state.overrides[id] !== undefined) return true;
  return (d.inputs ? d.inputs() : []).some((i) => Number(state.inputs[i.key]) !== Number(DEFAULT_INPUTS[i.key]));
}
function chip(id) {
  const edited = dpEdited(id);
  return `<button type="button" class="src-chip ${edited ? "edited" : ""}" data-dp="${id}" aria-haspopup="dialog" aria-expanded="false" aria-label="Where ${escapeHtml(DP[id].label)} comes from">i</button>${edited ? `<span class="edited-badge">Edited by you</span>` : ""}`;
}

/* ---------- Agents ---------- */
function recommendedAgents() {
  const ids = new Set(["captain"]);
  state.selectedSubs.forEach((s) => subById(s.id).agents.forEach((a) => ids.add(a)));
  return ids;
}
function activeAgents() { return AGENTS.filter((a) => state.agentsOn[a.id]); }

/* ---------- Voice message builder ---------- */
function fillVars(s) {
  return s.replace(/\{biz\}/g, bizName()).replace(/\{street\}/g, BUSINESS_CONFIG.street);
}
/* Multi-select voices: up to 3 presets blend into one voice. The first pick sets the base line;
   extra picks layer on composable phrasing. Conflicting pairs can't be combined. */
const PRESET_SHORT = { warm: "Warm", pro: "Professional", playful: "Playful", concise: "Concise", local: "Neighborly", premium: "Premium" };
const PRESET_CONFLICTS = { pro: ["playful"], playful: ["pro", "premium"], premium: ["playful", "concise"], concise: ["premium"], warm: [], local: [] };
const MAX_PRESETS = 3;
const VOICE_MODS = {
  warm: { customer: "We really appreciate you!", owner: "Nice work this week.", post: "We love our pack!" },
  local: { customer: "See you around {street}!", owner: "The {street} regulars will be happy.", post: "Swing by on {street}!" },
  playful: { customer: "Tails up!", owner: "Onward, captain!", post: "Zoomies encouraged!" },
  premium: { customer: "As always, it's our pleasure to look after you.", owner: "Happy to walk you through the details anytime.", post: "Thoughtfully sourced, always." },
  pro: null,
  concise: null,
};
function defaultVoice(agentId) {
  const p = PRESETS.find((x) => x.id === (DEFAULT_VOICE_PRESET[agentId] || "warm"));
  return { preset: p.id, presets: [p.id], formality: p.formality, emoji: p.emoji, length: "short" };
}
function presetLabel(id) { return (PRESETS.find((p) => p.id === id) || PRESETS[0]).label; }
const vPresets = (v) => (v.presets && v.presets.length ? v.presets : [v.preset]);
function voiceLabel(v) { return vPresets(v).map((id) => PRESET_SHORT[id]).join(" + "); }
function presetConflicts(v, pid) {
  const sel = vPresets(v);
  return sel.filter((s) => (PRESET_CONFLICTS[pid] || []).includes(s));
}
/* Returns a hint string when the tap can't be applied; otherwise mutates the voice. */
function togglePreset(v, pid) {
  const sel = [...vPresets(v)];
  if (sel.includes(pid)) {
    if (sel.length === 1) return "Keep at least one voice.";
    sel.splice(sel.indexOf(pid), 1);
  } else {
    const c = presetConflicts(v, pid);
    if (c.length) return `${PRESET_SHORT[pid]} can't combine with ${c.map((x) => PRESET_SHORT[x]).join(" or ")}.`;
    if (sel.length >= MAX_PRESETS) return `Up to ${MAX_PRESETS} voices. Tap one to remove it.`;
    sel.push(pid);
  }
  const ps = sel.map((id) => PRESETS.find((p) => p.id === id));
  v.presets = sel;
  v.preset = sel[0];
  v.formality = Math.round(ps.reduce((a, p) => a + p.formality, 0) / ps.length);
  v.emoji = ps.some((p) => p.emoji) && !sel.some((id) => id === "pro" || id === "concise" || id === "premium");
  return "";
}
function setPresetsSingle(v, pid) {
  const p = PRESETS.find((x) => x.id === pid);
  Object.assign(v, { preset: pid, presets: [pid], formality: p.formality, emoji: p.emoji });
}
function blendBody(agentId, v) {
  const vd = VOICE_LINES[agentId];
  const sel = vPresets(v);
  const aud = vd.to === "owner" ? "owner" : vd.to ? "customer" : "post";
  let body = fillVars(vd.lines[sel[0]]);
  const extras = sel.slice(1);
  if (extras.includes("concise")) body = body.split(/(?<=[.!?])\s+/)[0];
  extras.forEach((id) => { const m = VOICE_MODS[id]; if (m) body += ` ${fillVars(m[aud])}`; });
  if (extras.includes("pro")) body = body.replace(/!/g, ".");
  return body;
}
function greeting(preset, f, name) {
  if (f === 1) return `Hey ${name}!`;
  if (f === 2) return `Hi ${name}!`;
  if (f === 4) return `Hello ${name},`;
  if (f === 5) return `Dear ${name},`;
  return { warm: `Hi ${name}!`, pro: `Hello ${name},`, playful: `Hey ${name}!`, concise: `${name}:`, local: `Hi ${name},`, premium: `Good afternoon, ${name}.` }[preset];
}
function signoff(f, sender) {
  return ["Cheers,", "Cheers,", "Thanks,", "Best regards,", "Kind regards,"][f - 1] + `\n${sender}`;
}
function voiceMessage(agentId, v = state.voices[agentId]) {
  const vd = VOICE_LINES[agentId];
  const agent = agentById(agentId);
  const parts = [];
  const toName = vd.to === "owner" ? BUSINESS_CONFIG.ownerFirstName : vd.to;
  if (toName) parts.push(greeting(v.preset, v.formality, toName));
  let body = blendBody(agentId, v);
  if (v.emoji) body += ` ${vd.emoji}`;
  if (v.length === "detailed") body += ` ${fillVars(vd.detail)}`;
  if (!toName && vd.cta) body += ` ${vd.cta[v.formality]}`;
  parts.push(body);
  if (!toName) {
    if (v.length === "detailed") parts.push(`#${bizName().replace(/[^A-Za-z0-9]/g, "")} #ShopLocal${v.emoji ? " 🐾" : ""}`);
  } else if (v.length === "detailed" || v.formality >= 4) {
    parts.push(signoff(v.formality, vd.from === "agent" ? agent.name : bizName()));
  }
  return parts.join("\n");
}
function voiceSummary(v) {
  return `${voiceLabel(v)} · ${FORMALITY_LABELS[v.formality]} · ${v.emoji ? "Emoji on" : "No emoji"} · ${v.length === "short" ? "Short" : "Detailed"}`;
}
/* Chip row shared by Step 3 and Step 4 (multi-select with conflict states). */
function presetChipsHTML(a) {
  const v = state.voices[a.id];
  const sel = vPresets(v);
  return `<div class="preset-row" role="group" aria-label="Voice for ${escapeHtml(a.name)} (pick up to ${MAX_PRESETS})">
    ${PRESETS.map((p) => {
      const on = sel.includes(p.id);
      const c = on ? [] : presetConflicts(v, p.id);
      const blocked = c.length > 0;
      return `<button type="button" class="preset ${on ? "selected" : ""} ${blocked ? "blocked" : ""}" aria-pressed="${on}" ${blocked ? `aria-disabled="true" title="Can't combine with ${c.map((x) => PRESET_SHORT[x]).join(" or ")}"` : ""} data-preset="${p.id}" data-vagent="${a.id}"><span class="preset-mark" aria-hidden="true">${on ? "✓" : blocked ? "" : "+"}</span>${escapeHtml(PRESET_SHORT[p.id])}</button>`;
    }).join("")}
  </div>
  <p class="voice-hint ${state.voiceHint && state.voiceHint.id === a.id ? "warn" : ""}" data-voice-hint="${a.id}" aria-live="polite">${state.voiceHint && state.voiceHint.id === a.id ? escapeHtml(state.voiceHint.text) : escapeHtml((sel.length ? `${PRESET_SHORT[sel[sel.length - 1]]}: ${PRESET_DESC[sel[sel.length - 1]]}` : "Pick a voice") + (sel.length < MAX_PRESETS ? ` · blend up to ${MAX_PRESETS}` : ""))}</p>`;
}

/* ---------- DOM refs ---------- */
const stage = document.getElementById("stage");
const progressEl = document.getElementById("progress");
const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const navHint = document.getElementById("nav-hint");
const launchOverlay = document.getElementById("launch-overlay");

/* ---------- Toast ---------- */
function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- Source popover ---------- */
const popBackdrop = document.createElement("div");
popBackdrop.className = "pop-backdrop";
popBackdrop.hidden = true;
const popEl = document.createElement("div");
popEl.className = "popover";
popEl.setAttribute("role", "dialog");
popEl.hidden = true;
document.body.append(popBackdrop, popEl);
const pop = { id: null, mode: "view", anchor: null, error: "", openItem: null, measure: false };
/* ---------- Activity insights: what happened → why → suggested fix (all SAMPLE / illustrative) ---------- */
const CHANNELS = { gmail: { t: "Gmail", c: "#EA4335" }, ig: { t: "IG", c: "#C13584" }, sms: { t: "SMS", c: "#34A853" } };
const FIXES = {
  fx_eta: { title: "Auto-text delivery ETAs on Tuesday routes", agents: ["ship", "pal"], impact: "~5 fewer “where's my order?” questions a week" },
  fx_faq: { title: "Add an allergy & ingredients FAQ and auto-reply with it", agents: ["pal"], impact: "~3 questions a week answered instantly" },
  fx_skip: { title: "Offer “skip a box” before anyone can cancel", agents: ["orders"], impact: "Keeps ~1 in 3 would-be cancellations" },
  fx_loyal: { title: "Auto-offer 10% loyalty pricing after 2 skips", agents: ["orders"], impact: "~$90/month in kept subscriptions" },
  fx_bundle: { title: "Bundle near-expiry pouches into a weekend promo", agents: ["growth"], impact: "Clears ~20 units before they expire" },
  fx_fifo: { title: "Lower pouch reorder qty + first-expiry-first-out reminder", agents: ["pantry"], impact: "~$60/week less spoilage" },
  fx_dyn: { title: "Switch fast movers to demand-based reorder points", agents: ["pantry"], impact: "Fewer stock-outs on items like dental chews" },
  fx_pace: { title: "Alert you when an item sells 2× its usual pace", agents: ["pantry", "captain"], impact: "Heads-up ~3 days earlier" },
  fx_card: { title: "Send card-expiry reminders 7 days before renewal", agents: ["orders"], impact: "Avoids ~1 failed renewal a week" },
  fx_slot: { title: "Nudge same-block customers to the shared Tuesday slot", agents: ["ship"], impact: "~1 hour saved per route" },
  fx_price: { title: "Raise raw bites by $1.50 to restore margin", agents: ["cash"], impact: "Back to ~30% margin on that line" },
  fx_min: { title: "Set a $25 minimum for free delivery", agents: ["cash", "ship"], impact: "Recovers ~$40/week in fees" },
  fx_reorder20: { title: "Lower salmon pouch reorder qty by 20%", agents: ["pantry"], impact: "Avoids most of next month's excess" },
  fx_evergreen: { title: "Auto-approve evergreen posts; review only promos", agents: ["growth"], impact: "Posts go out ~2 days sooner" },
};
/* Split a total across weights (largest remainder) so theme counts always add up to the metric. */
function splitCount(total, weights) {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { out[i]++; left--; } });
  return out;
}
const INSIGHTS = {
  act_faq: {
    agent: "pal", head: "By theme",
    items: [
      { id: "eta", title: "Where's my order?", w: 5, snippets: [
        { ch: "sms", time: "Tue · 10:12a", name: "Maya", msg: "Hi, my Tuesday box still isn't here. Any update?", core: "Your box is on today's Tuesday route and should arrive by 4pm. I'll text you when the driver is 10 minutes away!" },
        { ch: "ig", time: "Tue · 1:40p", name: "Sam", msg: "Is my delivery still coming today?", core: "Yes! It's out with our driver now and due before 5pm." } ] },
      { id: "allergy", title: "Ingredient / allergy", w: 3, snippets: [
        { ch: "gmail", time: "Mon · 9:14a", name: "Priya", msg: "Does the salmon kibble have chicken in it? My dog is allergic.", core: "Great question! Our grain-free salmon kibble is chicken-free. The full ingredient list is on the bag and on our site." } ] },
      { id: "day", title: "Change delivery day", w: 2, snippets: [
        { ch: "sms", time: "Wed · 8:05a", name: "Jordan", msg: "Can I move my box to Thursdays?", core: "Done! Your box now arrives on Thursdays, starting next week." } ] },
      { id: "billing", title: "Billing", w: 2, snippets: [
        { ch: "gmail", time: "Thu · 3:22p", name: "Lee", msg: "I think I was charged twice this month.", core: "Sorry about that! I've refunded the duplicate charge. It should show in 3–5 days." } ] },
    ],
    counts: () => splitCount(val("act_faq"), INSIGHTS.act_faq.items.map((i) => i.w)),
    why: () => { const c = INSIGHTS.act_faq.counts(); return `${c[0]} of ${val("act_faq")} questions were about late deliveries on Tuesday routes.`; },
    fixes: ["fx_eta", "fx_faq"],
  },
  act_atRisk: {
    agent: "orders", head: "Subscribers",
    items: [
      { id: "maya", title: "Maya R.", meta: "At risk", reason: "Skipped her box twice in a row.", did: "Drafted a check-in note and offered every-3-weeks delivery." },
      { id: "jordan", title: "Jordan P.", meta: "At risk", reason: "Opened the “pause subscription” email 3 times.", did: "Prepared a skip-a-box option instead of cancelling." },
      { id: "chen", title: "Chen L.", meta: "Saved", ok: true, reason: "Complained the box went up $4.", did: "Offered 10% loyalty pricing. Chen stayed on." },
    ],
    why: () => "At-risk subscribers skipped or paused right after the monthly price change.",
    fixes: ["fx_skip", "fx_loyal"],
  },
  act_expiry: {
    agent: "pantry", head: "Items",
    items: [
      { id: "salmon", title: "Grain-free salmon pouches", meta: "3 days · 14 units", reason: "Ordered a case of 48 against ~10 sold a week.", did: "Flagged for a promo and held the next case." },
      { id: "turkey", title: "Turkey & pumpkin pouches", meta: "6 days · 9 units", reason: "Newer stock was shelved in front of older stock.", did: "Added a shelf-rotation reminder for Monday." },
      { id: "stew", title: "Puppy chicken stew", meta: "9 days · 6 units", reason: "Sales slowed after a competitor's promo.", did: "Suggested pairing it with puppy kibble." },
      { id: "lamb", title: "Lamb & rice pouches", meta: "12 days · 5 units", reason: "Seasonal dip in demand.", did: "Watching. No action yet." },
    ],
    why: () => "Pouches are reordered by the case, faster than they sell, and newer stock goes in front.",
    fixes: ["fx_bundle", "fx_fifo"],
  },
  act_reorder: {
    agent: "pantry", head: "Items",
    items: [
      { id: "dental", title: "Dental chews", meta: "4 left · ~2 days", reason: "Selling 3× usual since a local vet recommended them.", did: "Drafted a rush reorder of 40." },
      { id: "kibble", title: "Grain-free kibble 12 lb", meta: "5 bags · reorder at 8", reason: "Supplier delivery slipped a week.", did: "Drafted a reorder of 20 bags." },
      { id: "treats", title: "Salmon treats", meta: "6 bags", reason: "Weekend rush.", did: "Added to the same supplier order." },
    ],
    why: () => "Reorder points are fixed, so demand spikes (like the vet tip on dental chews) run you low.",
    fixes: ["fx_dyn", "fx_pace"],
  },
  act_renewals: {
    agent: "orders", head: "Renewals",
    items: [
      { id: "weekly", title: "Weekly boxes", meta: "11 renewed", reason: "Cards charged without issues.", did: "Confirmed and sent receipts." },
      { id: "monthly", title: "Monthly boxes", meta: "6 renewed", reason: "Cards charged without issues.", did: "Confirmed and sent receipts." },
      { id: "card", title: "Expired card · Riley K.", meta: "Fixed", ok: true, reason: "Card expired the day before renewal.", did: "Sent an update link; Riley updated it the same day." },
    ],
    why: () => "One renewal nearly failed on an expired card. Those show up a week ahead.",
    fixes: ["fx_card"],
  },
  act_deliveries: {
    agent: "ship", head: "Routes",
    items: [
      { id: "elm", title: `${BUSINESS_CONFIG.street} & Oak Ave`, meta: "3 stops → 1 run", reason: "Three orders within two blocks on Tuesday.", did: "Combined into one 25-minute run." },
      { id: "maple", title: "Maple Ct", meta: "2 stops → 1 run", reason: "Neighbors ordered an hour apart.", did: "Held the first order 40 minutes to pair them." },
      { id: "river", title: "Riverside", meta: "2 stops → 1 run", reason: "Same building, different days.", did: "Moved one to the shared slot with the customer's OK." },
    ],
    why: () => "Most same-block orders land on Tuesdays, which is also when most late deliveries happen.",
    fixes: ["fx_slot", "fx_eta"],
  },
  act_lowMargin: {
    agent: "cash", head: "Items",
    items: [
      { id: "raw", title: "Premium raw bites", meta: "22% margin", reason: "Supplier raised the cost 12%; shelf price unchanged.", did: "Flagged with a suggested new price." },
      { id: "deliv", title: "Free delivery on small orders", meta: "−6% after fees", reason: "Orders under $25 still ship free.", did: "Modeled a $25 minimum." },
    ],
    why: () => "Supplier costs went up but shelf prices and delivery rules didn't change.",
    fixes: ["fx_price", "fx_min"],
  },
  act_igDrafts: {
    agent: "growth", head: "Drafts",
    items: [
      { id: "promo", title: "Fill-a-bowl Friday", meta: "Promo post", reason: "Weekend traffic is highest Fri–Sat.", did: "Drafted caption + photo crop." },
      { id: "dog", title: "Meet the shop dog", meta: "Story", reason: "Your most-liked post type.", did: "Drafted 3 frames." },
      { id: "treats", title: "New salmon treats", meta: "Product post", reason: "New arrival this week.", did: "Drafted with price and link." },
    ],
    why: () => "Drafts wait about 2 days for review, so timely posts go out late.",
    fixes: ["fx_evergreen"],
  },
  revenue: { drove: ["Subscription boxes · +$310 vs last week", "Weekend walk-ins · +$140", "Treats · −$60 (dental chews ran low)"] },
  margin: { drove: ["Treats are your best margin (48%)", "Raw bites slipped to 22% after a cost increase", "Delivery fees took ~6% of revenue"], fixes: ["fx_price", "fx_min"] },
  hoursSaved: { drove: ["Customer replies · ~6h", "Reorders & stock checks · ~4h", "Route planning · ~3h", "Bookkeeping & briefings · the rest"] },
};
function replyInVoice(agentId, name, core) {
  const v = state.voices[agentId];
  const ps = vPresets(v);
  let body = core;
  if (ps.includes("concise")) body = body.split(/(?<=[.!?])\s+/)[0];
  ps.forEach((id) => { const m = VOICE_MODS[id]; if (m) body += ` ${fillVars(m.customer)}`; });
  if (ps.includes("pro") || v.formality >= 4) body = body.replace(/!/g, ".");
  if (v.emoji) body += " 🐾";
  return `${greeting(v.preset, v.formality, name)} ${body}`;
}
const fixStatus = (fid) => (state.fixes || {})[fid];
const dpHasAppliedFix = (dp) => !!(INSIGHTS[dp] && (INSIGHTS[dp].fixes || []).some((f) => fixStatus(f) === "applied"));
const fixTag = (dp) => (dpHasAppliedFix(dp) ? `<span class="fix-tag">✓ Fix applied</span>` : "");

function insightHTML(id) {
  const ins = INSIGHTS[id];
  const parts = [];
  if (ins.items) {
    const counts = ins.counts ? ins.counts() : null;
    const agent = agentById(ins.agent);
    parts.push(`<section class="ins-sec"><h3 class="ins-h">What happened</h3><ul class="ins-list">
      ${ins.items.map((it, i) => {
        const open = pop.openItem === it.id;
        const meta = counts ? String(counts[i]) : it.meta;
        let detail = "";
        if (open && it.snippets) {
          detail = it.snippets.map((s) => `
            <div class="convo">
              <div class="convo-meta"><span class="ch-ico" style="--c:${CHANNELS[s.ch].c}">${CHANNELS[s.ch].t}</span>${escapeHtml(s.name)} · ${escapeHtml(s.time)}</div>
              <p class="convo-msg">${escapeHtml(s.msg)}</p>
              <p class="convo-reply"><span class="convo-who">${agent.icon} ${escapeHtml(agent.name)} · ${escapeHtml(voiceLabel(state.voices[ins.agent]))}</span>${escapeHtml(replyInVoice(ins.agent, s.name, s.core))}</p>
            </div>`).join("");
        } else if (open) {
          detail = `<p class="ins-detail"><span>Why</span>${escapeHtml(it.reason)}</p><p class="ins-detail"><span>What ${escapeHtml(agent.name)} did</span>${escapeHtml(it.did)}</p>`;
        }
        return `<li class="ins-item ${open ? "open" : ""}">
          <button type="button" class="ins-row" data-ins-item="${it.id}" aria-expanded="${open}">
            <span class="ins-title">${escapeHtml(it.title)}</span>
            <span class="ins-meta ${it.ok ? "ok" : ""}">${escapeHtml(meta)}</span>
            <span class="ins-chev" aria-hidden="true">${open ? "▴" : "▾"}</span>
          </button>
          ${open ? `<div class="ins-body reveal">${detail}</div>` : ""}
        </li>`;
      }).join("")}
    </ul></section>`);
  }
  if (ins.drove) {
    parts.push(`<section class="ins-sec"><h3 class="ins-h">What drove this</h3><ul class="ins-drove">${ins.drove.map((d) => `<li>${escapeHtml(d)}</li>`).join("")}</ul></section>`);
  }
  if (ins.why) parts.push(`<p class="ins-why"><span>Why it keeps happening</span>${escapeHtml(ins.why())}</p>`);
  if (ins.fixes && ins.fixes.length) {
    parts.push(`<section class="ins-sec"><h3 class="ins-h">Fix it</h3>
      ${ins.fixes.map((fid) => {
        const f = FIXES[fid];
        const st = fixStatus(fid);
        const owners = f.agents.map((a) => agentById(a).name).join(" + ");
        return `<div class="fix-card ${st || ""}" data-fix-card="${fid}">
          <strong>${escapeHtml(f.title)}</strong>
          <span class="fix-meta">${escapeHtml(owners)} · ${escapeHtml(f.impact)}</span>
          ${st === "applied"
            ? `<div class="fix-state"><span>✓ Applied · Store Captain is on it</span><button type="button" class="link-btn" data-fix-undo="${fid}">Undo</button></div>`
            : st === "dismissed"
              ? `<div class="fix-state muted"><span>Skipped for now</span><button type="button" class="link-btn" data-fix-undo="${fid}">Undo</button></div>`
              : `<div class="fix-actions"><button type="button" class="btn btn-sm btn-primary" data-fix-apply="${fid}">Apply</button><button type="button" class="btn btn-sm btn-ghost" data-fix-skip="${fid}">Not now</button></div>`}
        </div>`;
      }).join("")}
    </section>`);
  }
  if (id === "act_expiry") parts.push(`<button type="button" class="scn-inline" data-scenario>▶ Watch the team clear this stock</button>`);
  return parts.join("");
}


function popHTML(id) {
  const d = DP[id];
  const v = val(id);
  const edited = dpEdited(id);
  const inputs = d.inputs ? d.inputs() : [];
  const head = `
    <div class="pop-head">
      <div>
        <div class="pop-label">${escapeHtml(d.label)}</div>
        <div class="pop-value">${fmt(d.kind, v)}</div>
      </div>
      <button type="button" class="pop-close" data-pop-close aria-label="Close">×</button>
    </div>
    <div class="pop-badges">
      <span class="pop-sample">${d.jump !== undefined ? "From your demo choices" : "Sample / illustrative"}</span>
      ${edited ? `<span class="edited-badge">Edited by you</span>` : ""}
    </div>`;

  if (pop.mode === "edit") {
    const override = state.overrides[id];
    return `${head}
      <form class="pop-form" data-pop-form novalidate>
        <p class="pop-help">Correct the inputs. Dependent totals recalculate everywhere in the demo.</p>
        ${inputs.length ? inputs.map((i) => `
          <label class="pf-row">
            <span class="pf-label">${escapeHtml(i.label)}</span>
            <span class="pf-input">${i.unit === "$" ? "<em>$</em>" : ""}<input type="number" inputmode="decimal" step="any" min="0" name="${i.key}" value="${escapeHtml(state.inputs[i.key])}" />${i.unit && i.unit !== "$" ? `<em>${escapeHtml(i.unit)}</em>` : ""}</span>
          </label>`).join("") : `<p class="pop-help">Rank at least one pain to edit its inputs.</p>`}
        ${d.noOverride ? "" : `
          <label class="pf-row pf-override">
            <span class="pf-label">Or set the final number yourself <small>(leave blank to use the formula)</small></span>
            <span class="pf-input"><input type="number" inputmode="decimal" step="any" min="0" name="__override" value="${override !== undefined ? override : ""}" placeholder="Formula gives ${fmt(d.kind, d.compute())}" /></span>
          </label>`}
        ${pop.error ? `<p class="pf-error" role="alert">${escapeHtml(pop.error)}</p>` : ""}
        <div class="pop-actions">
          <button type="submit" class="btn btn-sm btn-primary">Save</button>
          <button type="button" class="btn btn-sm btn-ghost" data-pop-cancel>Cancel</button>
        </div>
      </form>`;
  }

  const ins = INSIGHTS[id];
  const rows = [];
  rows.push(`<div class="pop-row"><dt>Source</dt><dd>${escapeHtml(d.source)}</dd></div>`);
  rows.push(`<div class="pop-row"><dt>How it's calculated</dt><dd>${escapeHtml(d.formula)}</dd></div>`);
  if (inputs.length && !d.noOverride) {
    rows.push(`<div class="pop-row"><dt>Inputs</dt><dd><ul class="pop-list">${inputs.map((i) => {
      const changed = Number(state.inputs[i.key]) !== Number(DEFAULT_INPUTS[i.key]);
      return `<li>${escapeHtml(i.label)}: <strong>${fmtInput(i.unit, state.inputs[i.key])}</strong>${changed ? ` <span class="was">sample was ${fmtInput(i.unit, DEFAULT_INPUTS[i.key])}</span>` : ""}</li>`;
    }).join("")}</ul></dd></div>`);
  }
  if (d.noOverride && dpEdited(id)) {
    const i = inputs[0];
    rows.push(`<div class="pop-row"><dt>Sample value</dt><dd>${fmtInput(i.unit, DEFAULT_INPUTS[i.key])} <span class="was">you changed it</span></dd></div>`);
  }
  if (d.breakdown && d.breakdown().length) {
    rows.push(`<div class="pop-row"><dt>Breakdown</dt><dd><ul class="pop-list">${d.breakdown().map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul></dd></div>`);
  }
  if (d.deps) {
    rows.push(`<div class="pop-row"><dt>Depends on</dt><dd>${d.deps.map((dep) => `${escapeHtml(DP[dep].label)} = <strong>${fmt(DP[dep].kind, val(dep))}</strong>${dpEdited(dep) ? ` <span class="was">edited by you</span>` : ""}`).join("<br>")}</dd></div>`);
  }
  if (state.overrides[id] !== undefined) {
    rows.push(`<div class="pop-row"><dt>Your override</dt><dd>Set to <strong>${fmt(d.kind, state.overrides[id])}</strong> (the formula gives ${fmt(d.kind, d.compute())})</dd></div>`);
  }
  rows.push(`<div class="pop-row"><dt>Last updated</dt><dd>${edited ? `Edited by you · ${escapeHtml(state.editedAt[id] || nowLabel())}` : escapeHtml(d.updated)}</dd></div>`);

  const actions = d.jump !== undefined
    ? `<button type="button" class="btn btn-sm btn-soft" data-pop-jump="${d.jump}">Change in Step ${d.jump + 1}</button>`
    : `<button type="button" class="btn btn-sm btn-soft" data-pop-edit>Edit</button>${edited ? `<button type="button" class="btn btn-sm btn-ghost" data-pop-reset>Reset to sample</button>` : ""}`;

  if (ins) {
    return `${head}${insightHTML(id)}
      <button type="button" class="ins-measure" data-pop-measure aria-expanded="${pop.measure}"><span>How this is measured</span><span aria-hidden="true">${pop.measure ? "▴" : "›"}</span></button>
      ${pop.measure ? `<div class="reveal"><dl class="pop-rows">${rows.join("")}</dl><div class="pop-actions">${actions}</div></div>` : ""}`;
  }
  return `${head}<dl class="pop-rows">${rows.join("")}</dl><div class="pop-actions">${actions}</div>`;
}

const isSheet = () => window.innerWidth <= 560;
const REDUCED_MOTION = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function positionPop() {
  if (popEl.hidden) return;
  if (isSheet()) {
    popEl.classList.add("sheet");
    popEl.style.top = ""; popEl.style.left = "";
    popBackdrop.hidden = false;
    return;
  }
  popEl.classList.remove("sheet");
  popBackdrop.hidden = true;
  let a = pop.anchor;
  if (!a || !document.body.contains(a)) a = pop.anchor = document.querySelector(`[data-dp="${pop.id}"]`);
  if (!a) return;
  const r = a.getBoundingClientRect();
  const w = popEl.offsetWidth;
  const h = popEl.offsetHeight;
  const left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), window.innerWidth - w - 12);
  let top = r.bottom + 10;
  if (top + h > window.innerHeight - 12) top = Math.max(12, r.top - h - 10);
  top = Math.max(12, Math.min(top, window.innerHeight - h - 12));
  popEl.style.left = `${left}px`;
  popEl.style.top = `${top}px`;
}
function openPop(id, anchor, mode = "view") {
  document.querySelectorAll(".src-chip[aria-expanded='true']").forEach((c) => c.setAttribute("aria-expanded", "false"));
  pop.id = id; pop.anchor = anchor; pop.mode = mode; pop.error = "";
  popEl.innerHTML = popHTML(id);
  popEl.classList.toggle("pop-insight", !!INSIGHTS[id]);
  popEl.hidden = false;
  popEl.setAttribute("aria-label", `${DP[id].label}: source`);
  if (anchor) anchor.setAttribute("aria-expanded", "true");
  positionPop();
}
function refreshPop() {
  if (popEl.hidden) return;
  const st = popEl.scrollTop;
  popEl.innerHTML = popHTML(pop.id);
  popEl.scrollTop = st;
  positionPop();
}
function closePop() {
  if (popEl.hidden) return;
  popEl.hidden = true;
  popBackdrop.hidden = true;
  if (pop.anchor) pop.anchor.setAttribute("aria-expanded", "false");
  pop.id = null; pop.anchor = null;
}
function reopenAfterRender(id) {
  openPop(id, document.querySelector(`[data-dp="${id}"]`), "view");
}

popEl.addEventListener("click", (e) => {
  if (e.target.closest("[data-pop-close]")) { closePop(); return; }
  const insItem = e.target.closest("[data-ins-item]");
  if (insItem) { pop.openItem = pop.openItem === insItem.dataset.insItem ? null : insItem.dataset.insItem; refreshPop(); popEl.querySelector(`[data-ins-item="${insItem.dataset.insItem}"]`)?.focus({ preventScroll: true }); return; }
  if (e.target.closest("[data-pop-measure]")) { pop.measure = !pop.measure; refreshPop(); popEl.querySelector("[data-pop-measure]")?.focus({ preventScroll: true }); return; }
  const fx = e.target.closest("[data-fix-apply], [data-fix-skip], [data-fix-undo]");
  if (fx) {
    const fid = fx.dataset.fixApply || fx.dataset.fixSkip || fx.dataset.fixUndo;
    if (fx.dataset.fixApply) state.fixes[fid] = "applied";
    else if (fx.dataset.fixSkip) state.fixes[fid] = "dismissed";
    else delete state.fixes[fid];
    const id = pop.id, st = popEl.scrollTop, keep = { openItem: pop.openItem, measure: pop.measure };
    render({ keepScroll: true });
    Object.assign(pop, keep);
    openPop(id, document.querySelector(`[data-dp="${id}"]`), "view");
    popEl.scrollTop = st;
    popEl.querySelector(`[data-fix-card="${fid}"] button`)?.focus({ preventScroll: true });
    if (fx.dataset.fixApply) toast("Store Captain will set this up · added to your tasks");
    return;
  }
  if (e.target.closest("[data-pop-edit]")) { pop.mode = "edit"; pop.error = ""; refreshPop(); popEl.querySelector("input")?.focus({ preventScroll: true }); return; }
  if (e.target.closest("[data-pop-cancel]")) { pop.mode = "view"; pop.error = ""; refreshPop(); return; }
  if (e.target.closest("[data-pop-reset]")) {
    const id = pop.id; const d = DP[id];
    delete state.overrides[id];
    (d.inputs ? d.inputs() : []).forEach((i) => { state.inputs[i.key] = DEFAULT_INPUTS[i.key]; });
    delete state.editedAt[id];
    render({ keepScroll: true });
    reopenAfterRender(id);
    toast("Reset to sample value");
    return;
  }
  const jump = e.target.closest("[data-pop-jump]");
  if (jump) { closePop(); go(Number(jump.dataset.popJump)); }
});
popEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = pop.id; const d = DP[id];
  const form = e.target;
  const next = {};
  for (const i of (d.inputs ? d.inputs() : [])) {
    const raw = (form.elements[i.key]?.value || "").trim();
    const n = Number(raw);
    if (raw === "" || !Number.isFinite(n) || n < 0) { pop.error = `Enter a number of 0 or more for "${i.label}".`; refreshPop(); return; }
    next[i.key] = n;
  }
  let override;
  if (!d.noOverride) {
    const raw = (form.elements.__override?.value || "").trim();
    if (raw) {
      override = Number(raw);
      if (!Number.isFinite(override) || override < 0) { pop.error = "The final number must be 0 or more."; refreshPop(); return; }
    }
  }
  Object.assign(state.inputs, next);
  if (override !== undefined) state.overrides[id] = override; else delete state.overrides[id];
  state.editedAt[id] = nowLabel();
  render({ keepScroll: true });
  reopenAfterRender(id);
  toast("Saved · dependent totals recalculated");
});

document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-dp]");
  if (c) {
    e.preventDefault();
    if (!popEl.hidden && pop.anchor === c) closePop();
    else { pop.openItem = null; pop.measure = false; openPop(c.dataset.dp, c); }
    return;
  }
  if (!popEl.hidden && !e.composedPath().includes(popEl)) closePop();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePop(); });
window.addEventListener("resize", positionPop);
window.addEventListener("scroll", () => { if (!isSheet()) positionPop(); }, { passive: true });

/* ---------- Progress & nav ---------- */
function renderProgress() {
  progressEl.innerHTML = STEP_LABELS.map((label, i) => {
    const cls = i < state.step ? "done" : i === state.step ? "active" : "";
    const line = i < STEP_LABELS.length - 1 ? `<span class="progress-line ${i < state.step ? "done" : ""}"></span>` : "";
    return `<div class="progress-step"><div class="progress-dot ${cls}" title="${label}">${i < state.step ? "✓" : i + 1}</div>${line}</div>`;
  }).join("");
}

function setNav() {
  const inSub = state.step === 1 && !!state.painGroup;
  const nPicked = state.selectedSubs.length;
  btnBack.disabled = state.step === 0 || inSub;
  btnBack.style.visibility = state.step === 0 || inSub ? "hidden" : "visible";
  btnBack.innerHTML = `<span class="bk-arrow" aria-hidden="true">←</span><span class="bk-label">Back</span>`;
  btnBack.setAttribute("aria-label", "Back");
  const labels = { 0: "Continue", 3: "Continue", 4: "Go to Gemini home", 5: "Get started" };
  if (inSub) {
    btnNext.textContent = "Done";
    btnNext.dataset.mode = "save-back";
  } else if (state.step === 1) {
    btnNext.innerHTML = `Show my team <span class="nx-count">(${nPicked})</span>`;
    btnNext.dataset.mode = "advance";
  } else {
    btnNext.textContent = labels[state.step] || "Next";
    btnNext.dataset.mode = "next";
  }
  document.getElementById("navfoot")?.classList.toggle("menu-mode", state.step === 1 && !inSub);
  document.getElementById("navfoot")?.classList.toggle("sub-mode", inSub);
  btnNext.classList.toggle("btn-launch", state.step === 3);
  let ok = true; let hint = "";
  if (state.step === 0) ok = !!state.business.type;
  else if (state.step === 1) {
    const n = nPicked;
    ok = inSub || n >= 1;
    hint = inSub ? "Your picks are saved. Pick from other areas too." : n ? `${n} picked across ${selectedGroups().length} area${selectedGroups().length === 1 ? "" : "s"} · open any area to add more` : "Open any area and pick at least one problem";
  } else if (state.step === 2) { ok = activeAgents().length >= 1; hint = `${activeAgents().length} agents · each with its own voice`; }
  else if (state.step === 3) hint = "Mock connections · nothing leaves this demo";
  else if (state.step === 4) hint = "Sample data · tap ⓘ on any number";
  btnNext.disabled = !ok;
  navHint.textContent = hint;
}

function enterStep() {
  if (state.step === 2) {
    const rec = recommendedAgents();
    AGENTS.forEach((a) => {
      if (a.alwaysOn) state.agentsOn[a.id] = true;
      else if (state.agentsOn[a.id] === undefined || !state._agentsTouched) state.agentsOn[a.id] = rec.has(a.id);
    });
  }
}

function go(step, opts = {}) {
  document.querySelector(".toast")?.classList.remove("show");
  closePop();
  state.step = Math.max(0, Math.min(STEP_LABELS.length - 1, step));
  if (!(opts.keepGroup && state.step === 1)) state.painGroup = null;
  enterStep();
  if (!opts.fromHistory) history.pushState({ step: state.step, group: state.painGroup }, "");
  render();
  window.scrollTo({ top: 0, behavior: opts.fromHistory || REDUCED_MOTION() ? "auto" : "smooth" });
}

/* Drill into a pain area (its own history entry so browser/Android back returns to the menu). */
function openGroup(id) {
  closePop();
  state.painGroup = id;
  history.pushState({ step: 1, group: id }, "");
  render();
  window.scrollTo(0, 0);
}
function backToMenu() {
  if (state.step !== 1 || !state.painGroup) return;
  if (history.state && history.state.step === 1 && history.state.group) { history.back(); return; }
  state.painGroup = null;
  history.replaceState({ step: 1, group: null }, "");
  render();
  window.scrollTo(0, 0);
}
let launching = false;
window.addEventListener("popstate", (e) => {
  const s = e.state;
  if (launching || !s || typeof s.step !== "number") return;
  state.painGroup = s.group || null;
  go(s.step, { fromHistory: true, keepGroup: true });
});

/* Swipe right on a sub-screen to return to the main pain menu. */
let touch0 = null;
document.addEventListener("touchstart", (e) => {
  touch0 = null;
  if (state.step !== 1 || !state.painGroup || e.touches.length !== 1) return;
  if (e.target.closest('input[type="range"], .popover')) return;
  touch0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
}, { passive: true });
document.addEventListener("touchend", (e) => {
  if (!touch0) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touch0.x; const dy = t.clientY - touch0.y; const dt = Date.now() - touch0.t;
  touch0 = null;
  if (dx > 80 && Math.abs(dy) < 60 && dt < 900) backToMenu();
}, { passive: true });

function render(opts = {}) {
  closePop();
  if (typeof scn !== "undefined" && scn.open) scnPaint(false);
  const y = window.scrollY;
  renderProgress();
  setNav();
  const renderers = [renderWelcome, renderPains, renderAgents, renderSetup, renderDashboard, renderClosing];
  stage.innerHTML = "";
  scrollHintObs?.disconnect(); document.querySelector(".scroll-hint")?.remove();
  const screen = document.createElement("div");
  screen.className = opts.keepScroll ? "screen no-anim" : "screen";
  screen.dataset.step = String(state.step);
  screen.innerHTML = renderers[state.step]();
  stage.appendChild(screen);
  bindScreen();
  settleReveals(stage, opts.reveal);
  if (opts.keepScroll) window.scrollTo(0, y);
}

/* ---------- Screens ---------- */
const ui = (k) => !!state.ui[k];
const screenNote = (t = "Sample data · tap ⓘ to see where a number comes from") => `<p class="screen-note">${t}</p>`;

function renderWelcome() {
  const b = state.business;
  return `
    <div class="focus pick">
      <h1 class="screen-title">What do you do?</h1>
      <div class="type-grid" role="radiogroup" aria-label="Type of business" id="type-chips">
        ${BIZ_TYPES.map((t) => `<button type="button" class="type-card ${b.type === t.id ? "selected" : ""}" role="radio" aria-checked="${b.type === t.id}" data-type="${t.id}"><span class="type-ico" aria-hidden="true">${t.icon}</span><span>${escapeHtml(t.label)}</span></button>`).join("")}
      </div>
      ${b.type === "other" ? `
      <label class="sr-only" for="biz-other">What kind of business?</label>
      <input id="biz-other" class="pick-input reveal" type="text" value="${escapeHtml(b.other)}" placeholder="What kind of business?" autocomplete="off" />` : ""}
      <div class="pick-field">
        <span class="pick-label" id="size-label">Team size</span>
        <div class="chip-row size-row" role="radiogroup" aria-labelledby="size-label" id="size-chips">
          ${BIZ_SIZES.map((x) => `<button type="button" class="chip ${b.size === x.id ? "selected" : ""}" role="radio" aria-checked="${b.size === x.id}" data-size="${x.id}">${escapeHtml(x.label)}</button>`).join("")}
        </div>
      </div>
      <label class="sr-only" for="biz-name">Business name (optional)</label>
      <input id="biz-name" class="pick-input" type="text" value="${escapeHtml(b.name)}" autocomplete="organization" placeholder="Business name (optional), e.g. ${escapeHtml(bizType() ? bizType().sample : "Paws & Pantry")}" />
    </div>`;
}

function tallyListHTML() { return ""; }
function tallyHTML() {
  return "";
}

function renderPains() {
  const g = state.painGroup && groupById(state.painGroup);
  return g ? renderPainGroup(g) : renderPainMenu();
}

function renderPainMenu() {
  return `
    <h1 class="screen-title">What's getting in the way?</h1>
    <p class="screen-sub">Pick all that apply.</p>
    <div class="narrow">
      ${tallyHTML()}
      <div class="group-list" id="group-list">
        ${PAIN_GROUPS.map((g) => {
          const n = countIn(g);
          return `
          <button type="button" class="group-card ${n ? "selected" : ""}" data-group="${g.id}" aria-label="${escapeHtml(g.title)}${n ? ` (${n} selected)` : ""}">
            <span class="group-icon" aria-hidden="true">${g.icon}${n ? `<span class="group-check">✓</span>` : ""}</span>
            <span class="group-text"><span class="group-title">${escapeHtml(g.title)}</span></span>
            ${n ? `<span class="group-badge">${n} selected</span>` : ""}
            <span class="group-chev" aria-hidden="true">›</span>
          </button>`;
        }).join("")}
      </div>
    </div>`;
}

/* "More areas below" pill on phones until the last area card is on screen. */
let scrollHintObs = null;
function setupScrollHint() {
  scrollHintObs?.disconnect();
  document.querySelector(".scroll-hint")?.remove();
  const last = document.querySelector('.group-card:last-child');
  if (!last || !("IntersectionObserver" in window)) return;
  const pill = document.createElement("button");
  pill.type = "button"; pill.className = "scroll-hint"; pill.hidden = true;
  pill.innerHTML = "↓ Scroll for all 5 areas";
  pill.addEventListener("click", () => last.scrollIntoView({ behavior: "smooth", block: "center" }));
  document.body.appendChild(pill);
  scrollHintObs = new IntersectionObserver(([en]) => { pill.hidden = en.isIntersecting; }, { rootMargin: `0px 0px -${(document.getElementById("navfoot")?.offsetHeight || 76)}px 0px`, threshold: 0.9 });
  scrollHintObs.observe(last);
}

function renderPainGroup(g) {
  const allOn = g.subs.every((s) => subSel(s.id));
  return `
    <div class="narrow">
      <nav class="crumbs" aria-label="Breadcrumb">
        <button type="button" class="crumb-link back-menu" data-back-menu>← All pain points</button>
        <span class="crumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">${escapeHtml(g.short)}</span>
      </nav>
      <h1 class="screen-title group-heading">${escapeHtml(g.title)}</h1>
      ${tallyHTML()}
      <div class="sub-list-head"><button type="button" class="link-btn" data-select-all="${g.id}" aria-pressed="${allOn}">${allOn ? "Clear all" : "Select all"}</button></div>
      <div class="sub-list" id="sub-list">
        ${g.subs.map((s) => {
          const sel = subSel(s.id);
          return `
          <div class="sub-item ${sel ? "selected" : ""}" data-sub="${s.id}">
            <button type="button" class="sub-toggle" role="checkbox" aria-checked="${!!sel}" data-sub-toggle="${s.id}">
              <span class="sub-box" aria-hidden="true">${sel ? "✓" : ""}</span>
              <span class="sub-title">${escapeHtml(s.title)}</span>
            </button>
          </div>`;
        }).join("")}
      </div>
    </div>`;
}

function voicePanelHTML(a) {
  const v = state.voices[a.id];
  const vd = VOICE_LINES[a.id];
  const open = state.openVoice.has(a.id);
  if (!open) return `<div class="voice-panel" data-voice-panel="${a.id}" hidden></div>`;
  return `
    <div class="voice-panel reveal" data-r="voice-${a.id}" data-voice-panel="${a.id}">
      ${presetChipsHTML(a)}
      <div class="preview">
        <div class="preview-head">Sample · ${escapeHtml(vd.context)}</div>
        <div class="bubble" data-preview="${a.id}" aria-live="polite">${escapeHtml(voiceMessage(a.id))}</div>
      </div>
      <div class="vp-actions">
        <button type="button" class="link-btn" data-ui="fine-${a.id}" aria-expanded="${ui(`fine-${a.id}`)}">${ui(`fine-${a.id}`) ? "Hide fine-tuning" : "Fine-tune"}</button>
        <button type="button" class="link-btn apply-all" data-apply-all="${a.id}">Apply to all agents</button>
      </div>
      ${ui(`fine-${a.id}`) ? `
      <div class="vp-grid reveal" data-r="fine-${a.id}">
        <div class="vp-field vp-formality">
          <div class="vp-label">Formality <span class="vp-val" data-formality-label="${a.id}">${FORMALITY_LABELS[v.formality]}</span></div>
          <input type="range" min="1" max="5" step="1" value="${v.formality}" data-formality="${a.id}" aria-label="Formality for ${escapeHtml(a.name)}" />
        </div>
        <div class="vp-field">
          <div class="vp-label">Emoji</div>
          <button type="button" class="mini-switch ${v.emoji ? "on" : ""}" role="switch" aria-checked="${v.emoji}" aria-label="Emoji for ${escapeHtml(a.name)}" data-emoji="${a.id}"><span>${v.emoji ? "On" : "Off"}</span></button>
        </div>
        <div class="vp-field">
          <div class="vp-label">Length</div>
          <div class="seg" role="radiogroup" aria-label="Message length">
            <button type="button" class="${v.length === "short" ? "selected" : ""}" role="radio" aria-checked="${v.length === "short"}" data-length="short" data-vagent="${a.id}">Short</button>
            <button type="button" class="${v.length === "detailed" ? "selected" : ""}" role="radio" aria-checked="${v.length === "detailed"}" data-length="detailed" data-vagent="${a.id}">Detailed</button>
          </div>
        </div>
      </div>` : ""}
    </div>`;
}

function agentCardHTML(a, rec) {
  const on = !!state.agentsOn[a.id];
  const det = ui(`det-${a.id}`);
  const vOpen = state.openVoice.has(a.id);
  const painLabel = selectedGroups()
    .filter((g) => g.subs.some((s) => subSel(s.id) && s.agents.includes(a.id)))
    .map((g) => g.short).join(" · ") || (a.alwaysOn ? "Coordinates the whole team" : "Optional add-on");
  return `
    <div class="agent-card ${on ? "on" : ""}" data-agent="${a.id}">
      <div class="agent-top">
        <div class="agent-avatar" aria-hidden="true">${a.icon}</div>
        <div class="agent-meta">
          <h3>${escapeHtml(a.name)}</h3>
          <div class="agent-role">${escapeHtml(a.role)}${rec.has(a.id) && !a.alwaysOn ? ` · <span class="rec">Recommended</span>` : ""}</div>
        </div>
        <button type="button" class="agent-toggle" role="switch" aria-checked="${on}" aria-label="Toggle ${escapeHtml(a.name)}" data-toggle="${a.id}" ${a.alwaysOn ? "disabled" : ""}></button>
      </div>
      <div class="agent-foot">
        <button type="button" class="voice-chip" data-voice-toggle="${a.id}" aria-expanded="${vOpen}"><span class="vc-k">Voice</span> <span data-voice-current="${a.id}">${escapeHtml(voiceLabel(state.voices[a.id]))}</span> <span class="vc-chev" aria-hidden="true">${vOpen ? "▴" : "▾"}</span></button>
        <button type="button" class="link-btn" data-ui="det-${a.id}" aria-expanded="${det}">${det ? "Less" : "Details"}</button>
      </div>
      ${det ? `
      <div class="agent-details reveal" data-r="det-${a.id}">
        <p class="agent-desc">${escapeHtml(a.desc)}</p>
        <span class="agent-pain">Solves: ${escapeHtml(painLabel)}</span>
        <ul class="agent-tasks">${a.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      </div>` : ""}
      ${voicePanelHTML(a)}
    </div>`;
}

function renderAgents() {
  const rec = recommendedAgents();
  const main = AGENTS.filter((a) => rec.has(a.id) || a.alwaysOn);
  const others = AGENTS.filter((a) => !main.includes(a));
  const groups = selectedGroups().map((g) => g.short);
  return `
    <h1 class="screen-title">Meet your team</h1>
    <p class="screen-sub">${groups.length ? `Picked for ${escapeHtml(groups.join(", "))}.` : "A lean starter team."}</p>
    <div class="narrow wide" id="agent-grid">
      <div class="agent-grid">${main.map((a) => agentCardHTML(a, rec)).join("")}</div>
      ${others.length ? `
      <button type="button" class="more-link" data-ui="moreAgents" aria-expanded="${ui("moreAgents")}">${ui("moreAgents") ? "Hide" : "Show"} more agents (${others.length})</button>
      ${ui("moreAgents") ? `<div class="agent-grid reveal" data-r="moreAgents">${others.map((a) => agentCardHTML(a, rec)).join("")}</div>` : ""}` : ""}
      ${screenNote("Voice samples are previews · Store Captain stays on to coordinate")}
    </div>`;
}

function toolRowHTML(id, note) {
  const k = CONNECTORS[id];
  const on = !!state.tools[id];
  return `
              <div class="tool-row ${on ? "connected" : ""}" data-tool="${id}">
                <div class="tool-icon app-ico" style="--c:${k.color}">${k.initials}</div>
                <div class="tool-info"><strong>${escapeHtml(k.name)}</strong><span>${escapeHtml(note || k.desc)}</span></div>
                <span class="tool-status sr-only">${on ? "Connected" : "Not connected"}</span>
                ${on
                  ? `<button type="button" class="conn-check" data-tool-btn="${id}" aria-label="Connected. Disconnect ${escapeHtml(k.name)}" title="Connected · tap to disconnect"><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`
                  : `<button type="button" class="btn btn-sm btn-connect" data-tool-btn="${id}" aria-label="Connect ${escapeHtml(k.name)}">Connect</button>`}
              </div>`;
}
function connectorsHTML() {
  const groups = selectedGroups();
  const shown = new Set();
  const PER_GROUP = 3;
  const sections = groups.map((g) => {
    const ids = g.connectors.map((c) => c.id).filter((id) => !shown.has(id)).slice(0, PER_GROUP);
    ids.forEach((id) => shown.add(id));
    if (!ids.length) return "";
    return `
          <div class="conn-group" data-conn-group="${g.id}">
            <h3 class="conn-group-head">${escapeHtml(g.short)}</h3>
            <div class="tool-list">${ids.map((id) => toolRowHTML(id)).join("")}</div>
          </div>`;
  }).join("");
  const rest = Object.keys(CONNECTORS).filter((id) => !shown.has(id));
  const open = state.showMore || !sections;
  return `
        ${sections}
        ${rest.length ? `
        <div class="more-conn">
          <button type="button" class="more-link more-toggle" data-more-toggle aria-expanded="${open}">${open ? "Hide" : "Show"} more connectors (${rest.length})</button>
          ${open ? `<div class="conn-group reveal" data-r="more" data-conn-group="more"><h3 class="conn-group-head sr-only">More connectors</h3><div class="tool-list">${rest.map((id) => toolRowHTML(id)).join("")}</div></div>` : ""}
        </div>` : ""}`;
}

function renderSetup() {
  const active = activeAgents();
  const ap = APPROVALS.find((a) => a.id === state.approval) || APPROVALS[0];
  return `
    <h1 class="screen-title">Bring your work with you</h1>
    <p class="screen-sub">Connect your apps so your team starts with context.</p>
    <div class="narrow wide">
      <div id="connectors">${connectorsHTML()}</div>

      <section class="calm-sec" id="voice-summary" aria-labelledby="voices-h">
        <h2 class="sec-title" id="voices-h">Voices</h2>
        <div class="vs-list">
          ${active.map((a) => {
            const open = state.voiceEdit === a.id;
            return `
            <div class="vs-item ${open ? "open" : ""}">
              <button type="button" class="vs-row" data-vs-row="${a.id}" aria-expanded="${open}">
                <span class="mini-avatar" aria-hidden="true">${a.icon}</span>
                <span class="vs-text"><strong>${escapeHtml(a.name)}</strong><span>${escapeHtml(voiceLabel(state.voices[a.id]))}</span></span>
                <span class="vs-affordance" aria-hidden="true">${open ? "▴" : "✎"}</span>
              </button>
              ${open ? `
              <div class="vs-panel reveal" data-r="vs-${a.id}">
                ${presetChipsHTML(a)}
                <p class="vs-sample" data-preview="${a.id}">${escapeHtml(blendBody(a.id, state.voices[a.id]))}</p>
              </div>` : ""}
            </div>`;
          }).join("")}
        </div>
        <button type="button" class="link-btn" data-ui="allVoices" aria-expanded="${ui("allVoices")}">${ui("allVoices") ? "Hide" : "Use one voice for everyone"}</button>
        ${ui("allVoices") ? `
        <div class="preset-row reveal" data-r="allVoices" id="all-presets">
          ${PRESETS.map((p) => {
            const all = active.every((a) => vPresets(state.voices[a.id]).join() === p.id);
            return `<button type="button" class="preset ${all ? "selected" : ""}" data-all-preset="${p.id}">${escapeHtml(PRESET_SHORT[p.id])}</button>`;
          }).join("")}
        </div>` : ""}
      </section>

      <section class="calm-sec" aria-labelledby="appr-h">
        <h2 class="sec-title sr-only" id="appr-h">Approvals</h2>
        <button type="button" class="setting-row" data-ui="approvals" aria-expanded="${ui("approvals")}">
          <span class="sr-k">Approvals</span><span class="sr-v">${escapeHtml(ap.title)}</span><span class="sr-chev" aria-hidden="true">${ui("approvals") ? "▴" : "›"}</span>
        </button>
        ${ui("approvals") ? `
        <div class="approval-options reveal" data-r="approvals" id="approval-options">
          ${APPROVALS.map((a) => `
            <button type="button" class="option-card ${state.approval === a.id ? "selected" : ""}" data-approval="${a.id}">
              <strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.sample)}</span>
            </button>`).join("")}
        </div>` : ""}
      </section>
      ${screenNote("Mock connections · nothing touches real accounts")}
    </div>`;
}

/* Which picked pain area an agent's work belongs to (for "For: …" tags on Step 5). */
function agentGroup(agentId) {
  const picked = selectedGroups().find((g) => g.subs.some((s) => subSel(s.id) && s.agents.includes(agentId)));
  return picked || groupById(AGENT_HOME_GROUP[agentId]);
}
function forTag(agentId) {
  const g = agentGroup(agentId);
  return g ? `<span class="for-tag">For: ${g.icon} ${escapeHtml(g.short)}</span>` : "";
}

function sampleApprovals() {
  const items = [];
  if (state.agentsOn.pantry) items.push({ id: "a1", agentId: "pantry", title: `Drafted reorder for ${val("act_reorder")} low-stock items`, dp: "act_reorder", body: "Grain-free kibble, salmon treats, and dental chews. Waiting for your OK before it goes to the supplier." });
  if (state.agentsOn.orders) items.push({ id: "a2", agentId: "orders", title: `Flagged ${val("act_atRisk")} subscriptions at risk`, dp: "act_atRisk", body: "Maya R. skipped twice; Jordan P. clicked 'pause' three times. Win-back notes are drafted." });
  if (state.agentsOn.growth) items.push({ id: "a3", agentId: "growth", title: "Suggested a weekend promo", body: "Fill-a-bowl Friday: 15% off for first-time customers, split 60/40 Instagram vs. Google. Caption and budget split drafted." });
  if (state.agentsOn.pal) items.push({ id: "a4", agentId: "pal", title: "A sensitive reply needs your touch", body: "A customer is upset about a late delivery. The reply is drafted; a personal note from you is recommended." });
  if (state.agentsOn.ship) items.push({ id: "a5", agentId: "ship", title: "Fixed a packing mix-up before it shipped", body: "Order #1042 had the wrong kibble size. A corrected label is ready in ShipStation for your OK." });
  if (state.agentsOn.cash) items.push({ id: "a6", agentId: "cash", title: "Weekly margin check is ready", body: "Treats are your best margin; delivery fees are eating 6%. One spreadsheet-free summary from QuickBooks + Square." });
  items.push({ id: "a0", agentId: "captain", title: "3 small decisions batched for one tap", body: "Store Captain grouped today's routine calls so you approve once instead of checking each automation." });
  return items.slice(0, 5);
}

function sampleFeed() {
  const feed = [];
  if (state.agentsOn.pal) feed.push({ agentId: "pal", text: `Replied to ${val("act_faq")} customer questions`, dp: "act_faq", time: "Mon · 9:14a", voice: true });
  if (state.agentsOn.pantry) feed.push({ agentId: "pantry", text: `Flagged ${val("act_expiry")} near-expiry pouches`, dp: "act_expiry", time: "Mon · 11:02a" });
  if (state.agentsOn.orders) feed.push({ agentId: "orders", text: `Confirmed ${val("act_renewals")} subscription renewals`, dp: "act_renewals", time: "Tue · 8:40a", voice: true });
  if (state.agentsOn.ship) feed.push({ agentId: "ship", text: `Grouped ${val("act_deliveries")} same-block deliveries`, dp: "act_deliveries", time: "Tue · 2:15p", voice: true });
  if (state.agentsOn.cash) feed.push({ agentId: "cash", text: `Flagged ${val("act_lowMargin")} low-margin items`, dp: "act_lowMargin", time: "Wed · 10:20a" });
  if (state.agentsOn.growth) feed.push({ agentId: "growth", text: `Queued ${val("act_igDrafts")} Instagram drafts for review`, dp: "act_igDrafts", time: "Thu · 4:05p", voice: true });
  feed.push({ agentId: "captain", text: "Compiled your Friday briefing", time: "Fri · 7:55a", voice: true });
  return feed;
}

function renderDashboard() {
  const approvals = sampleApprovals();
  const feed = sampleFeed();
  const rev = val("revenue");
  const revPrev = inp("revenuePrev");
  const revDelta = revPrev > 0 ? Math.round((rev / revPrev - 1) * 100) : 0;
  const mDelta = val("margin") - inp("marginPrev");
  const arrow = (n) => (n >= 0 ? "↑" : "↓");
  const shownApprovals = ui("approvals") ? approvals : approvals.slice(0, 2);
  const shownFeed = ui("feed") ? feed : feed.slice(0, 3);
  const waiting = approvals.filter((a) => !state.approvalsResolved[a.id]).length;
  const editingEst = ui("edit-estimates");
  const showHoursKpi = state.estimatesConfirmed === true && !editingEst;
  const kpiCols = ui("kpis") ? (showHoursKpi ? "four" : "three") : (showHoursKpi ? "three" : "two");
  return `
    <div class="dash-header">
      <h1 class="screen-title">This week at ${escapeHtml(bizName())}</h1>
    </div>
    <div class="narrow wide">
      ${state.estimatesConfirmed === null && !editingEst ? `
      <div class="estimate-card">
        <div class="estimate-content">
          <div class="estimate-text">
            <h3 class="estimate-title">How much time do these problems take?</h3>
            <p class="estimate-sub">Optional. Enter your own hours and hourly cost if you want to see what this is costing you each week.</p>
          </div>
          <div class="estimate-actions">
            <button type="button" class="btn btn-sm btn-primary" data-confirm-estimates>Add estimates</button>
            <button type="button" class="btn btn-sm btn-ghost" data-decline-estimates>No thanks</button>
          </div>
        </div>
      </div>` : ""}
      ${editingEst ? estimateFormHTML() : ""}
      <div class="kpi-row ${kpiCols}">
        <div class="kpi">
          <div class="label">Revenue ${chip("revenue")}</div>
          <div class="value" data-kpi="revenue">${fmt("money", rev)}</div>
          <div class="delta ${revDelta < 0 ? "neg" : ""}">${arrow(revDelta)} ${Math.abs(revDelta)}% vs last week</div>
        </div>
        <div class="kpi">
          <div class="label">Margin ${chip("margin")}</div>
          <div class="value" data-kpi="margin">${fmt("pct", val("margin"))}</div>
          <div class="delta ${mDelta < 0 ? "neg" : ""}">${arrow(mDelta)} ${Math.abs(mDelta).toFixed(1)} pts</div>
        </div>
        ${showHoursKpi ? `
        <div class="kpi">
          <div class="label">Hours this costs you <button type="button" class="edit-est-btn" data-edit-estimates aria-label="Edit estimates">Edit</button></div>
          <div class="value" data-kpi="merchantHours">${fmtEstHours(merchantReportedHours())}</div>
          <div class="delta">~${fmt("money", merchantReportedCost())}/week <span class="est-note">based on your estimates</span></div>
        </div>` : ""}
        ${ui("kpis") ? `
        <div class="kpi reveal" data-r="kpis">
          <div class="label">Reply time ${chip("replyTime")}</div>
          <div class="value" data-kpi="replyTime">${fmt("minutes", val("replyTime"))}</div>
          <div class="delta">↓ from ${fmtDuration(inp("replyBeforeMin"))}</div>
        </div>` : ""}
      </div>
      <button type="button" class="more-link" data-ui="kpis" aria-expanded="${ui("kpis")}">${ui("kpis") ? "Fewer metrics" : "More metrics"}</button>
      ${state.estimatesConfirmed === false && !editingEst ? `<button type="button" class="quiet-add-est" data-confirm-estimates>Add time estimates</button>` : ""}

      <section class="calm-sec" aria-labelledby="ok-h">
        <div class="sec-head"><h2 class="sec-title" id="ok-h">Needs your OK</h2><span class="count" id="approval-count">${waiting} waiting</span></div>
        <div id="approval-list">
          ${shownApprovals.map((item) => {
            const agent = agentById(item.agentId);
            const resolved = state.approvalsResolved[item.id];
            const v = state.voices[item.agentId];
            const g = agentGroup(item.agentId);
            const dOpen = ui(`draft-${item.id}`);
            return `
              <div class="approval-item ${resolved ? "done" : ""} ${resolved === "edited" ? "edited" : ""}" data-approval-id="${item.id}">
                <div class="approval-top">
                  <div class="mini-avatar" aria-hidden="true">${agent.icon}</div>
                  <div class="approval-body">
                    <strong>${escapeHtml(item.title)}${item.dp ? chip(item.dp) : ""}</strong>
                    <span class="approval-meta">${escapeHtml(agent.name)}${g ? ` · <span class="for-tag">${escapeHtml(g.short)}</span>` : ""}${item.dp ? fixTag(item.dp) : ""}</span>
                    <p>${escapeHtml(item.body)}</p>
                    <button type="button" class="link-btn" data-ui="draft-${item.id}" aria-expanded="${dOpen}">${dOpen ? "Hide draft" : "View draft"}</button>
                    ${dOpen ? `
                    <div class="draft reveal" data-r="draft-${item.id}">
                      <div class="draft-head"><span>${escapeHtml(VOICE_LINES[item.agentId].context)}</span><span class="voice-tag">${escapeHtml(voiceLabel(v))}</span></div>
                      <div class="draft-text">${escapeHtml(voiceMessage(item.agentId))}</div>
                    </div>` : ""}
                  </div>
                </div>
                <div class="approval-actions">
                  <button type="button" class="btn btn-sm btn-primary btn-approve" data-approve="${item.id}">Approve</button>
                  <button type="button" class="btn btn-sm btn-ghost btn-edit" data-edit="${item.id}">Edit</button>
                </div>
                <div class="approval-status">${resolved === "edited" ? "Sent back to revise" : "Approved"}</div>
              </div>`;
          }).join("")}
        </div>
        ${approvals.length > 2 ? `<button type="button" class="more-link" data-ui="approvals" aria-expanded="${ui("approvals")}">${ui("approvals") ? "Show fewer" : `Show ${approvals.length - 2} more`}</button>` : ""}
      </section>

      <section class="calm-sec" aria-labelledby="act-h">
        <div class="sec-head"><h2 class="sec-title" id="act-h">This week</h2></div>
        <div>
          ${shownFeed.map((f) => {
            const agent = agentById(f.agentId);
            return `
              <div class="feed-item">
                <div class="mini-avatar" aria-hidden="true">${agent.icon}</div>
                <div class="feed-body"><p>${escapeHtml(f.text)}${f.dp ? chip(f.dp) : ""}</p><span class="feed-sub">${escapeHtml(agent.name)}${f.dp ? fixTag(f.dp) : ""}</span></div>
                <div class="feed-time">${f.time}</div>
              </div>`;
          }).join("")}
        </div>
        ${feed.length > 3 ? `<button type="button" class="more-link" data-ui="feed" aria-expanded="${ui("feed")}">${ui("feed") ? "Show less" : `Show all ${feed.length}`}</button>` : ""}
      </section>
      ${screenNote()}
    </div>`;
}

function homeTasks() {
  const waiting = [], working = [], done = [];
  sampleApprovals().forEach((a) => {
    const r = state.approvalsResolved[a.id];
    const t = { agentId: a.agentId, title: a.title, status: r === "approved" ? "Done · approved by you" : r === "edited" ? "Revising your edit" : "Needs your OK", wait: !r };
    (r ? done : waiting).push(t);
  });
  const verb = { "Replied to": "Replying to", Flagged: "Watching", Confirmed: "Confirming", Grouped: "Grouping", Queued: "Drafting", Compiled: "Compiling" };
  sampleFeed().slice(0, 3).forEach((f) => working.push({ agentId: f.agentId, title: f.text.replace(/^(Replied to|Flagged|Confirmed|Grouped|Queued|Compiled)/, (m) => verb[m]), status: "Working on it", wait: false }));
  const mine = (state.homeTasks || []).slice().reverse().map((t) => ({ agentId: "captain", title: t, status: "Working on it", wait: false }));
  const fixes = Object.keys(state.fixes || {}).filter((fid) => state.fixes[fid] === "applied").reverse().map((fid) => ({ agentId: FIXES[fid].agents[0], title: FIXES[fid].title, status: "Fix applied · setting up", wait: false, fix: true }));
  return [...mine, ...fixes, ...waiting.slice(0, 2), ...working.slice(0, 2), ...waiting.slice(2), ...working.slice(2), ...done];
}
function homeHTML() {
  const tasks = homeTasks();
  const shown = ui("tasks") ? tasks : tasks.slice(0, 4);
  return `
    <section class="home" aria-label="Home">
      <h1 class="home-title">Good afternoon, ${escapeHtml(BUSINESS_CONFIG.ownerFirstName)}</h1>
      <form class="prompt-box" id="prompt-form">
        <label class="sr-only" for="prompt-input">Work with Gemini</label>
        <div class="prompt-row"><input id="prompt-input" type="text" placeholder="Work with Gemini" autocomplete="off" /></div>
        <div class="prompt-actions">
          <button type="button" class="prompt-plus" aria-label="Add" data-prompt-plus>+</button>
          <span class="prompt-mode">Auto <span aria-hidden="true">⌄</span></span>
          <button type="submit" class="prompt-send" aria-label="Send">↑</button>
        </div>
      </form>
      <div class="prompt-suggest" aria-label="Suggestions">
        ${["Best sellers this week", "Draft a promo"].map((q) => `<button type="button" class="suggest-pill" data-suggest="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join("")}
      </div>
      <button type="button" class="scn-launch" data-scenario>
        <span class="scn-play" aria-hidden="true">▶</span>
        <span class="scn-launch-text"><b>See it in action</b><span>Watch your team clear excess stock</span></span>
        <span aria-hidden="true">›</span>
      </button>
      <div class="tasks">
        <h2 class="tasks-head">Your tasks</h2>
        <ul class="task-list" id="task-list">
          ${shown.map((t) => {
            const a = agentById(t.agentId);
            return `<li class="task ${t.wait ? "waiting" : ""} ${t.fix ? "fix" : ""}">
              <button type="button" class="task-btn" ${t.wait ? `data-goto-dash` : ""}>
                <span class="task-title">${escapeHtml(t.title)}</span>
                <span class="task-status">${escapeHtml(t.status)} · ${escapeHtml(a.name)}</span>
              </button>
            </li>`;
          }).join("")}
        </ul>
        ${tasks.length > 4 ? `<button type="button" class="more-link" data-ui="tasks" aria-expanded="${ui("tasks")}">${ui("tasks") ? "Show fewer" : `Show all ${tasks.length}`}</button>` : ""}
      </div>
    </section>`;
}

function renderClosing() {
  const pains = selectedGroups();
  const agents = activeAgents();
  return `
    ${homeHTML()}
    <div class="narrow">
      <button type="button" class="setting-row summary-toggle" data-ui="summary" aria-expanded="${ui("summary")}">
        <span class="sr-k">Your setup</span><span class="sr-v">${val("sel_pains")} problems · ${agents.length} agents · ${val("sel_tools")} apps</span><span class="sr-chev" aria-hidden="true">${ui("summary") ? "▴" : "›"}</span>
      </button>
      ${ui("summary") ? `
      <div class="close-card reveal" data-r="summary">
        <div class="summary-path">
          <div class="summary-box">
            <h4>Pain areas</h4>
            <ul>${pains.map((g) => `<li>${g.icon} ${escapeHtml(g.short)} <span class="voice-tag">${countIn(g)}</span></li>`).join("") || "<li>None selected</li>"}</ul>
          </div>
          <div class="summary-box">
            <h4>Agents</h4>
            <ul>${agents.slice(0, 5).map((a) => `<li>${a.icon} ${escapeHtml(a.name)} <span class="voice-tag">${escapeHtml(voiceLabel(state.voices[a.id]))}</span></li>`).join("")}</ul>
          </div>
          <div class="summary-box">
            <h4>Impact</h4>
            ${state.estimatesConfirmed === true ? `
            <ul>
              <li>${fmtEstHours(merchantReportedHours())}/week this costs you</li>
              <li>~${fmt("money", merchantReportedCost())}/week · based on your estimates</li>
            </ul>` : `
            <ul>
              <li>Revenue: ${fmt("money", val("revenue"))}/week ${chip("revenue")}</li>
              <li>Margin: ${fmt("pct", val("margin"))} ${chip("margin")}</li>
            </ul>`}
          </div>
        </div>
      </div>` : ""}
      <div class="close-actions"><button type="button" class="link-btn" id="cta-restart">Restart demo</button></div>
      ${screenNote("Sample data · not a guarantee")}
    </div>`;
}

/* ---------- Bindings ---------- */
function replaceAgentCard(id, reveal) {
  const el = document.querySelector(`.agent-card[data-agent="${id}"]`);
  if (!el) return;
  el.outerHTML = agentCardHTML(agentById(id), recommendedAgents());
  settleReveals(document.querySelector(`.agent-card[data-agent="${id}"]`), reveal);
}
/* Only the disclosure the user just opened animates; everything re-rendered around it stays put. */
function settleReveals(root, key) {
  root?.querySelectorAll(".reveal").forEach((el) => { if (!key || el.dataset.r !== key) el.classList.add("static"); });
}
function setVoice(id, patch) { Object.assign(state.voices[id], patch); }

function handlePreset(btn) {
  const id = btn.dataset.vagent;
  const hint = togglePreset(state.voices[id], btn.dataset.preset);
  state.voiceHint = hint ? { id, text: hint } : null;
}

function bindScreen() {
  if (state.step === 0) {
    document.getElementById("biz-name")?.addEventListener("input", (e) => { state.business.name = e.target.value; setNav(); });
    document.getElementById("biz-other")?.addEventListener("input", (e) => { state.business.other = e.target.value; });
    document.getElementById("type-chips")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-type]"); if (!b) return; state.business.type = b.dataset.type; render({ keepScroll: true }); if (b.dataset.type === "other") document.getElementById("biz-other")?.focus({ preventScroll: true });
    });
    document.getElementById("size-chips")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]"); if (!b) return; state.business.size = b.dataset.size; render({ keepScroll: true });
    });
  }

  if (state.step === 1) {
    document.getElementById("group-list")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-group]"); if (b) openGroup(b.dataset.group);
    });
    setupScrollHint();
    stage.querySelectorAll("[data-back-menu]").forEach((b) => b.addEventListener("click", backToMenu));
    stage.querySelector("[data-select-all]")?.addEventListener("click", (e) => {
      const g = groupById(e.currentTarget.dataset.selectAll);
      const allOn = g.subs.every((s) => subSel(s.id));
      if (allOn) state.selectedSubs = state.selectedSubs.filter((x) => !g.subs.some((s) => s.id === x.id));
      else g.subs.forEach((s) => { if (!subSel(s.id)) state.selectedSubs.push({ id: s.id }); });
      state._agentsTouched = false;
      AGENTS.forEach((a) => { if (!a.alwaysOn) delete state.agentsOn[a.id]; });
      render({ keepScroll: true });
    });
    const list = document.getElementById("sub-list");
    list?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sub-toggle]"); if (!b) return;
      const id = b.dataset.subToggle;
      const idx = state.selectedSubs.findIndex((s) => s.id === id);
      if (idx >= 0) state.selectedSubs.splice(idx, 1); else state.selectedSubs.push({ id });
      state._agentsTouched = false;
      AGENTS.forEach((a) => { if (!a.alwaysOn) delete state.agentsOn[a.id]; });
      render({ keepScroll: true });
    });
  }

  if (state.step === 2) {
    const grid = document.getElementById("agent-grid");
    grid?.addEventListener("click", (e) => {
      const t = e.target;
      const toggle = t.closest("[data-toggle]");
      if (toggle) { if (toggle.disabled) return; state.agentsOn[toggle.dataset.toggle] = !state.agentsOn[toggle.dataset.toggle]; state._agentsTouched = true; replaceAgentCard(toggle.dataset.toggle); setNav(); return; }
      const vt = t.closest("[data-voice-toggle]");
      if (vt) {
        const id = vt.dataset.voiceToggle;
        const opening = !state.openVoice.has(id);
        if (opening) state.openVoice.add(id); else state.openVoice.delete(id);
        replaceAgentCard(id, opening ? `voice-${id}` : null); return;
      }
      const pr = t.closest("[data-preset]");
      if (pr) { handlePreset(pr); replaceAgentCard(pr.dataset.vagent); state.voiceHint = null; return; }
      const em = t.closest("[data-emoji]");
      if (em) { const id = em.dataset.emoji; setVoice(id, { emoji: !state.voices[id].emoji }); replaceAgentCard(id); return; }
      const ln = t.closest("[data-length]");
      if (ln) { setVoice(ln.dataset.vagent, { length: ln.dataset.length }); replaceAgentCard(ln.dataset.vagent); return; }
      const all = t.closest("[data-apply-all]");
      if (all) {
        const src = state.voices[all.dataset.applyAll];
        AGENTS.forEach((a) => { state.voices[a.id] = { ...src, presets: [...vPresets(src)] }; });
        render({ keepScroll: true });
        toast(`${voiceLabel(src)} voice applied to all ${AGENTS.length} agents`);
      }
    });
    grid?.addEventListener("input", (e) => {
      const r = e.target.closest("[data-formality]"); if (!r) return;
      const id = r.dataset.formality;
      setVoice(id, { formality: Number(r.value) });
      document.querySelector(`[data-formality-label="${id}"]`).textContent = FORMALITY_LABELS[state.voices[id].formality];
      document.querySelector(`[data-preview="${id}"]`).textContent = voiceMessage(id);
    });
  }

  if (state.step === 3) {
    document.getElementById("connectors")?.addEventListener("click", (e) => {
      if (e.target.closest("[data-more-toggle]")) { state.showMore = !state.showMore; render({ keepScroll: true, reveal: state.showMore ? "more" : null }); return; }
      const b = e.target.closest("[data-tool-btn]"); if (!b) return; state.tools[b.dataset.toolBtn] = !state.tools[b.dataset.toolBtn]; render({ keepScroll: true });
    });
    document.getElementById("voice-summary")?.addEventListener("click", (e) => {
      const row = e.target.closest("[data-vs-row]");
      if (row) { const id = row.dataset.vsRow; state.voiceEdit = state.voiceEdit === id ? null : id; state.voiceHint = null; render({ keepScroll: true, reveal: state.voiceEdit ? `vs-${id}` : null }); stage.querySelector(`[data-vs-row="${id}"]`)?.focus({ preventScroll: true }); return; }
      const pr = e.target.closest("[data-preset]");
      if (pr) { handlePreset(pr); render({ keepScroll: true }); state.voiceHint = null; return; }
      const b = e.target.closest("[data-all-preset]");
      if (b) {
        AGENTS.forEach((a) => setPresetsSingle(state.voices[a.id], b.dataset.allPreset));
        render({ keepScroll: true });
        toast(`${PRESET_SHORT[b.dataset.allPreset]} voice applied to all agents`);
      }
    });
    document.getElementById("approval-options")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-approval]"); if (!b) return; state.approval = b.dataset.approval; render({ keepScroll: true });
    });
  }

  if (state.step === 4) {
    document.getElementById("approval-list")?.addEventListener("click", (e) => {
      const approve = e.target.closest("[data-approve]");
      const edit = e.target.closest("[data-edit]");
      if (approve) { state.approvalsResolved[approve.dataset.approve] = "approved"; render({ keepScroll: true }); }
      else if (edit) { state.approvalsResolved[edit.dataset.edit] = "edited"; render({ keepScroll: true }); }
    });
  }

  if (state.step === 5) {
    document.getElementById("prompt-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const inpEl = document.getElementById("prompt-input");
      const t = inpEl.value.trim();
      if (!t) { inpEl.focus(); return; }
      state.homeTasks.push(t.length > 80 ? t.slice(0, 78) + "…" : t);
      render({ keepScroll: true });
      toast("Store Captain picked it up (demo).");
    });
    stage.querySelectorAll("[data-suggest]").forEach((b) => b.addEventListener("click", () => {
      document.getElementById("prompt-input").value = b.dataset.suggest;
      document.getElementById("prompt-form").requestSubmit();
    }));
    document.querySelector("[data-prompt-plus]")?.addEventListener("click", () => toast("In the full product, you could attach files or photos here."));
    document.getElementById("task-list")?.addEventListener("click", (e) => { if (e.target.closest("[data-goto-dash]")) go(4); });
    document.getElementById("cta-restart")?.addEventListener("click", restartDemo);
  }
}

/* One delegated handler for every "show more / details" disclosure (state.ui). */
stage.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ui]");
  if (!b || !stage.contains(b)) return;
  const k = b.dataset.ui;
  state.ui[k] = !state.ui[k];
  render({ keepScroll: true, reveal: state.ui[k] ? k : null });
  const again = stage.querySelector(`[data-ui="${CSS.escape(k)}"]`);
  again?.focus({ preventScroll: true });
});

/* Estimate confirmation handlers */
stage.addEventListener("click", (e) => {
  if (e.target.closest("[data-confirm-estimates]")) {
    if (state.savedEstimates) restoreEstimates(state.savedEstimates);
    state.ui["edit-estimates"] = true;
    render({ keepScroll: true, reveal: "edit-estimates" });
    document.querySelector(".cat-hours-input, #est-total-hours")?.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest("[data-decline-estimates]")) {
    state.estimatesConfirmed = false;
    state.ui["edit-estimates"] = false;
    render({ keepScroll: true });
    return;
  }
  if (e.target.closest("[data-edit-estimates]")) {
    state.ui["edit-estimates"] = true;
    render({ keepScroll: true, reveal: "edit-estimates" });
    document.querySelector(".cat-hours-input, #est-total-hours")?.focus({ preventScroll: true });
    return;
  }
  if (e.target.closest("[data-mode]")) {
    const mode = e.target.closest("[data-mode]").dataset.mode;
    if (mode === state.estimateMode) return;
    readEstimateForm();
    if (mode === "total" && (state.totalHours == null || state.totalHours === "") && merchantReportedHours()) {
      state.totalHours = merchantReportedHours();
    }
    state.estimateMode = mode;
    render({ keepScroll: true, reveal: "edit-estimates" });
    return;
  }
  if (e.target.closest("[data-save-estimates]")) {
    readEstimateForm();
    state.savedEstimates = snapshotEstimates();
    state.estimatesConfirmed = true;
    state.ui["edit-estimates"] = false;
    render({ keepScroll: true });
    toast("Estimates saved");
    return;
  }
  if (e.target.closest("[data-cancel-edit-estimates]")) {
    restoreEstimates(state.savedEstimates);
    state.ui["edit-estimates"] = false;
    render({ keepScroll: true });
    return;
  }
});

/* Update running total as category hours are entered */
stage.addEventListener("input", (e) => {
  if (e.target.classList.contains("cat-hours-input")) {
    let total = 0;
    document.querySelectorAll(".cat-hours-input").forEach((input) => {
      total += Number(input.value) || 0;
    });
    const totalEl = document.getElementById("hours-total");
    if (totalEl) totalEl.textContent = fmtEstHoursNum(total);
  }
});

function updateTallyLive() {
  const h = document.getElementById("tally-hours");
  const d = document.getElementById("tally-dollars");
  const list = document.getElementById("tally-list");
  if (h) h.textContent = String(Math.round(val("hoursLost")));
  if (d) d.textContent = fmt("money", val("dollarsAtStake"));
  if (list) list.innerHTML = tallyListHTML();
  refreshPop();
  setNav();
}

function restartDemo() {
  closePop();
  freshState();
  go(0);
  showSplash();
}

/* ---------- "Learning how you work" (runs after connectors) ---------- */
const LEARN = {
  gmail: { verb: "Reading your Gmail threads…", fact: "Most customer emails land between 7 and 9 PM" },
  square: { verb: "Checking your Square sales…", fact: "Saturday is your busiest day; grain-free kibble is the top seller" },
  gcal: { verb: "Looking at your calendar…", fact: "Deliveries run Tuesdays and Fridays; Thursdays are vendor days" },
  shopify: { verb: "Scanning your online orders…", fact: "About 38% of orders are online, mostly subscription add-ons" },
  recharge: { verb: "Reviewing subscriptions…", fact: "Subscribers are most likely to skip after their second box" },
  quickbooks: { verb: "Reading your books…", fact: "Treats carry your best margin; delivery fees eat about 6%" },
  stripe: { verb: "Checking payouts…", fact: "Payouts land every 2 business days" },
  sheets: { verb: "Opening your spreadsheets…", fact: "You track supplier prices by hand in a sheet called \u201cVendors\u201d" },
  gads: { verb: "Checking your search ads…", fact: "Search ads bring in most first-time buyers" },
  meta: { verb: "Looking at Instagram & Facebook…", fact: "Short Reels get about 3× the reach of photo posts" },
  tiktok: { verb: "Checking TikTok…", fact: "Unboxing videos with pets get the most views" },
  gbp: { verb: "Reading your Google reviews…", fact: "Reviews praise friendly staff; a few mention late deliveries" },
  klaviyo: { verb: "Checking your email campaigns…", fact: "Your monthly newsletter opens best on Sunday mornings" },
  sms: { verb: "Checking text messages…", fact: "Customers answer texts faster than emails" },
  igdm: { verb: "Reading Instagram DMs…", fact: "Most DMs ask \u201cwhen will my order arrive?\u201d" },
  supplier: { verb: "Reading supplier emails…", fact: "Your main supplier delivers Thursdays with 5-day lead time" },
  shipstation: { verb: "Checking shipments…", fact: "Most packing mistakes are the wrong bag size" },
  approvals: { verb: "Setting up one-tap approvals…", fact: "You prefer quick yes/no approvals on your phone" },
};
function learnSources() {
  const order = [];
  selectedGroups().forEach((g) => g.connectors.forEach((c) => { if (state.tools[c.id] && !order.includes(c.id)) order.push(c.id); }));
  Object.keys(CONNECTORS).forEach((id) => { if (state.tools[id] && !order.includes(id)) order.push(id); });
  return order.slice(0, 5);
}
function runLaunchSequence() {
  return new Promise((resolve) => {
    const agents = activeAgents();
    const sources = learnSources();
    const title = document.getElementById("learn-title");
    const status = document.getElementById("learn-status");
    const icons = document.getElementById("learn-icons");
    const facts = document.getElementById("learn-facts");
    const team = document.getElementById("launch-list");
    const cont = document.getElementById("learn-continue");
    title.textContent = "Learning how you work.";
    status.textContent = "Getting started…";
    cont.hidden = true; team.innerHTML = ""; team.hidden = true;
    icons.innerHTML = sources.map((id) => {
      const k = CONNECTORS[id];
      return `<div class="learn-icon" data-learn="${id}"><span class="app-ico" style="--c:${k.color}">${k.initials}</span><span class="learn-icon-name">${escapeHtml(k.name.split(" (")[0].split(" or ")[0])}</span></div>`;
    }).join("");
    const factItems = [
      { icon: "👤", text: `You run a ${bizNoun()}${bizSize() ? ` with ${bizSize().phrase}` : ""}` },
      ...sources.map((id) => ({ id, text: LEARN[id]?.fact || `Learned how you use ${CONNECTORS[id].name}` })),
    ];
    facts.innerHTML = "";
    launchOverlay.hidden = false;
    launchOverlay.scrollTop = 0;
    const addFact = (f) => {
      const li = document.createElement("li");
      li.className = "learn-fact";
      li.innerHTML = f.id
        ? `<span class="app-ico xs" style="--c:${CONNECTORS[f.id].color}">${CONNECTORS[f.id].initials}</span><span>${escapeHtml(f.text)}</span>`
        : `<span class="fact-ico" aria-hidden="true">${f.icon}</span><span>${escapeHtml(f.text)}</span>`;
      facts.appendChild(li);
    };
    const STEP = 850;
    let i = 0;
    const tick = () => {
      if (i === 0) addFact(factItems[0]);
      if (i < sources.length) {
        const id = sources[i];
        icons.querySelectorAll(".learn-icon").forEach((el) => el.classList.toggle("active", el.dataset.learn === id));
        icons.querySelector(`[data-learn="${id}"]`)?.classList.add("lit");
        status.textContent = LEARN[id]?.verb || `Checking ${CONNECTORS[id].name}…`;
        setTimeout(() => addFact(factItems[i + 1]), STEP * 0.55);
        setTimeout(() => { i += 1; tick(); }, STEP);
        return;
      }
      icons.querySelectorAll(".learn-icon").forEach((el) => el.classList.remove("active"));
      title.textContent = "Here\u2019s what I learned.";
      status.textContent = `All done. ${factItems.length} things your team will remember (sample).`;
      team.innerHTML = agents.map((a) => `<li class="online" title="${escapeHtml(a.name)} · ${escapeHtml(voiceLabel(state.voices[a.id]))} voice"><span aria-hidden="true">${a.icon}</span><span class="sr-only">${escapeHtml(a.name)} online</span></li>`).join("") + `<li class="team-cap">Your team is online</li>`;
      team.hidden = false;
      cont.hidden = false;
      cont.focus({ preventScroll: true });
      cont.onclick = () => { launchOverlay.hidden = true; resolve(); };
    };
    setTimeout(tick, 350);
  });
}

/* ---------- Nav events ---------- */
btnBack.addEventListener("click", () => { if (state.step === 1 && state.painGroup) { backToMenu(); return; } if (state.step > 0) go(state.step - 1); });
btnNext.addEventListener("click", async () => {
  if (btnNext.disabled) return;
  // A Step 2 sub-screen never advances: it saves and returns to the full pain menu.
  if (state.step === 1 && state.painGroup) { backToMenu(); return; }
  if (state.step === 1 && !state.selectedSubs.length) return;
  if (state.step === 3) { btnNext.disabled = true; closePop(); launching = true; await runLaunchSequence(); launching = false; go(4); return; }
  if (state.step === 5) { toast("In a real pitch, this opens signup. Nice work!"); return; }
  go(state.step + 1);
});


/* ---------- "See it in action" guided scenario: clear excess stock (all SAMPLE / illustrative) ---------- */
const SCN_BEATS = 5;
const scn = { open: false, beat: 0, phase: 0, tab: "ig", view: "after", approved: false, timer: null, tick: null, paused: false, origin: null };
const scnEl = document.createElement("div");
scnEl.className = "scn";
scnEl.id = "scenario";
scnEl.setAttribute("role", "dialog");
scnEl.setAttribute("aria-modal", "true");
scnEl.setAttribute("aria-labelledby", "scn-title");
scnEl.hidden = true;
document.body.appendChild(scnEl);

function promoCopy(kind) {
  const v = state.voices.growth;
  const ps = vPresets(v);
  let body = kind === "sms"
    ? "Weekend only: Salmon Supper Bundle, 3 salmon pouches + a treat, 20% off!"
    : "Meet the Salmon Supper Bundle: 3 grain-free salmon pouches + a treat, 20% off this weekend only!";
  if (ps.includes("concise")) body = body.split(/(?<=[.!?])\s+/)[0];
  if (kind !== "sms") ps.forEach((id) => { const m = VOICE_MODS[id]; if (m) body += ` ${fillVars(m.post)}`; });
  if (ps.includes("pro") || v.formality >= 4) body = body.replace(/!/g, ".");
  if (v.emoji) body += " 🐟🐾";
  return body;
}
const handle = () => "@" + bizName().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "");
const siteHost = () => bizName().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, "") + ".shop";

function scnBeatHTML() {
  const b = scn.beat, ph = scn.phase;
  const ag = (id) => { const a = agentById(id); return `<span class="scn-agent"><span aria-hidden="true">${a.icon}</span>${escapeHtml(a.name)}</span>`; };
  if (b === 0) {
    const rows = [["Grain-free kibble 12 lb", "18 · 9/wk"], ["Grain-free salmon pouches", "48 · 6/wk"], ["Dental chews", "4 · 11/wk"], ["Turkey & pumpkin pouches", "9 · 4/wk"]];
    return `
      ${ag("pantry")}
      <h2 class="scn-title" id="scn-title" tabindex="-1">${ph ? "Found excess stock" : "Checking your stock…"}</h2>
      <div class="scn-sources"><span class="app-ico" style="--c:#3E4348">Sq</span> Square POS <span class="scn-dot">·</span> <span class="app-ico" style="--c:#96BF48">In</span> Inventory</div>
      <div class="scn-scan ${ph ? "done" : "scanning"}">
        ${rows.map((r, i) => `<div class="scn-srow ${ph && i === 1 ? "hit" : ""}" style="--i:${i}"><span>${r[0]}</span><span>${r[1]}</span></div>`).join("")}
        <span class="scn-beam" aria-hidden="true"></span>
      </div>
      ${ph ? `
      <div class="scn-card reveal">
        <strong>Grain-free salmon pouches</strong>
        <div class="scn-facts"><span><b>48</b> units</span><span><b>21</b> days to expiry</span><span>selling <b>6</b>/week</span></div>
        <p class="scn-result">→ ~${val("scn_atRisk")} units at risk (${fmt("money", val("scn_atRiskValue"))}) ${chip("scn_atRiskValue")}</p>
      </div>` : ""}`;
  }
  if (b === 1) {
    const g = state.voices.growth;
    return `
      ${ag("growth")}
      <h2 class="scn-title" id="scn-title" tabindex="-1">A promo to move it</h2>
      <div class="scn-card offer">
        <span class="scn-tag">Weekend offer</span>
        <strong>Salmon Supper Bundle</strong>
        <span>3 pouches + treat · 20% off this weekend · <b>$20.80</b> <s>$26</s></span>
      </div>
      <div class="seg scn-tabs" role="tablist" aria-label="Preview">
        <button type="button" role="tab" aria-selected="${scn.tab === "ig"}" class="${scn.tab === "ig" ? "selected" : ""}" data-scn-tab="ig">Instagram</button>
        <button type="button" role="tab" aria-selected="${scn.tab === "msg"}" class="${scn.tab === "msg" ? "selected" : ""}" data-scn-tab="msg">Email / SMS</button>
      </div>
      ${scn.tab === "ig" ? `
      <div class="ig-post">
        <div class="ig-head"><span class="ig-av" aria-hidden="true">🐾</span><b>${escapeHtml(handle())}</b></div>
        <div class="ig-img" aria-hidden="true"><span>🐟</span><em>Weekend bundle · 20% off</em></div>
        <p class="ig-cap">${escapeHtml(promoCopy("post"))}</p>
      </div>` : `
      <div class="msg-prev">
        <div class="msg-row"><span class="ch-ico" style="--c:#EA4335">Email</span><b>Subject:</b> Salmon Supper Bundle · 20% off this weekend</div>
        <div class="msg-row"><span class="ch-ico" style="--c:#34A853">SMS</span>${escapeHtml(promoCopy("sms"))} Reply STOP to opt out.</div>
      </div>`}
      <p class="scn-voice">In Growth Spark's voice · ${escapeHtml(voiceLabel(g))}</p>
      <div class="scn-check"><span aria-hidden="true">💰</span><span>Cash Sense margin check: still <b>${fmt("pct", val("scn_margin"))}</b> margin ${chip("scn_margin")}</span><span class="ok" aria-hidden="true">✓</span></div>`;
  }
  if (b === 2) {
    return `
      ${ag("captain")}
      <h2 class="scn-title" id="scn-title" tabindex="-1">${scn.approved ? "Approved" : "Ready when you are"}</h2>
      <div class="scn-card">
        <strong>Salmon Supper Bundle · 20% off</strong>
        <ul class="scn-list">
          <li>Website banner + product badge</li>
          <li>Instagram post</li>
          <li>Email list (412) + SMS</li>
          <li>Fri 8 AM – Sun 8 PM</li>
        </ul>
      </div>
      ${scn.approved
        ? `<p class="scn-approved reveal">✓ Publishing now…</p>`
        : `<div class="scn-approve"><button type="button" class="btn btn-primary" data-scn-approve>Approve &amp; publish</button><button type="button" class="btn btn-ghost" data-scn-edit>Edit</button></div>`}
      <p class="scn-fine">Nothing goes live without your OK.</p>`;
  }
  if (b === 3) {
    const after = scn.view === "after";
    return `
      ${ag("growth")}
      <h2 class="scn-title" id="scn-title" tabindex="-1">Live on your website</h2>
      <div class="seg scn-tabs" role="tablist" aria-label="Website">
        <button type="button" role="tab" aria-selected="${!after}" class="${!after ? "selected" : ""}" data-scn-view="before">Before</button>
        <button type="button" role="tab" aria-selected="${after}" class="${after ? "selected" : ""}" data-scn-view="after">After</button>
      </div>
      <div class="site ${after ? "after" : ""}">
        <div class="site-bar"><span></span><span></span><span></span><em>${escapeHtml(siteHost())}</em></div>
        <div class="site-head"><b>${escapeHtml(bizName())}</b><span>Shop · Subscribe · Visit</span></div>
        <div class="site-hero">${after
          ? `<div class="site-banner"><em>Weekend bundle · 20% off</em><b>Salmon Supper Bundle</b></div>`
          : `<div class="site-banner plain"><b>Fresh food for happy pets</b></div>`}</div>
        <div class="site-grid">
          <div class="site-prod">${after ? `<span class="site-badge">Weekend bundle · 20% off</span>` : ""}<span class="site-img" aria-hidden="true">🐟</span><b>Grain-free salmon pouches</b><span>$7.00</span></div>
          <div class="site-prod"><span class="site-img" aria-hidden="true">🦴</span><b>Dental chews</b><span>$12.00</span></div>
        </div>
      </div>
      <p class="scn-published ${after ? "on" : ""}">${after ? "✓ Published to website · Instagram · Email list (412)" : "&nbsp;"}</p>`;
  }
  // b === 4
  if (!ph) {
    return `<div class="scn-skip"><span class="scn-clock" aria-hidden="true">🕐</span><h2 class="scn-title" id="scn-title" tabindex="-1">Weekend later…</h2></div>`;
  }
  const days = [["Fri", 2], ["Sat", 4], ["Sun", 3]];
  const fx = state.fixes.fx_reorder20;
  return `
    ${ag("captain")}
    <h2 class="scn-title" id="scn-title" tabindex="-1">How the weekend went</h2>
    <div class="scn-kpis">
      <div><span>Units sold</span><b>${val("scn_sold")} <small>of ${val("scn_atRisk")}</small></b>${chip("scn_sold")}</div>
      <div><span>Revenue recovered</span><b>${fmt("money", val("scn_revenue"))}</b>${chip("scn_revenue")}</div>
      <div><span>Waste avoided</span><b>${fmt("money", val("scn_waste"))}</b>${chip("scn_waste")}</div>
      <div><span>New customers</span><b>${val("scn_newCust")}</b>${chip("scn_newCust")}</div>
    </div>
    <div class="scn-chart" aria-label="Bundles sold: Friday 2, Saturday 4, Sunday 3">
      <p class="scn-chart-cap">Bundles sold</p>
      ${days.map(([d, n]) => `<div class="bar"><i style="--h:${n / 4}"></i><span>${d}</span><em>${n}</em></div>`).join("")}
      <p class="scn-reach">Reach ${val("scn_reach").toLocaleString()} · ${val("scn_clicks")} clicks ${chip("scn_reach")}</p>
    </div>
    <div class="fix-card ${fx || ""}">
      <strong>Next time: lower salmon reorder qty by 20%</strong>
      <span class="fix-meta">Pantry Stock · avoids most of the excess next month</span>
      ${fx === "applied"
        ? `<div class="fix-state"><span>✓ Applied · Store Captain is on it</span><button type="button" class="link-btn" data-scn-fix-undo>Undo</button></div>`
        : `<div class="fix-actions"><button type="button" class="btn btn-sm btn-primary" data-scn-fix>Apply</button><button type="button" class="btn btn-sm btn-ghost" data-scn-fix-skip>Not now</button></div>`}
    </div>`;
}

function scnHTML() {
  const last = scn.beat === SCN_BEATS - 1;
  const showNext = !(scn.beat === 2 && !scn.approved) && !(last && !scn.phase);
  return `
    <div class="scn-top">
      <svg class="brand-mark" width="18" height="18" aria-hidden="true"><use href="#sparkle" /></svg>
      <span class="scn-name">See it in action</span>
      <div class="scn-dots" aria-label="Step ${scn.beat + 1} of ${SCN_BEATS}">${Array.from({ length: SCN_BEATS }, (_, i) => `<i class="${i < scn.beat ? "done" : i === scn.beat ? "on" : ""}"></i>`).join("")}</div>
      <button type="button" class="scn-close" data-scn-close aria-label="Close">×</button>
    </div>
    <div class="scn-body"><div class="scn-beat" data-beat="${scn.beat + 1}">${scnBeatHTML()}</div></div>
    <div class="scn-foot">
      <span class="scn-sample">Sample · illustrative</span>
      ${showNext ? `<button type="button" class="btn btn-primary scn-next" data-scn-next>${last ? "Done" : "Continue"}${scn.timer && !scn.paused ? `<span class="scn-timer" aria-hidden="true"></span>` : ""}</button>` : ""}
    </div>`;
}

function scnClear() { clearTimeout(scn.timer); clearTimeout(scn.tick); scn.timer = null; scn.tick = null; }
function scnPaint(focus = true) {
  const body = scnEl.querySelector(".scn-body");
  const st = body ? body.scrollTop : 0;
  scnEl.innerHTML = scnHTML();
  if (!focus) scnEl.querySelector(".scn-body").scrollTop = st;
  else scnEl.querySelector("#scn-title")?.focus?.({ preventScroll: true });
}
/* Auto-advance (only for passive beats; never approves on your behalf; off with reduced motion). */
function scnAuto(ms) {
  if (REDUCED_MOTION() || scn.paused) return;
  scn.timer = setTimeout(() => { scn.timer = null; scnGo(scn.beat + 1); }, ms);
  scnEl.style.setProperty("--auto", `${ms}ms`);
}
function scnGo(beat) {
  scnClear();
  if (beat >= SCN_BEATS) { closeScenario(); return; }
  scn.beat = beat; scn.phase = 0;
  const reduced = REDUCED_MOTION();
  if (beat === 0) {
    if (reduced) { scn.phase = 1; scnAuto(0); } else scn.tick = setTimeout(() => { scn.phase = 1; scnPaint(false); scnAuto(6000); scnPaint(false); }, 2200);
  } else if (beat === 1) { scn.tab = "ig"; scnAuto(9000); }
  else if (beat === 2) { scn.approved = false; }
  else if (beat === 3) {
    if (reduced) scn.view = "after";
    else { scn.view = "before"; scn.tick = setTimeout(() => { scn.view = "after"; scnPaint(false); scnAuto(6000); scnPaint(false); }, 1400); }
  } else if (beat === 4) {
    if (reduced) scn.phase = 1; else scn.tick = setTimeout(() => { scn.phase = 1; scnPaint(); }, 1300);
  }
  if (reduced) scnClear();
  scnPaint();
}
function openScenario(origin) {
  closePop();
  scn.open = true; scn.paused = false; scn.origin = origin || null;
  scnEl.hidden = false;
  document.body.classList.add("scn-open");
  scnGo(0);
}
function closeScenario() {
  scnClear();
  scn.open = false;
  scnEl.hidden = true;
  document.body.classList.remove("scn-open");
  render({ keepScroll: true });
  scn.origin?.isConnected && scn.origin.focus({ preventScroll: true });
}
scnEl.addEventListener("click", (e) => {
  const t = e.target;
  if (t.closest("[data-dp]")) { scn.paused = true; scnClear(); return; } // open the source sheet; stop auto-advance
  if (t.closest("[data-scn-close]")) { closeScenario(); return; }
  if (t.closest("[data-scn-next]")) { scnGo(scn.beat + 1); return; }
  const tab = t.closest("[data-scn-tab]");
  if (tab) { scn.tab = tab.dataset.scnTab; scn.paused = true; scnClear(); scnPaint(false); return; }
  const view = t.closest("[data-scn-view]");
  if (view) { scn.view = view.dataset.scnView; scn.paused = true; scnClear(); scnPaint(false); return; }
  if (t.closest("[data-scn-approve]")) {
    scn.approved = true; scnPaint(false);
    setTimeout(() => { if (scn.open && scn.beat === 2) scnGo(3); }, REDUCED_MOTION() ? 300 : 900);
    return;
  }
  if (t.closest("[data-scn-edit]")) { toast("In the full product, you'd tweak copy and price here"); return; }
  if (t.closest("[data-scn-fix]")) { state.fixes.fx_reorder20 = "applied"; scnPaint(false); toast("Added to your tasks"); return; }
  if (t.closest("[data-scn-fix-skip]")) { state.fixes.fx_reorder20 = "dismissed"; scnPaint(false); return; }
  if (t.closest("[data-scn-fix-undo]")) { delete state.fixes.fx_reorder20; scnPaint(false); return; }
});
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && scn.open && popEl.hidden) closeScenario(); }, true); // capture: runs before the sheet's own Escape handler
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-scenario]");
  if (o) { e.preventDefault(); openScenario(o); }
});

/* ---------- Always start on the welcome splash (fresh load, reload, short link, back-forward cache, Restart) ---------- */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
history.replaceState({ step: 0, group: null }, "");
function showSplash() {
  const splash = document.getElementById("splash");
  if (!splash) return;
  clearTimeout(showSplash._t);
  document.getElementById("splash-name").textContent = BUSINESS_CONFIG.ownerFirstName;
  document.getElementById("splash-biz").textContent = BUSINESS_CONFIG.name;
  splash.hidden = false;
  splash.classList.remove("gone");
  document.body.classList.add("splash-open");
  window.scrollTo(0, 0);
}
document.getElementById("splash-start")?.addEventListener("click", () => {
  const splash = document.getElementById("splash");
  splash.classList.add("gone");
  document.body.classList.remove("splash-open");
  showSplash._t = setTimeout(() => { splash.hidden = true; }, 350);
});
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  closePop();
  launchOverlay.hidden = true;
  if (scn.open) { scnClear(); scn.open = false; scnEl.hidden = true; document.body.classList.remove("scn-open"); }
  freshState();
  history.replaceState({ step: 0, group: null }, "");
  state.step = 0;
  render();
  showSplash();
});
showSplash();
render();
