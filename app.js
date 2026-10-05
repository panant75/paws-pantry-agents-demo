/* =========================================================
   Neighborhood Agents — interactive sales demo
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

const STEP_LABELS = ["Welcome", "Pains", "Agents", "Setup", "Dashboard", "Summary"];

/* Two-level, MECE pain structure. Hours/$ per sub-point are ILLUSTRATIVE weekly weights. */
const PAIN_GROUPS = [
  {
    id: "acquire", short: "New customers", title: "I can't get enough new customers.", icon: "🧲", color: "#EDE9FE",
    subs: [
      { id: "acq_find", title: "I have no steady way to find and win new customers.", short: "No steady way to win new customers", hours: 3, dollars: 450, agents: ["growth"] },
      { id: "acq_budget", title: "I don't know how to split my ads and social budget, or whether it's working.", short: "Unclear ad & social budget results", hours: 2, dollars: 300, agents: ["growth"] },
      { id: "acq_time", title: "I don't have time to market consistently.", short: "No time to market consistently", hours: 4, dollars: 250, agents: ["growth"] },
    ],
    connectors: [{ id: "gads" }, { id: "meta" }, { id: "tiktok" }, { id: "gbp" }, { id: "klaviyo", label: "Klaviyo or Mailchimp" }],
  },
  {
    id: "retain", short: "Losing customers", title: "I lose customers I already have.", icon: "🔁", color: "#FCE8E2",
    subs: [
      { id: "ret_slow", title: "I'm slow to reply to questions and complaints.", short: "Slow replies to questions & complaints", hours: 6, dollars: 280, agents: ["pal"] },
      { id: "ret_drop", title: "Subscribers and regulars quietly drop off.", short: "Subscribers & regulars dropping off", hours: 3, dollars: 650, agents: ["orders"] },
    ],
    connectors: [{ id: "gmail" }, { id: "sms" }, { id: "igdm" }, { id: "recharge" }, { id: "klaviyo", label: "Klaviyo" }],
  },
  {
    id: "ops", short: "Operations", title: "Day-to-day operations are chaos.", icon: "📦", color: "#FEF3C7",
    subs: [
      { id: "ops_stock", title: "I run out of best sellers or get stuck with stock that expires.", short: "Stockouts & expiring stock", hours: 4, dollars: 420, agents: ["pantry"] },
      { id: "ops_ship", title: "Packing and delivery keep going wrong.", short: "Packing & delivery mistakes", hours: 5, dollars: 360, agents: ["ship"] },
    ],
    connectors: [{ id: "shopify", label: "Shopify or WooCommerce" }, { id: "square", label: "Square POS" }, { id: "supplier" }, { id: "shipstation" }],
  },
  {
    id: "numbers", short: "Numbers", title: "I don't really know my numbers.", icon: "📊", color: "#DCFCE7",
    subs: [
      { id: "num_margin", title: "I don't know my margins or where the money goes.", short: "Unclear margins & money flow", hours: 3, dollars: 480, agents: ["cash"] },
      { id: "num_data", title: "My data is spread across apps, so I never see the whole picture.", short: "Data scattered across apps", hours: 2, dollars: 150, agents: ["cash"] },
    ],
    connectors: [{ id: "quickbooks" }, { id: "stripe" }, { id: "square", label: "Square" }, { id: "shopify", label: "Shopify" }, { id: "sheets" }],
  },
  {
    id: "stretched", short: "Stretched thin", title: "I'm stretched too thin to run it all.", icon: "⏳", color: "#CCFBF1",
    subs: [
      { id: "str_tools", title: "My tools don't talk to each other, and setting up new ones takes forever.", short: "Tools don't connect; setup is slow", hours: 3, dollars: 120, agents: ["captain"] },
      { id: "str_decide", title: "I can't keep up with every decision.", short: "Can't keep up with every decision", hours: 4, dollars: 200, agents: ["captain"] },
      { id: "str_trust", title: "I don't trust automation, so I check everything myself.", short: "Checking every automation myself", hours: 3, dollars: 100, agents: ["captain"] },
    ],
    connectors: [{ id: "approvals" }, { id: "gcal" }, { id: "gmail" }],
  },
];
const ALL_SUBS = PAIN_GROUPS.flatMap((g) => g.subs.map((s) => ({ ...s, group: g.id })));
const AGENT_HOME_GROUP = { growth: "acquire", pal: "retain", orders: "retain", pantry: "ops", ship: "ops", cash: "numbers", captain: "stretched" };

const CONNECTORS = {
  gads: { name: "Google Ads", desc: "Search ad spend & results", initials: "GA", color: "#4285F4" },
  meta: { name: "Meta (Facebook & Instagram)", desc: "Ads, posts & audiences", initials: "Me", color: "#0866FF" },
  tiktok: { name: "TikTok", desc: "Short videos & ads", initials: "Tk", color: "#111111" },
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

function defaultVoice(agentId) {
  const p = PRESETS.find((x) => x.id === (DEFAULT_VOICE_PRESET[agentId] || "warm"));
  return { preset: p.id, formality: p.formality, emoji: p.emoji, length: "short" };
}
function presetLabel(id) { return (PRESETS.find((p) => p.id === id) || PRESETS[0]).label; }

/* ---------- Data inputs (sample) ---------- */
const DEFAULT_INPUTS = (() => {
  const o = {
    revenueWeek: 8420, revenuePrev: 7945, weekCosts: 6400, marginPrev: 22.8,
    replyMin: 11, replyBeforeMin: 240, savingsRate: 70, protectRate: 55,
    "act.faq": 12, "act.expiry": 4, "act.renewals": 18, "act.deliveries": 7,
    "act.lowMargin": 2, "act.igDrafts": 3, "act.reorder": 3, "act.atRisk": 2,
  };
  ALL_SUBS.forEach((p) => { o[`subHours.${p.id}`] = p.hours; o[`subDollars.${p.id}`] = p.dollars; });
  return o;
})();

/* ---------- State ---------- */
const state = {};
function freshState() {
  Object.assign(state, {
    step: 0,
    business: { name: BUSINESS_CONFIG.name, type: BUSINESS_CONFIG.type, size: BUSINESS_CONFIG.size },
    selectedSubs: [],
    painGroup: null,
    showMore: false,
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
const sevFactor = (s) => 0.6 + 0.2 * s;
const inp = (k) => Number(state.inputs[k]);
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
    formula: "Σ (typical hours/week × severity factor). Severity factor = 0.6 + 0.2 × severity (1–5).",
    inputs: () => state.selectedSubs.map((s) => ({ key: `subHours.${s.id}`, label: `${subById(s.id).short} · typical hrs/week`, unit: "hrs" })),
    breakdown: () => state.selectedSubs.map((s) => {
      const h = inp(`subHours.${s.id}`); const f = sevFactor(s.severity);
      return `${subById(s.id).short}: ${h}h × ${f.toFixed(1)} = ${Math.round(h * f)}h`;
    }),
    compute: () => state.selectedSubs.reduce((a, s) => a + Math.round(inp(`subHours.${s.id}`) * sevFactor(s.severity)), 0),
    updated: "Live · recalculates as you pick",
  },
  dollarsAtStake: {
    label: "$ at stake / week", kind: "money",
    source: "Estimate · the problems you picked × typical weekly $ impact (lost sales, spoilage, churn)",
    formula: "Σ (typical $/week × severity factor). Severity factor = 0.6 + 0.2 × severity (1–5).",
    inputs: () => state.selectedSubs.map((s) => ({ key: `subDollars.${s.id}`, label: `${subById(s.id).short} · typical $/week`, unit: "$" })),
    breakdown: () => state.selectedSubs.map((s) => {
      const d = inp(`subDollars.${s.id}`); const f = sevFactor(s.severity);
      return `${subById(s.id).short}: $${d} × ${f.toFixed(1)} = $${Math.round(d * f)}`;
    }),
    compute: () => state.selectedSubs.reduce((a, s) => a + Math.round(inp(`subDollars.${s.id}`) * sevFactor(s.severity)), 0),
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
  return s.replace(/\{biz\}/g, state.business.name).replace(/\{street\}/g, BUSINESS_CONFIG.street);
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
  let body = fillVars(vd.lines[v.preset]);
  if (v.emoji) body += ` ${vd.emoji}`;
  if (v.length === "detailed") body += ` ${fillVars(vd.detail)}`;
  if (!toName && vd.cta) body += ` ${vd.cta[v.formality]}`;
  parts.push(body);
  if (!toName) {
    if (v.length === "detailed") parts.push(`#${state.business.name.replace(/[^A-Za-z0-9]/g, "")} #ShopLocal${v.emoji ? " 🐾" : ""}`);
  } else if (v.length === "detailed" || v.formality >= 4) {
    parts.push(signoff(v.formality, vd.from === "agent" ? agent.name : state.business.name));
  }
  return parts.join("\n");
}
function voiceSummary(v) {
  return `${presetLabel(v.preset)} · ${FORMALITY_LABELS[v.formality]} · ${v.emoji ? "Emoji on" : "No emoji"} · ${v.length === "short" ? "Short" : "Detailed"}`;
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
const pop = { id: null, mode: "view", anchor: null, error: "" };

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

  return `${head}<dl class="pop-rows">${rows.join("")}</dl><div class="pop-actions">${actions}</div>`;
}

const isSheet = () => window.innerWidth <= 560;
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
  popEl.style.left = `${left}px`;
  popEl.style.top = `${top}px`;
}
function openPop(id, anchor, mode = "view") {
  document.querySelectorAll(".src-chip[aria-expanded='true']").forEach((c) => c.setAttribute("aria-expanded", "false"));
  pop.id = id; pop.anchor = anchor; pop.mode = mode; pop.error = "";
  popEl.innerHTML = popHTML(id);
  popEl.hidden = false;
  popEl.setAttribute("aria-label", `${DP[id].label}: source`);
  if (anchor) anchor.setAttribute("aria-expanded", "true");
  positionPop();
}
function refreshPop() {
  if (popEl.hidden) return;
  popEl.innerHTML = popHTML(pop.id);
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
    else openPop(c.dataset.dp, c);
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
  btnBack.disabled = state.step === 0;
  btnBack.style.visibility = state.step === 0 ? "hidden" : "visible";
  btnBack.textContent = state.step === 1 && state.painGroup ? "All pain points" : "Back";
  const labels = { 3: "Launch my team", 4: "See summary", 5: "Get started" };
  btnNext.textContent = labels[state.step] || "Next";
  btnNext.classList.toggle("btn-launch", state.step === 3);
  let ok = true; let hint = "";
  if (state.step === 0) ok = !!(state.business.name.trim() && state.business.type && state.business.size);
  else if (state.step === 1) {
    const n = state.selectedSubs.length;
    ok = n >= 1;
    hint = n ? `${n} problem${n === 1 ? "" : "s"} picked · tap ⓘ to see the math` : "Tap a pain area to pick what applies";
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
    if (!state.openVoice.size) {
      const first = AGENTS.find((a) => !a.alwaysOn && state.agentsOn[a.id]) || AGENTS[0];
      state.openVoice.add(first.id);
    }
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
  window.scrollTo({ top: 0, behavior: opts.fromHistory ? "auto" : "smooth" });
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
  const y = window.scrollY;
  renderProgress();
  setNav();
  const renderers = [renderWelcome, renderPains, renderAgents, renderSetup, renderDashboard, renderClosing];
  stage.innerHTML = "";
  const screen = document.createElement("div");
  screen.className = opts.keepScroll ? "screen no-anim" : "screen";
  screen.dataset.step = String(state.step);
  screen.innerHTML = renderers[state.step]();
  stage.appendChild(screen);
  bindScreen();
  if (opts.keepScroll) window.scrollTo(0, y);
}

/* ---------- Screens ---------- */
function renderWelcome() {
  const sizes = ["Just me", "1–5 people", "6–20 people", "20+ people"];
  const types = ["Pet food shop", "Cafe / bakery", "Boutique retail", "Home services", "Salon / spa", "Other local business"];
  return `
    <div class="screen-eyebrow">Step 1 · About your shop</div>
    <h1 class="screen-title">Let's find where you're losing time and money</h1>
    <p class="screen-sub">Tell us a little about the business. We'll map the busywork to a small team of helpful agents. No jargon required.</p>
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
        <p>In about two minutes you'll see how ${escapeHtml(state.business.name)} could put an AI crew to work, with you still in charge.</p>
        <div class="aside-list">
          <div class="aside-item"><span class="aside-num">1</span><div><strong>Name the pains</strong>Pick where time and money leak.</div></div>
          <div class="aside-item"><span class="aside-num">2</span><div><strong>Meet your agents</strong>Pick the team and give each one a voice.</div></div>
          <div class="aside-item"><span class="aside-num">3</span><div><strong>Launch & peek</strong>A sample week of wins. Every number shows its source.</div></div>
        </div>
      </aside>
    </div>`;
}

function tallyListHTML() {
  return selectedGroups().map((g) => `<li><span>${g.icon} ${escapeHtml(g.short)}</span><span>${countIn(g)} picked</span></li>`).join("")
    || "<li style='color:var(--muted)'>Nothing picked yet</li>";
}
function tallyHTML() {
  return `
      <aside class="tally-card" id="tally-card">
        <h3>At stake each week</h3>
        <p class="tally-note">Illustrative estimates from the problems you pick. Not a quote or guarantee.</p>
        <div class="tally-metrics">
          <div class="tally-metric">
            <div class="label">Hours lost / week ${chip("hoursLost")}</div>
            <div class="value" id="tally-hours">${Math.round(val("hoursLost"))}</div>
            <div class="unit">illustrative</div>
          </div>
          <div class="tally-metric money">
            <div class="label">$ at stake / week ${chip("dollarsAtStake")}</div>
            <div class="value" id="tally-dollars">${fmt("money", val("dollarsAtStake"))}</div>
            <div class="unit">illustrative</div>
          </div>
        </div>
        <ul class="tally-selected" id="tally-list">${tallyListHTML()}</ul>
      </aside>`;
}

function renderPains() {
  const g = state.painGroup && groupById(state.painGroup);
  return g ? renderPainGroup(g) : renderPainMenu();
}

function renderPainMenu() {
  return `
    <div class="screen-eyebrow">Step 2 · Pain-point discovery</div>
    <h1 class="screen-title">Where does ${escapeHtml(state.business.name)} feel the pinch?</h1>
    <p class="screen-sub">Tap an area to see what's inside. Pick what applies and set how much it hurts. The totals are <strong>illustrative estimates</strong>.</p>
    <div class="pain-layout">
      <div class="group-list" id="group-list">
        ${PAIN_GROUPS.map((g) => {
          const n = countIn(g);
          return `
          <button type="button" class="group-card ${n ? "selected" : ""}" data-group="${g.id}" aria-label="${escapeHtml(g.title)}${n ? ` (${n} selected)` : ""}">
            <span class="group-icon" style="background:${g.color}">${g.icon}${n ? `<span class="group-check" aria-hidden="true">✓</span>` : ""}</span>
            <span class="group-text">
              <span class="group-title">${escapeHtml(g.title)}</span>
              <span class="group-meta">${g.subs.length} problems inside${n ? "" : " · tap to pick"}</span>
            </span>
            ${n ? `<span class="group-badge">${n} selected</span>` : ""}
            <span class="group-chev" aria-hidden="true">›</span>
          </button>`;
        }).join("")}
      </div>
      ${tallyHTML()}
    </div>`;
}

function renderPainGroup(g) {
  const agents = [...new Set(g.subs.flatMap((s) => s.agents))].map(agentById);
  return `
    <div class="sub-top">
      <button type="button" class="btn btn-soft btn-sm back-menu" data-back-menu>← Back to all pain points</button>
      <nav class="crumbs" aria-label="Breadcrumb">
        <button type="button" class="crumb-link" data-back-menu>All pain points</button>
        <span class="crumb-sep" aria-hidden="true">›</span>
        <span aria-current="page">${escapeHtml(g.short)}</span>
      </nav>
    </div>
    <h1 class="screen-title group-heading"><span class="group-icon sm" style="background:${g.color}" aria-hidden="true">${g.icon}</span><span>${escapeHtml(g.title)}</span></h1>
    <p class="screen-sub">Pick what applies and set how much it hurts. Tap “Back to all pain points” (or swipe right on a phone) when you’re done.</p>
    <div class="pain-layout">
      <div class="sub-col">
        <div class="sub-list" id="sub-list">
          ${g.subs.map((s) => {
            const sel = subSel(s.id);
            return `
            <div class="sub-item ${sel ? "selected" : ""}" data-sub="${s.id}">
              <button type="button" class="sub-toggle" role="checkbox" aria-checked="${!!sel}" data-sub-toggle="${s.id}">
                <span class="sub-box" aria-hidden="true">${sel ? "✓" : ""}</span>
                <span class="sub-title">${escapeHtml(s.title)}</span>
              </button>
              ${sel ? `
              <div class="severity sub-sev">
                <label for="sev-${s.id}">How much it hurts</label>
                <input id="sev-${s.id}" type="range" min="1" max="5" value="${sel.severity}" data-sev="${s.id}" />
                <span class="severity-val">${sel.severity}/5</span>
              </div>` : ""}
            </div>`;
          }).join("")}
        </div>
        <section class="connectors-box" aria-label="Suggested connectors">
          <h3>Suggested connectors</h3>
          <p class="hint">What your agents would plug into for this. You'll connect them (mock) in Step 4.</p>
          <div class="conn-chips">
            ${g.connectors.map((c) => {
              const k = CONNECTORS[c.id];
              return `<span class="conn-chip"><span class="conn-logo" style="background:${k.color}">${k.initials}</span>${escapeHtml(c.label || k.name)}</span>`;
            }).join("")}
          </div>
          <p class="conn-agents">Agents for this: ${agents.map((a) => `${a.icon} ${escapeHtml(a.name)}`).join(" · ")}</p>
        </section>
        <button type="button" class="btn btn-primary back-menu-bottom" data-back-menu>← Back to all pain points</button>
      </div>
      ${tallyHTML()}
    </div>`;
}

function voicePanelHTML(a) {
  const v = state.voices[a.id];
  const vd = VOICE_LINES[a.id];
  const open = state.openVoice.has(a.id);
  return `
    <div class="voice-bar">
      <div class="voice-bar-text"><span class="voice-label">Voice</span><span class="voice-current" data-voice-current="${a.id}">${escapeHtml(voiceSummary(v))}</span></div>
      <button type="button" class="voice-btn" data-voice-toggle="${a.id}" aria-expanded="${open}">${open ? "Done" : "Customize"}</button>
    </div>
    <div class="voice-panel" data-voice-panel="${a.id}" ${open ? "" : "hidden"}>
      <div class="vp-label">Preset voice</div>
      <div class="preset-row" role="radiogroup" aria-label="Preset voice for ${escapeHtml(a.name)}">
        ${PRESETS.map((p) => `<button type="button" class="preset ${v.preset === p.id ? "selected" : ""}" role="radio" aria-checked="${v.preset === p.id}" data-preset="${p.id}" data-vagent="${a.id}">${escapeHtml(p.label)}</button>`).join("")}
      </div>
      <div class="vp-grid">
        <div class="vp-field vp-formality">
          <div class="vp-label">Formality <span class="vp-val" data-formality-label="${a.id}">${FORMALITY_LABELS[v.formality]}</span></div>
          <input type="range" min="1" max="5" step="1" value="${v.formality}" data-formality="${a.id}" aria-label="Formality for ${escapeHtml(a.name)}" />
          <div class="range-ends"><span>Casual</span><span>Formal</span></div>
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
      </div>
      <div class="preview">
        <div class="preview-head"><span>Sample: ${escapeHtml(vd.context)}</span><span class="preview-tag">Live preview</span></div>
        <div class="bubble" data-preview="${a.id}" aria-live="polite">${escapeHtml(voiceMessage(a.id))}</div>
      </div>
      <button type="button" class="btn btn-sm btn-ghost apply-all" data-apply-all="${a.id}">Apply this voice to all agents</button>
    </div>`;
}

function agentCardHTML(a, rec) {
  const on = !!state.agentsOn[a.id];
  const isRec = rec.has(a.id);
  const painLabel = selectedGroups()
    .filter((g) => g.subs.some((s) => subSel(s.id) && s.agents.includes(a.id)))
    .map((g) => g.short).join(" · ") || (a.alwaysOn ? "Coordinates the whole team" : "Optional add-on");
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
      <ul class="agent-tasks">${a.tasks.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      ${voicePanelHTML(a)}
    </div>`;
}

function renderAgents() {
  const rec = recommendedAgents();
  return `
    <div class="screen-eyebrow">Step 3 · Recommended agent team</div>
    <h1 class="screen-title">Meet the crew for ${escapeHtml(state.business.name)}</h1>
    <p class="screen-sub">Based on the problems you picked (${escapeHtml(selectedGroups().map((g) => g.short).join(", ") || "none yet")}), we pre-selected a lean team. Toggle anyone on or off (Store Captain stays on to coordinate), and give each agent its own voice.</p>
    <div class="agent-grid" id="agent-grid">${AGENTS.map((a) => agentCardHTML(a, rec)).join("")}</div>`;
}

function toolRowHTML(id, note) {
  const k = CONNECTORS[id];
  const on = !!state.tools[id];
  return `
              <div class="tool-row ${on ? "connected" : ""}" data-tool="${id}">
                <div class="tool-icon" style="background:${k.color}">${k.initials}</div>
                <div class="tool-info"><strong>${escapeHtml(k.name)}</strong><span>${escapeHtml(note || k.desc)}</span></div>
                <span class="tool-status">${on ? "Connected" : "Not connected"}</span>
                <button type="button" class="btn btn-sm ${on ? "btn-ghost" : "btn-soft"}" data-tool-btn="${id}" aria-label="${on ? "Disconnect" : "Connect"} ${escapeHtml(k.name)}">${on ? "Disconnect" : "Connect"}</button>
              </div>`;
}
function connectorsHTML() {
  const groups = selectedGroups();
  const shown = new Set();
  const sections = groups.map((g) => {
    const rows = g.connectors.map((c) => {
      if (shown.has(c.id)) {
        return "";
      }
      shown.add(c.id);
      const also = groups.filter((o) => o.id !== g.id && o.connectors.some((x) => x.id === c.id)).map((o) => o.short);
      return toolRowHTML(c.id, also.length ? `${CONNECTORS[c.id].desc} · also for ${also.join(", ")}` : "");
    }).join("");
    if (!rows) return "";
    return `
          <div class="conn-group" data-conn-group="${g.id}">
            <h4 class="conn-group-head"><span class="group-icon xs" style="background:${g.color}" aria-hidden="true">${g.icon}</span>For “${escapeHtml(g.short)}”</h4>
            <div class="tool-list">${rows}</div>
          </div>`;
  }).join("");
  const rest = Object.keys(CONNECTORS).filter((id) => !shown.has(id));
  return `
        ${sections || `<p class="hint">No pain areas picked yet. Every connector is listed below.</p>`}
        ${rest.length ? `
        <div class="more-conn">
          <button type="button" class="btn btn-ghost btn-sm more-toggle" data-more-toggle aria-expanded="${!!state.showMore || !sections}">${state.showMore || !sections ? "Hide" : "Show"} more connectors (${rest.length})</button>
          ${state.showMore || !sections ? `<div class="conn-group" data-conn-group="more"><h4 class="conn-group-head">More connectors</h4><div class="tool-list">${rest.map((id) => toolRowHTML(id)).join("")}</div></div>` : ""}
        </div>` : ""}`;
}

function renderSetup() {
  const active = activeAgents();
  return `
    <div class="screen-eyebrow">Step 4 · One-click setup</div>
    <h1 class="screen-title">Connect tools & set the ground rules</h1>
    <p class="screen-sub">Mock toggles only. This demo never connects to real accounts. Check each agent's voice and choose when they ask permission.</p>
    <div class="setup-grid">
      <section class="setup-section">
        <h3>Connect the tools you already use</h3>
        <p class="hint">Only what your picked pains need, grouped by pain. Illustrative connections for the demo walkthrough.</p>
        <div id="connectors">${connectorsHTML()}</div>
      </section>

      <section class="setup-section" id="voice-summary">
        <h3>Voices at a glance</h3>
        <p class="hint">Each agent writes as ${escapeHtml(state.business.name)} in its own voice. Fine-tune on the Agents step, or set one voice for everyone.</p>
        <div class="vs-list">
          ${active.map((a) => `
            <div class="vs-row">
              <div class="mini-avatar" style="background:${a.color}">${a.icon}</div>
              <div class="vs-text"><strong>${escapeHtml(a.name)}</strong><span>${escapeHtml(voiceSummary(state.voices[a.id]))}</span></div>
            </div>`).join("")}
        </div>
        <div class="vp-label" style="margin-top:14px">Apply to all agents</div>
        <div class="preset-row" id="all-presets">
          ${PRESETS.map((p) => {
            const all = active.every((a) => state.voices[a.id].preset === p.id);
            return `<button type="button" class="preset ${all ? "selected" : ""}" data-all-preset="${p.id}">${escapeHtml(p.label)}</button>`;
          }).join("")}
        </div>
        <button type="button" class="btn btn-sm btn-ghost" data-goto="2" style="margin-top:12px">Fine-tune each agent's voice</button>
      </section>

      <section class="setup-section">
        <h3>Approval preference</h3>
        <p class="hint">Default is safest: ask before anything goes out.</p>
        <div class="approval-options" id="approval-options">
          ${APPROVALS.map((a) => `
            <button type="button" class="option-card ${state.approval === a.id ? "selected" : ""}" data-approval="${a.id}">
              <strong>${escapeHtml(a.title)}</strong><span>${escapeHtml(a.sample)}</span>
            </button>`).join("")}
        </div>
      </section>
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
  return `
    <div class="dash-header">
      <div>
        <div class="screen-eyebrow">Step 5 · Day-one dashboard</div>
        <h1 class="screen-title">This week at ${escapeHtml(state.business.name)}</h1>
        <p class="screen-sub" style="margin-bottom:0">A sample look at what your agents already handled, and what still needs your OK.${selectedGroups().length ? ` Working on: <strong>${escapeHtml(selectedGroups().map((g) => g.short).join(" · "))}</strong>.` : ""}</p>
      </div>
      <span class="sample-pill">⚑ Sample data · tap ⓘ for sources</span>
    </div>

    <div class="kpi-row">
      <div class="kpi">
        <div class="label">Revenue (week) ${chip("revenue")}</div>
        <div class="value" data-kpi="revenue">${fmt("money", rev)}</div>
        <div class="delta ${revDelta < 0 ? "neg" : ""}">${arrow(revDelta)} ${Math.abs(revDelta)}% vs last week</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Profit margin ${chip("margin")}</div>
        <div class="value" data-kpi="margin">${fmt("pct", val("margin"))}</div>
        <div class="delta ${mDelta < 0 ? "neg" : ""}">${arrow(mDelta)} ${Math.abs(mDelta).toFixed(1)} pts</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Customer reply time ${chip("replyTime")}</div>
        <div class="value" data-kpi="replyTime">${fmt("minutes", val("replyTime"))}</div>
        <div class="delta">↓ from ${fmtDuration(inp("replyBeforeMin"))}</div>
        <div class="sample">Sample data</div>
      </div>
      <div class="kpi">
        <div class="label">Hours saved ${chip("hoursSaved")}</div>
        <div class="value" data-kpi="hoursSaved">${fmt("hours", val("hoursSaved"))}</div>
        <div class="delta">~${fmt("money", val("dollarsProtected"))} protected ${chip("dollarsProtected")}</div>
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
            const agent = agentById(item.agentId);
            const resolved = state.approvalsResolved[item.id];
            const v = state.voices[item.agentId];
            return `
              <div class="approval-item ${resolved ? "done" : ""} ${resolved === "edited" ? "edited" : ""}" data-approval-id="${item.id}">
                <div class="approval-top">
                  <div class="mini-avatar" style="background:${agent.color}">${agent.icon}</div>
                  <div class="approval-body">
                    <strong>${escapeHtml(agent.name)} · ${escapeHtml(item.title)}${item.dp ? chip(item.dp) : ""}</strong>
                    ${forTag(item.agentId)}<p>${escapeHtml(item.body)}</p>
                    <div class="draft">
                      <div class="draft-head"><span>Draft · ${escapeHtml(VOICE_LINES[item.agentId].context)}</span><span class="voice-tag">${escapeHtml(presetLabel(v.preset))} voice</span></div>
                      <div class="draft-text">${escapeHtml(voiceMessage(item.agentId))}</div>
                    </div>
                  </div>
                </div>
                <div class="approval-actions">
                  <button type="button" class="btn btn-sm btn-approve" data-approve="${item.id}">Approve</button>
                  <button type="button" class="btn btn-sm btn-edit" data-edit="${item.id}">Edit</button>
                </div>
                <div class="approval-status">${resolved === "edited" ? "Edited & saved. The agent will revise." : "Approved. The agent will go ahead."}</div>
              </div>`;
          }).join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><h3>Agent activity</h3><span class="count">This week</span></div>
        <div>
          ${feed.map((f) => {
            const agent = agentById(f.agentId);
            return `
              <div class="feed-item">
                <div class="mini-avatar" style="background:${agent.color}">${agent.icon}</div>
                <div class="feed-body">
                  <strong>${escapeHtml(agent.name)}</strong>
                  <p>${escapeHtml(f.text)}${f.dp ? chip(f.dp) : ""}</p>
                  ${forTag(f.agentId)}
                  ${f.voice ? `<span class="voice-tag">${escapeHtml(presetLabel(state.voices[f.agentId].preset))} voice</span>` : ""}
                </div>
                <div class="feed-time">${f.time}</div>
              </div>`;
          }).join("")}
        </div>
      </section>
    </div>`;
}

function renderClosing() {
  const pains = selectedGroups();
  const agents = activeAgents();
  return `
    <div class="close-wrap">
      <div class="screen-eyebrow" style="justify-content:center">Step 6 · Wrap-up</div>
      <h1 class="screen-title" style="text-align:center">From busywork to a quiet crew</h1>
      <p class="screen-sub" style="margin-left:auto;margin-right:auto;text-align:center">Here's the story you just walked through for ${escapeHtml(state.business.name)}.</p>
      <div class="close-card">
        <div class="summary-path">
          <div class="summary-box">
            <h4>Pain areas</h4>
            <ul>${pains.map((g) => `<li>${g.icon} ${escapeHtml(g.short)} <span class="voice-tag">${countIn(g)} picked</span></li>`).join("") || "<li>None selected</li>"}</ul>
          </div>
          <div class="summary-arrow" aria-hidden="true">→</div>
          <div class="summary-box">
            <h4>Agents</h4>
            <ul>${agents.slice(0, 5).map((a) => `<li>${a.icon} ${escapeHtml(a.name)} <span class="voice-tag">${escapeHtml(presetLabel(state.voices[a.id].preset))}</span></li>`).join("")}</ul>
          </div>
          <div class="summary-arrow" aria-hidden="true">→</div>
          <div class="summary-box">
            <h4>Impact</h4>
            <ul>
              <li>~${Math.round(val("hoursSaved"))} hrs/week back ${chip("hoursSaved")}</li>
              <li>~${fmt("money", val("dollarsProtected"))}/week protected ${chip("dollarsProtected")}</li>
              <li>You stay in the loop</li>
            </ul>
          </div>
        </div>
        <div class="impact-row">
          <div class="impact-tile"><div class="n">${val("sel_pains") || "—"} ${chip("sel_pains")}</div><div class="l">Problems picked</div></div>
          <div class="impact-tile"><div class="n">${agents.length} ${chip("sel_agents")}</div><div class="l">Agents on team</div></div>
          <div class="impact-tile"><div class="n">${val("sel_tools")} ${chip("sel_tools")}</div><div class="l">Tools connected</div></div>
        </div>
        <p style="font-size:13px;color:var(--muted);text-align:center;margin-bottom:18px">Impact figures are illustrative estimates from this demo, not a performance guarantee.</p>
        <div class="close-actions">
          <button type="button" class="btn btn-primary btn-launch" id="cta-start">Get started</button>
          <button type="button" class="btn btn-ghost" id="cta-restart">Restart demo</button>
        </div>
      </div>
      <p class="close-note">Neighborhood Agents · sales demo for small businesses</p>
    </div>`;
}

/* ---------- Bindings ---------- */
function replaceAgentCard(id) {
  const el = document.querySelector(`.agent-card[data-agent="${id}"]`);
  if (el) el.outerHTML = agentCardHTML(agentById(id), recommendedAgents());
}
function setVoice(id, patch) { Object.assign(state.voices[id], patch); }

function bindScreen() {
  if (state.step === 0) {
    document.getElementById("biz-name")?.addEventListener("input", (e) => { state.business.name = e.target.value; setNav(); });
    document.getElementById("type-chips")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-type]"); if (!b) return; state.business.type = b.dataset.type; render({ keepScroll: true });
    });
    document.getElementById("size-chips")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-size]"); if (!b) return; state.business.size = b.dataset.size; render({ keepScroll: true });
    });
  }

  if (state.step === 1) {
    document.getElementById("group-list")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-group]"); if (b) openGroup(b.dataset.group);
    });
    stage.querySelectorAll("[data-back-menu]").forEach((b) => b.addEventListener("click", backToMenu));
    const list = document.getElementById("sub-list");
    list?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-sub-toggle]"); if (!b) return;
      const id = b.dataset.subToggle;
      const idx = state.selectedSubs.findIndex((s) => s.id === id);
      if (idx >= 0) state.selectedSubs.splice(idx, 1); else state.selectedSubs.push({ id, severity: 3 });
      state._agentsTouched = false;
      AGENTS.forEach((a) => { if (!a.alwaysOn) delete state.agentsOn[a.id]; });
      render({ keepScroll: true });
    });
    list?.addEventListener("input", (e) => {
      const input = e.target.closest("[data-sev]"); if (!input) return;
      const sel = subSel(input.dataset.sev); if (!sel) return;
      sel.severity = Number(input.value);
      input.parentElement.querySelector(".severity-val").textContent = `${sel.severity}/5`;
      updateTallyLive();
    });
  }

  if (state.step === 2) {
    const grid = document.getElementById("agent-grid");
    grid?.addEventListener("click", (e) => {
      const t = e.target;
      const toggle = t.closest("[data-toggle]");
      if (toggle) { if (toggle.disabled) return; state.agentsOn[toggle.dataset.toggle] = !state.agentsOn[toggle.dataset.toggle]; state._agentsTouched = true; render({ keepScroll: true }); return; }
      const vt = t.closest("[data-voice-toggle]");
      if (vt) {
        const id = vt.dataset.voiceToggle;
        if (state.openVoice.has(id)) state.openVoice.delete(id); else state.openVoice.add(id);
        replaceAgentCard(id); return;
      }
      const pr = t.closest("[data-preset]");
      if (pr) {
        const p = PRESETS.find((x) => x.id === pr.dataset.preset);
        setVoice(pr.dataset.vagent, { preset: p.id, formality: p.formality, emoji: p.emoji });
        replaceAgentCard(pr.dataset.vagent); return;
      }
      const em = t.closest("[data-emoji]");
      if (em) { const id = em.dataset.emoji; setVoice(id, { emoji: !state.voices[id].emoji }); replaceAgentCard(id); return; }
      const ln = t.closest("[data-length]");
      if (ln) { setVoice(ln.dataset.vagent, { length: ln.dataset.length }); replaceAgentCard(ln.dataset.vagent); return; }
      const all = t.closest("[data-apply-all]");
      if (all) {
        const src = state.voices[all.dataset.applyAll];
        AGENTS.forEach((a) => { state.voices[a.id] = { ...src }; });
        render({ keepScroll: true });
        toast(`"${presetLabel(src.preset)}" voice applied to all ${AGENTS.length} agents`);
      }
    });
    grid?.addEventListener("input", (e) => {
      const r = e.target.closest("[data-formality]"); if (!r) return;
      const id = r.dataset.formality;
      setVoice(id, { formality: Number(r.value) });
      document.querySelector(`[data-formality-label="${id}"]`).textContent = FORMALITY_LABELS[state.voices[id].formality];
      document.querySelector(`[data-preview="${id}"]`).textContent = voiceMessage(id);
      document.querySelector(`[data-voice-current="${id}"]`).textContent = voiceSummary(state.voices[id]);
    });
  }

  if (state.step === 3) {
    document.getElementById("connectors")?.addEventListener("click", (e) => {
      if (e.target.closest("[data-more-toggle]")) { state.showMore = !state.showMore; render({ keepScroll: true }); return; }
      const b = e.target.closest("[data-tool-btn]"); if (!b) return; state.tools[b.dataset.toolBtn] = !state.tools[b.dataset.toolBtn]; render({ keepScroll: true });
    });
    document.getElementById("voice-summary")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-all-preset]");
      if (b) {
        const p = PRESETS.find((x) => x.id === b.dataset.allPreset);
        AGENTS.forEach((a) => { state.voices[a.id] = { ...state.voices[a.id], preset: p.id, formality: p.formality, emoji: p.emoji }; });
        render({ keepScroll: true });
        toast(`"${p.label}" voice applied to all agents`);
        return;
      }
      const g = e.target.closest("[data-goto]"); if (g) go(Number(g.dataset.goto));
    });
    document.getElementById("approval-options")?.addEventListener("click", (e) => {
      const b = e.target.closest("[data-approval]"); if (!b) return; state.approval = b.dataset.approval; render({ keepScroll: true });
    });
  }

  if (state.step === 4) {
    document.getElementById("approval-list")?.addEventListener("click", (e) => {
      const approve = e.target.closest("[data-approve]");
      const edit = e.target.closest("[data-edit]");
      if (approve) { state.approvalsResolved[approve.dataset.approve] = "approved"; render({ keepScroll: true }); toast("Approved. The agent will go ahead."); }
      else if (edit) { state.approvalsResolved[edit.dataset.edit] = "edited"; render({ keepScroll: true }); toast("Marked for edit. The agent will revise."); }
    });
  }

  if (state.step === 5) {
    document.getElementById("cta-start")?.addEventListener("click", () => toast("In a real pitch, this opens signup. Nice work!"));
    document.getElementById("cta-restart")?.addEventListener("click", restartDemo);
  }
}

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
}

/* ---------- Launch sequence ---------- */
function runLaunchSequence() {
  return new Promise((resolve) => {
    const agents = activeAgents();
    launchOverlay.hidden = false;
    const list = document.getElementById("launch-list");
    const bar = document.getElementById("launch-bar-fill");
    list.innerHTML = agents.map((a) => `<li data-launch="${a.id}"><span class="dot"></span>${a.icon} ${escapeHtml(a.name)} · standing by</li>`).join("");
    bar.style.width = "0%";
    const stepMs = 5200 / (agents.length + 1);
    let i = 0;
    const tick = () => {
      if (i < agents.length) {
        const a = agents[i];
        const li = list.querySelector(`[data-launch="${a.id}"]`);
        if (li) { li.classList.add("online"); li.innerHTML = `<span class="dot"></span>${a.icon} ${escapeHtml(a.name)} · online, ${escapeHtml(presetLabel(state.voices[a.id].preset).toLowerCase())} voice`; }
        bar.style.width = `${Math.round(((i + 1) / agents.length) * 100)}%`;
        i += 1;
        setTimeout(tick, stepMs);
      } else {
        bar.style.width = "100%";
        setTimeout(() => { launchOverlay.hidden = true; resolve(); }, 450);
      }
    };
    setTimeout(tick, 400);
  });
}

/* ---------- Nav events ---------- */
btnBack.addEventListener("click", () => { if (state.step === 1 && state.painGroup) { backToMenu(); return; } if (state.step > 0) go(state.step - 1); });
btnNext.addEventListener("click", async () => {
  if (btnNext.disabled) return;
  if (state.step === 3) { btnNext.disabled = true; closePop(); launching = true; await runLaunchSequence(); launching = false; go(4); return; }
  if (state.step === 5) { toast("In a real pitch, this opens signup. Nice work!"); return; }
  go(state.step + 1);
});

history.replaceState({ step: 0, group: null }, "");
render();
