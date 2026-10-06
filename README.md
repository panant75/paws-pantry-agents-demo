# Gemini agent team for Paws & Pantry — SMB sales demo

Static clickable prototype for demoing AI agents to small business owners.

**Example business:** Paws & Pantry (pet-food shop). Change `BUSINESS_CONFIG` at the top of `app.js` to re-theme name, type, size, and owner.

## Run locally

```bash
cd smb-agent-demo
python3 -m http.server 8877
# open http://localhost:8877
```

No backend. Optional Google Fonts at runtime (falls back to system UI fonts offline).

## Activity insight sheets (v6)
Tapping ⓘ on an activity row or approval now opens a sheet that answers *what happened, why, and what to do about it* (all sample/illustrative, labeled once per sheet):
- **What happened:** a short list you tap to expand, one item open at a time.
  - Customer questions are grouped by theme; the counts always add up to the metric, even after you edit it. Expanding a theme shows 1–2 conversation snippets (Gmail/IG/SMS badge, name, time), with the reply written in Customer Pal's chosen voice.
  - Subscriptions list named subscribers with the reason and what Order Desk did.
  - Inventory lists SKUs with days to expiry or stock left, the cause, and the action taken.
  - Renewals, routes, margin items and Instagram drafts work the same way.
- **Why it keeps happening:** a one-line root cause that uses the live count.
- **Suggested fix:** 1–3 prevention actions, each showing the owning agent(s) and an illustrative impact. *Apply* marks the fix applied ("Store Captain will set this up"), tags the activity/approval row "✓ Fix applied" and adds a task on Home. *Not now* skips it, and *Undo* reverts either one.
- **How this is measured:** the original source, formula and Edit/Reset, collapsed into one row.
- KPI tiles (revenue, margin, hours saved) add a short "What drove this" list.

## Calm pass (v5)
Every screen carries one idea and one primary action. Secondary detail is one tap away.
- **Step 1:** name input; business type/size collapsed into a one-line "Pet food shop · 1–5 people · Change".
- **Pains:** 5 plain cards plus a slim "At stake each week" tally (ⓘ opens the math). Sub-screens: breadcrumb, items, "Select all".
- **Agents:** compact cards (name, role, toggle, voice chip). "Details", voice editing and extra agents ("Show more agents") open on tap.
- **Connect:** top 3 connectors per picked area; the rest sit behind "Show more connectors". Voices are tappable rows; approvals collapse to one row.
- **Dashboard:** 3 KPIs ("More metrics" adds the 4th), 2 approvals ("Show N more"), each with "View draft", plus 3 activity items.
- **Home:** greeting, prompt and 4 tasks ("Show all"). The setup summary is behind "Your setup".

### Voices: blend up to 3
- Chips are multi-select (max 3). The first pick is the base line; the others add their touch (Warm "That's on us!", Neighborly "See you around Elm St!", Playful "Tails up!", Professional swaps "!" for ".", Concise trims to one sentence, Premium adds a courtesy line). Formality averages across picks.
- Conflict map: Professional ↔ Playful, Playful ↔ Premium, Premium ↔ Concise. A conflicting chip is dimmed and tapping it says "Can't combine with …".
- The combined label ("Warm + Neighborly") shows on the agent card, on the Step 4 row and on dashboard drafts.
- **Step 4 inline edit:** tap an agent row to expand its chips and a sample line. A chip change applies only to that agent, and one row is open at a time. "Use one voice for everyone" is a secondary, collapsed option. Extra bottom padding keeps the last line clear of the footer.

### Grounded in real patterns (Mobbin)
- Once / LinkedIn onboarding: one question per screen, big title, one primary action.
- Mindtrip "Communication style": a one-line meaning for each voice (shown under the chips).
- X "All topics" and Perplexity interests: "+" on addable chips, ✓ on picked chips.
- Givingli "Let us help": tone chips that rewrite the sample live; the sample has a left accent bar.
- Box Box Club / Copilot settings: grouped list with hairline dividers for the per-agent voice rows.
- Claude "Connectors", Fresha, Noom: connector rows grouped per area (logo, name, one line, Connect/✓).
- Hulu interests: a sticky counter on the primary action ("Show my team (N)").
- Cash App / Perplexity AI home: a prompt plus two quiet suggestion pills, then a short task list.

### Motion system
Tokens: `--dur-fast 120ms` (press/hover), `--dur 200ms` (reveals, state), `--dur-slow 260ms` (screen enter), ease-out `cubic-bezier(.2,0,0,1)` to enter, ease-in to exit.
Screens fade and rise 8px. Only the block you just opened animates (others are marked `.static`, so there is no re-animation on re-render). Press feedback is `scale(.98)`, with focus-visible rings. Glows are static. Staggering happens only on the "Learning how you work" screen. `prefers-reduced-motion` turns animations and smooth scrolling off.

## Look & feel (v4)

Gemini-branded dark theme: near-black canvas with soft blurred blue/indigo/purple glows and subtle grain, large light centered headlines (Google Sans → DM Sans fallback), muted gray subtitles, dark 16px cards, deep-blue pill primary buttons, plain-text secondary buttons. The Gemini sparkle is an inline SVG (`#sparkle` symbol in `index.html`); nothing is hotlinked.

## Flow

0. Welcome splash: "Welcome back, Alex · Gemini is now your 24/7 AI agent" → Get started

1. "What do you do?": one focused question (business name, then type and size chips)  
2. Pain discovery: a two-level, mutually exclusive menu. The main menu shows 5 pain areas, each with a check and an "N selected" badge. Tapping one opens a sub-screen of simple tap-to-select rows (checkboxes, no sliders). Each sub-problem carries a fixed, illustrative typical hours/$ estimate that you can edit from the ⓘ source card. To return: the breadcrumb, the footer "Done", the footer Back, browser/Android back (history state), or swipe right. The live illustrative tally is computed from the sub-problems you pick. Only the main menu advances ("Show my team (N)", disabled until 1+ pick). On a sub-screen the footer button reads "Done", and each sub-screen has Select all / Clear all. Agents and connectors only appear after the full list is done.  
3. Agent team: recommended cards with on/off, plus per-agent voice (6 presets, formality slider, emoji, length, live preview, Apply to all)  
4. One-click setup: mock connectors for the selected pain areas only, grouped by pain (the rest sit under "More connectors"), voices at a glance, approvals, then **"Learning how you work"**: connector icons light up one by one with a status line, sample learned facts appear, then "Here's what I learned" with the agents online and a Continue pill  
5. Day-one dashboard: KPIs, approval inbox (Approve/Edit), activity feed, each item tagged "For: <pain area>"  
6. Home: "Good afternoon" with a "Work with Gemini" prompt box (adds a sample task) and "Your tasks" (Working on it / Waiting on your approval), followed by the setup summary with source chips and Get started / Restart  

All monetary/hour figures are labeled illustrative or sample.

## Source cards (v2)

Every number has an (i) chip. Tap it to see the source, formula, inputs, and last-updated time, plus Edit and Reset.
Edits persist across steps, recalculate dependent totals (e.g. revenue → margin, hours lost → hours saved),
and show an "Edited by you" badge. All values are sample / illustrative.

Tests: `node capture.mjs` (desktop e2e + screenshots) and `node mobile-test.mjs` (iPhone 13 + 320px), against a local server on :8877.

## Pain structure (v3)

`PAIN_GROUPS` in `app.js` holds the 5 areas. Each sub has an id, the exact copy, illustrative `hours`/`dollars` per week, and the agents it maps to; each area has its `connectors`. `CONNECTORS` is the connector catalog.
Agent mapping: New customers → Growth Spark; Losing customers → Customer Pal + Order Desk; Operations → Pantry Stock + Ship & Scoop; Numbers → Cash Sense; Stretched thin → Store Captain (always on).
