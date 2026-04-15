# Health OS

Mobile-first PWA dashboard built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and `next-pwa`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 on your phone (same Wi‑Fi) or in Chrome DevTools mobile emulation.

## Build

```bash
npm run build
npm start
```

The service worker is only generated in `next build` (`next-pwa` is disabled in dev by design).

## Layout notes

The dashboard is viewport-height-constrained (`h-[100dvh]`) with an outer `overflow-hidden` body — only the workout and meal list bodies scroll internally, so the page itself never grows a scrollbar.

## TODO

- Replace `public/icon-192.png` and `public/icon-512.png` placeholders (manifest references them).
- Wire metrics inputs to persistence.
