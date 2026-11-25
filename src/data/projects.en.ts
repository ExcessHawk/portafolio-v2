// English content for the projects and the stack section. Tech names in each
// `stack` array are language-neutral and kept identical to the Spanish data so
// the icon lookup in `lib/tech.ts` keeps working.

import type { Project } from './projects'

export const projectsEn: Project[] = [
  {
    slug: 'veloce-ts',
    name: 'Veloce-TS',
    kind: 'Open-source framework',
    year: '2025 — now',
    headline: 'A TypeScript web framework with decorators, DI and OpenAPI, published on npm.',
    body: 'I wrote the framework I wanted to use: declarative controllers with decorators, dependency injection, Zod validation, and an OpenAPI 3.1 schema that generates itself from the types. It runs on Bun, Node, Deno and Workers.',
    stack: ['TypeScript', 'Bun', 'Hono', 'Zod', 'OpenAPI 3.1'],
    metrics: [
      { label: 'npm version', value: '3.5.1' },
      { label: 'runtimes', value: '4' },
      { label: 'license', value: 'MIT' },
    ],
    highlights: [
      'Fully typed controller, route, guard and middleware decorators.',
      'Constructor-based dependency injection container.',
      'OpenAPI docs derived from the Zod schemas, not written by hand.',
      'WebSocket gateways with the same decorator model as HTTP.',
    ],
    links: [
      { label: 'npm', href: 'https://www.npmjs.com/package/veloce-ts' },
      { label: 'GitHub', href: 'https://github.com/ExcessHawk/Veloce-TS' },
      { label: 'Docs', href: 'https://docs.veloce-ts.com' },
    ],
    status: 'activo',
    accent: 'signal',
  },
  {
    slug: 'marketplace',
    name: 'Multi-vendor marketplace',
    kind: 'Full-stack app',
    year: '2026',
    headline:
      'A complete marketplace: catalog, cart, checkout, seller payouts, disputes and live chat.',
    body: "Several stores sell on one site. An order splits into sub-orders, one per seller, and each follows its own path: it ships, it's received, it's reviewed, and the seller gets paid. Money doesn't move until the buyer confirms delivery. It lives in three repos — the API, the frontend, and the Zod schemas they share — so a contract change breaks the build, not production.",
    stack: ['React', 'TypeScript', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'WebSocket'],
    metrics: [
      { label: 'HTTP routes', value: '79' },
      { label: 'tables', value: '22' },
      { label: 'e2e tests', value: '355' },
    ],
    highlights: [
      'Concurrent checkout never oversells: stock is decremented with a conditional UPDATE inside the transaction.',
      'A partial unique index stops the same buyer from having two payment-pending orders at once.',
      "The payment webhook is idempotent by event id; the provider's retries duplicate nothing.",
      'Authorization never comes from the token alone: each seller request re-reads its store from the database.',
      "Asking for someone else's resource returns 404, not 403: a 403 would confirm that id exists.",
      'WebSocket chat with a one-minute ticket, instead of putting the token in the URL.',
    ],
    links: [
      { label: 'See it live', href: 'https://demo.alfredomejia.com.mx' },
      { label: 'API', href: 'https://github.com/ExcessHawk/marketplace-back' },
      { label: 'Frontend', href: 'https://github.com/ExcessHawk/marketplace-front' },
      { label: 'Contracts', href: 'https://github.com/ExcessHawk/marketplace-contracts' },
    ],
    playground: true,
    status: 'terminado',
    accent: 'signal',
  },
  {
    slug: 'futbol-analytics',
    name: 'Fútbol Analytics',
    kind: 'Data analysis & modeling',
    year: '2026',
    headline:
      'A model that predicts matches, validated against 34,018 real results — and that loses to the betting market. The app says so on every prediction.',
    body: "An eight-league dashboard with a Dixon-Coles model, probable line-ups drawn on the pitch, and a bet-slip reader from a photo. The interesting part isn't the model: it's the validation. Walk-forward backtesting, hyperparameters chosen on seasons that are never scored, and confidence intervals on every comparison. Everything it predicts comes with how well it does, even when the answer is uncomfortable: the model doesn't beat the bookmakers, and that's written in the README and on screen.",
    stack: ['Python', 'Streamlit', 'PostgreSQL', 'pandas', 'NumPy', 'SciPy', 'scikit-learn', 'Altair', 'mplsoccer', 'OpenCV', 'Tesseract', 'API-Football', 'Docker'],
    metrics: [
      { label: 'matches validated', value: '34,018' },
      { label: 'leagues', value: '8' },
      { label: 'tests', value: '127' },
    ],
    highlights: [
      'The honest result is the negative one: across 34,018 out-of-sample matches the model loses to the closing odds by 0.021 of log loss, with a confidence interval that never touches zero. Publishing it that way is worth more than a pretty number with no way to check it.',
      'Walk-forward backtest: each week the model refits using only matches played before that Monday. The code verifies this on every block, because leakage from the future is the bug that makes every backtest look wonderful.',
      'The hyperparameters were chosen on 2013/14 and 2014/15, two seasons that are never scored afterward. Tuning them on the same thing you measure is grading your own exam.',
      "Dixon-Coles barely beats a plain Poisson (0.0004 of log loss): the low-score correction, the whole point of the method, barely moves the 1X2. It's measured, not assumed.",
      "There are markets where it does help — shots, shots on target, cards — and one where it's no better than the league average: corners. That one is in the table too.",
      'The probable line-up for the next match is built from the last formation, who has held each position most over six matchdays, and the injury report. It gets 8.3 of 11 starters right — and the screen also says that repeating the previous eleven gets 8.2, the comparison almost nobody publishes because it reveals how little the method adds.',
      "The pitch is drawn in Altair, not as an image, so a click on a player can be read back and opens their season. It's vertical on purpose: on a phone a horizontal pitch makes you tilt your head.",
      "The bet-slip reader runs OCR on the screenshot, recognizes match, market and odds, and computes the expected value. It's the flashiest part and the one with the least science.",
      'Calibration is good: when it says 40%, it happens about 40% of the time. A model can be well calibrated and still useless for betting, and both facts are on the same screen.',
    ],
    links: [
      { label: 'See it live', href: 'https://futbol.alfredomejia.com.mx' },
      { label: 'Code', href: 'https://github.com/ExcessHawk/futbol-analytics' },
    ],
    status: 'terminado',
    accent: 'ember',
  },
  {
    slug: 'ledger',
    name: 'Concurrent ledger',
    kind: 'Backend service · Java',
    year: '2026',
    headline:
      'Transfers between accounts that stay balanced under concurrency: double-entry with pessimistic locking, verified with 200 parallel transfers.',
    body: 'A double-entry ledger in Spring Boot. I built it to answer one question with a test, not with prose: does the money still sum to zero when many transfers touch the same accounts at once? The answer is a concurrency test against real Postgres, not a comment that says "it’s thread-safe".',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'Spring Data JPA', 'Flyway', 'Testcontainers', 'JUnit 5'],
    metrics: [
      { label: 'parallel transfers', value: '200' },
      { label: 'imbalances', value: '0' },
      { label: 'tests', value: '8' },
    ],
    highlights: [
      'Pessimistic locking ordered by id: two transfers touching the same accounts queue in the same order, so they never deadlock each other.',
      'Real double-entry: each movement writes two entries that sum to zero, and the balance is derived from them instead of stored loose and free to lie.',
      "An idempotency key per transfer: the client's retry with the same key doesn't apply it twice.",
      '200 parallel transfers against real Postgres via Testcontainers; at the end, the sum of all balances is identical to the start.',
      'A @Version on top of the pessimistic lock catches the lost update the pessimistic lock alone misses.',
    ],
    links: [{ label: 'Private', href: '#' }],
    status: 'terminado',
    accent: 'wire',
  },
  {
    slug: 'stock',
    name: 'Inventory reservations',
    kind: 'Backend service · .NET',
    year: '2026',
    headline:
      "Reserving stock without overselling under load, with a measured finding: the naive loop doesn't oversell, it loses sales. The test counts it.",
    body: "An inventory-reservation service in .NET over Postgres. The point isn't that it works, but what the concurrency test reveals: the naive version — read the stock, then write it — doesn't corrupt inventory, but grants fewer sales than it could. The number is measured, not assumed.",
    stack: ['C#', '.NET', 'EF Core', 'PostgreSQL', 'Npgsql', 'xUnit', 'Testcontainers'],
    metrics: [
      { label: 'concurrent scenarios', value: '100' },
      { label: 'oversold', value: '0' },
      { label: 'tests', value: '9' },
    ],
    highlights: [
      'The stock decrement is a conditional UPDATE (WHERE available >= n): the database, not the app code, guarantees it never drops below zero.',
      "The measured finding: a read-then-write loop doesn't oversell — xmin and a CHECK prevent it — but it loses sales, granting 76 of 100 when it could grant more.",
      "Postgres's xmin as a concurrency token (IsRowVersion): if two reservations touch the same row, one retries instead of clobbering the other.",
      'A background service expires lapsed reservations with FOR UPDATE SKIP LOCKED, without blocking against live ones.',
      '100 concurrent scenarios against real Postgres via Testcontainers: zero units oversold in all of them.',
    ],
    links: [{ label: 'Private', href: '#' }],
    status: 'terminado',
    accent: 'ember',
  },
  {
    slug: 'pensum',
    name: 'Pensum',
    kind: 'Multi-tenant SaaS',
    year: '2025 — now',
    headline:
      'A platform for private schools: classrooms, grades, SEP reports and WhatsApp notices.',
    body: "Each school lives on its own subdomain with its data isolated. Teachers enter grades, the system builds report cards as PDFs and summaries in Excel, and notifies parents over WhatsApp without paying Meta's API.",
    stack: ['Bun', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'React', 'Stripe', 'pg-boss'],
    metrics: [
      { label: 'isolation', value: 'per tenant' },
      { label: 'job queue', value: 'pg-boss' },
      { label: 'payments', value: 'Stripe' },
    ],
    highlights: [
      'Multi-tenant by subdomain, with the tenant resolved before the query touches the database.',
      'WhatsApp notifications with Baileys over WebSocket, at no cost per message.',
      'Report cards as PDFs and summaries in Excel, generated on the server.',
      'Stripe subscriptions and webhooks to bill each school.',
    ],
    links: [{ label: 'Private', href: '#' }],
    status: 'activo',
    accent: 'wire',
  },
  {
    slug: 'gpu-hunter',
    name: 'GPU Hunter',
    kind: 'Scraping bot',
    year: '2026',
    headline:
      'Watches seven stores in Mexico and the US and pings Discord when a GPU drops.',
    body: "Each store exposes its prices differently: an Atom feed, JSON-LD, Magento GraphQL, the WooCommerce Store API, server-rendered HTML. The bot speaks each one's language, keeps the history in SQLite, and only pings when something actually changed.",
    stack: ['Bun', 'TypeScript', 'SQLite', 'Discord webhooks'],
    metrics: [
      { label: 'sources', value: '7' },
      { label: 'dependencies', value: '1' },
      { label: 'countries', value: 'MX + USA' },
    ],
    highlights: [
      'Seven different adapters behind a single source interface.',
      'Alerts on a price drop, back-in-stock, or entry below a threshold — never on repeats.',
      "Respects each store's limits; the ones that throw a Cloudflare challenge are disabled, not bypassed.",
    ],
    links: [{ label: 'Private', href: '#' }],
    status: 'activo',
    accent: 'ember',
  },
  {
    slug: 'chat-ia',
    name: 'Streaming AI chat',
    kind: 'Full-stack app',
    year: '2026',
    headline:
      'The answer streams token by token, can be stopped mid-sentence, and every turn logs its tokens and its cost.',
    body: "A chat over a model's API, with persisted conversations and attachments that enter the context. I built it to answer one concrete question about my own framework: whether its streaming and cancellation pieces hold up in a real case. They do, and the way there left three findings written in the README.",
    stack: ['React 19', 'assistant-ui', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'shiki', 'Docker'],
    metrics: [
      { label: 'HTTP routes', value: '23' },
      { label: 'tables', value: '8' },
      { label: 'assertions', value: '44' },
    ],
    highlights: [
      'Canceling stops the generation, not just the screen: if you only close the channel, the server keeps producing tokens nobody will read but that still get billed.',
      "The hard part: the provider's loop ending doesn't mean the response ended — an adapter that cuts cleanly on abort exits the same way as one that finished. What tells the two apart is the signal.",
      'The assistant message is inserted empty before the first token. If the process dies mid-answer the partial remains, not a gap where the user thinks they wrote something that never existed.',
      "The spending cap is checked before calling the model and counts the attachments, which ride along on every turn. A loop here isn't a logging bug: it's an invoice.",
      'One yield per token makes React re-render per character and the chat stutters exactly when it should feel alive; it is batched per 16 ms frame and flushed at the end.',
      "The model sits behind an interface with two adapters. The public demo talks to real Gemini, and what makes it sustainable isn't trust but the cap: spend is checked before every call, and the fake adapter stays for the tests, which shouldn't cost money.",
    ],
    links: [
      { label: 'See it live', href: 'https://chat.alfredomejia.com.mx' },
      { label: 'API', href: 'https://github.com/ExcessHawk/aichat-back' },
      { label: 'Frontend', href: 'https://github.com/ExcessHawk/aichat-front' },
    ],
    playground: true,
    status: 'terminado',
    accent: 'signal',
  },
  {
    slug: 'citas-medicas',
    name: 'Medical appointments',
    kind: 'Full-stack app',
    year: '2025 — 2026',
    headline:
      'A clinic scheduler: the patient sees on the map where the office is and books; the doctor sees patients and writes the record.',
    body: 'Three roles with different views over the same data. The patient searches for a specialist, sees offices on a map and books; the doctor publishes availability, sees patients and records the visit; the admin sees the whole picture. It started as an Express backend and is ported to Veloce-TS with Drizzle.',
    stack: ['React 19', 'Mantine', 'Veloce-TS', 'PostgreSQL', 'Drizzle', 'Leaflet', 'Docker'],
    metrics: [
      { label: 'HTTP routes', value: '34' },
      { label: 'tables', value: '7' },
      { label: 'assertions', value: '35' },
    ],
    highlights: [
      "A slot can't be booked twice: a unique index on doctor, date and time prevents it in the database, not just in the code.",
      "A role isn't enough to authorize: being a doctor doesn't grant access to another's appointment, so each handler checks ownership.",
      "The map is Leaflet over OpenStreetMap, not Google: a Google key would ride in the browser's JavaScript.",
      "Coordinates allow null; an office that isn't geocoded doesn't break the map, and the UI says so.",
      "Attachments aren't served openly: the download goes by the document id, which is the only thing that says whose file it is.",
      'Canceling asks for a reason and stores it: whoever gets the notice learns why, not just that the appointment vanished.',
      'The appointments table turns into cards on the phone: five columns at 390px force a sideways drag to reach the actions.',
      'Email reminders at 08:00, with the known limit that they live in the process.',
    ],
    links: [
      { label: 'See it live', href: 'https://citas.alfredomejia.com.mx' },
      { label: 'Code', href: 'https://github.com/ExcessHawk/sistema-de-citas-medicas' },
    ],
    playground: true,
    status: 'terminado',
    accent: 'wire',
  },
]

export const stackEn = [
  {
    group: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'PHP', 'C#', 'SQL'],
  },
  {
    group: 'Backend',
    items: ['Bun', 'Node.js', 'Veloce-TS', 'Hono', 'Drizzle', 'Prisma', 'Zod', 'WebSocket'],
  },
  {
    group: 'Frontend',
    items: ['React', 'Next.js', 'Astro', 'Tailwind CSS', 'React Query', 'Vite'],
  },
  {
    group: 'Data & infrastructure',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'SQLite', 'Docker', 'Nginx', 'Git'],
  },
  {
    group: 'Data analysis',
    items: ['pandas', 'NumPy', 'SciPy', 'scikit-learn', 'Streamlit', 'Altair', 'OpenCV', 'Tesseract'],
  },
  {
    group: 'Practice',
    items: ['E2E tests', 'OpenAPI', 'Secure code', 'Web pentesting', 'CI/CD'],
  },
]
