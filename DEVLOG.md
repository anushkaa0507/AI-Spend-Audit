# Dev Log

## Day 1 — 2026-05-06

**Hours worked:** 3

**What I did:** Read the full brief twice. Set up Next.js 14 with TypeScript, configured Supabase (created `audits` and `leads` tables), and scaffolded the project structure. Wrote out the pricing data for all 8 tools and started the audit engine type definitions.

**What I learned:** Supabase's free tier requires email confirmation by default — disabled that for the anon key since we're doing server-side inserts only.

**Blockers / what I'm stuck on:** Deciding whether to use the Anthropic API or a free alternative for the AI summary. Free tier limits are tight.

**Plan for tomorrow:** Finish the audit engine logic for all 8 tools and write the first passing tests.

---

## Day 2 — 2026-05-07

**Hours worked:** 4

**What I did:** Completed the full `runAudit()` engine covering ChatGPT, Claude, GitHub Copilot, Cursor, Gemini, Windsurf, and both API-direct tools. Wrote 8 tests. Set up Jest with ts-jest. All tests passing.

**What I learned:** The edge case where a user's reported spend is higher than the official rate (seat over-count / billing error) needed its own detection branch — added that as a catch-all at the end of the loop.

**Blockers / what I'm stuck on:** The AI summary: OpenRouter's free DeepSeek model has occasional rate limit errors. Need a solid fallback.

**Plan for tomorrow:** Build the form UI and wire up the API route end-to-end.

---

## Day 3 — 2026-05-08

**Hours worked:** 5

**What I did:** Built `SpendForm` with dynamic tool/plan dropdowns, `localStorage` persistence, and honeypot spam protection. Built `POST /api/audit`, connected it to the audit engine and OpenRouter. Implemented a template-based fallback for when the AI API fails.

**What I learned:** Next.js server actions vs API routes: for this use case API routes are simpler since the form is a client component doing a `fetch`. Server actions would require more restructuring.

**Blockers / what I'm stuck on:** Open Graph tags need to be dynamic per audit ID, which requires server component metadata generation.

**Plan for tomorrow:** Build results page with dynamic OG tags and lead capture form.

---

## Day 4 — 2026-05-09

**Hours worked:** 4

**What I did:** Built `AuditResults` with per-tool cards, savings hero, Credex CTA for high-savings cases, and the "already optimal" state. Added share button that copies the URL to clipboard. Built `LeadCapture` and `POST /api/leads`. Resend emails working end-to-end.

**What I learned:** Dynamic `generateMetadata` in Next.js App Router needs the same `params` type as the page component — easy to get wrong with async params in Next 14.

**Blockers / what I'm stuck on:** The results page needs the Navbar component which is referenced but needs to be a shared component.

**Plan for tomorrow:** Polish UI, add Navbar, fix any duplicate code in API routes, write all markdown files.

---

## Day 5 — 2026-05-10

**Hours worked:** 3

**What I did:** Built Navbar component. Cleaned up the duplicate leads API routes (had two versions merged together). Fixed the broken HTML in the email template (missing `<a` tag opening). Ran Lighthouse — Performance 91, Accessibility 94, Best Practices 92.

**What I learned:** The Resend `onboarding@resend.dev` sender address works for testing but in production you need a verified domain. Documented this.

**Blockers / what I'm stuck on:** Need to write the entrepreneurial markdown files.

**Plan for tomorrow:** Write GTM, ECONOMICS, USER_INTERVIEWS, LANDING_COPY, METRICS, PRICING_DATA, PROMPTS, REFLECTION, TESTS.

---

## Day 6 — 2026-05-11

**Hours worked:** 5

**What I did:** Conducted 3 user interviews (DM'd founders in indie hacker communities). Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md. Set up GitHub Actions CI — lint and tests green on push.

**What I learned:** Two of the three people I interviewed didn't know they could get enterprise AI pricing discounts — they assumed retail was the only option. This validated the Credex angle hard.

**Blockers / what I'm stuck on:** Formatting ECONOMICS.md in a way that's readable but still shows the math clearly.

**Plan for tomorrow:** Final polish, write REFLECTION and USER_INTERVIEWS, deploy, verify live URL works.

---

## Day 7 — 2026-05-12

**Hours worked:** 3

**What I did:** Wrote REFLECTION.md and USER_INTERVIEWS.md. Final deploy to Vercel. Verified the full flow end-to-end on the live URL: form → audit → results page → lead capture → email received. Submitted.

**What I learned:** The week taught me that the entrepreneurial side (GTM, user interviews, economics) takes as long as the code if you do it seriously. I underestimated it on Day 1.

**Blockers / what I'm stuck on:** Nothing blocking — shipped.

**Plan for tomorrow:** N/A — submitted.