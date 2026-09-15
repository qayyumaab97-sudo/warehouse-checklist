# Daily Warehouse Checklist

Bilingual (English / Bahasa Malaysia) daily checklist for the ReLive Pharmacy &
Medtech warehouse team — Aisar, Azmi, Idham and Erfa.

Each person records their counts, ticks their routine tasks, flags problems from a
fixed list, and notes any ad-hoc work. The manager reviews everything before closing.

## What it does

- **My Checklist** — one form per person, built from their actual job desk
- **Closing Review** — who has filled in, what problems were raised, what needs reordering
- **This Week** — seven-day grid plus a tally of the most frequent problems

Problem types are tick-boxes rather than free text, so they can be counted:
*"clinic closed 4×"* is a number you can take to a meeting.

Cold chain problems use identical labels for Aisar, Azmi and Idham, so the weekly
tally adds them into a single figure.

## Setup

**1. Create the database.** In your Supabase project: SQL Editor → New query →
paste `supabase-setup.sql` (kept in the parent folder) → Run.

**2. Get the credentials.** Supabase → Project Settings → API. You need the
**Project URL** and the **anon / public** key. Never use the `service_role` key.

**3. Provide them.** Two ways:

- **Hosted (recommended):** set `SUPABASE_URL` and `SUPABASE_KEY` as environment
  variables on the host. `server.js` injects them when serving, so they never
  enter this repository.
- **Standalone:** edit the two constants near the top of the `<script>` block in
  `index.html`. Do this only if the repository is private.

## Running

```bash
npm start          # serves index.html on $PORT (default 3000)
```

No dependencies — `server.js` uses only the Node standard library, so there is
nothing to install and nothing to break on deploy.

## Hosting

Works on any Node host (Railway, Render, Fly). It is also a plain static page:
drop `index.html` on Netlify, Cloudflare Pages or GitHub Pages and it runs with
no server at all — but then the credentials must be written into the file, so
keep the repository private if you do that.

## Access

The page has no login. Anyone holding the link can read and write, exactly like a
Google Form — the link is the key. Keep it off public channels, and keep nothing
confidential in the checklist.
