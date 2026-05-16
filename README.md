# Outfitters — Editorial Revamp

A homepage redesign concept for [Outfitters Pakistan](https://outfitters.com.pk), repositioning the brand from "generic Shopify catalog" to **editorial commerce with character**.

**Live preview:** https://abdulahadd002.github.io/outfitters-revamp/

---

## The brief

Pakistani fashion e-commerce is dominated by either generic Shopify themes or marketplace-style stores. The opportunity for Outfitters: keep the contemporary, mass-market positioning, but layer in **editorial polish** — warm palette, serif headlines, real campaign storytelling, and modern e-commerce trust signals (reviews, COD, fast delivery, loyalty) that the current site is missing.

---

## What's in the mockup

### Desktop sections
- **Hero** — full-bleed Pause Collection campaign with editorial typography
- **Drop countdown strip** — live countdown for the next named drop
- **Shop by Category** — 6 visual tiles with hover ellipse animations
- **New Arrivals** — 8 real Outfitters products with hover-flip, swatches, Quick Add
- **Men / Women campaign split** — editorial dual-hero with gradient scrims
- **Best Sellers** — 4 top products with star ratings (which the real site lacks)
- **Last Chance / Sale** — Ink-background sale section with strikethrough pricing
- **OTR Club** — 3-tier loyalty program (Member · Insider · Icon)
- **Community wall** — UGC grid (#OutfittersOnYou)
- **Newsletter** — explicit "10% off first order" incentive

### Mobile-specific
- **Fixed bottom navigation** — Home, Shop, raised Search pill, Saved, Bag
- **Slide-down search drawer** — with trending products and popular searches
- **Editorial burger menu** — indexed department links, featured campaign card, color-coded badges, WhatsApp concierge with pulse-dot online status, social row
- **Horizontal-scroll product rails** with `scroll-snap-type: x mandatory`
- **Condensing sticky header** that auto-hides on scroll-down
- **Back-to-top** button with safe-area inset

---

## Design system

| Token | Value | Use |
|---|---|---|
| **Ink** | `#1a1310` | Primary text, dark surfaces — never pure black |
| **Bone** | `#f5f0e8` | Base background — never pure white |
| **Sand** | `#e8dcc4` | Secondary surfaces |
| **Brass** | `#c8a165` | Accent CTAs, badges, kickers |
| **Terracotta** | `#a8341c` | Sale tags, urgency |
| **Indigo** | `#2d3b5c` | Hover, depth |
| **Dust** | `#9b8e7a` | Muted text, dividers |

**Typography**
- **Display:** Bodoni Moda (editorial serif, headlines)
- **Body & UI:** Inter (clean sans, paragraphs and navigation)
- **Mono:** JetBrains Mono (kickers, prices, labels)

**Motion**
- Lenis smooth scroll
- Vanilla split-text reveals on viewport entry
- IntersectionObserver-driven section + card lift-ins
- Custom cursor with contextual labels (`VIEW`, `SHOP`, `DISCOVER`, etc.) — desktop only
- Animated SVG noise grain overlay
- Branded loader sequence (~900ms)
- All motion respects `prefers-reduced-motion`

---

## Tech stack

Intentionally minimal:

| Layer | Choice |
|---|---|
| **Markup** | Static HTML |
| **Styles** | Single CSS file with custom properties — no framework |
| **JS** | Vanilla — no React, no build step |
| **Smooth scroll** | [Lenis](https://github.com/darkroomengineering/lenis) (CDN, ~6KB) |
| **Fonts** | Google Fonts (Bodoni Moda, Inter, JetBrains Mono) |
| **Imagery** | Live Outfitters Shopify CDN |
| **Hosting** | GitHub Pages |

Total transferred (excl. images): under 50KB minified.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Multi-file dev version — primary entry point |
| `styles.css` | Design system + components + responsive + motion |
| `script.js` | Lenis init, custom cursor, split-text, reveals, countdown, mobile UX |
| `mobile-preview.html` | Self-contained single-file build with everything inlined — for offline sharing |

---

## Running locally

No build step. Either:

```powershell
# Option 1: Just open the file
start index.html

# Option 2: Local server (better — gets real URL behavior)
python -m http.server 8000
# then visit http://localhost:8000
```

---

## What this mockup is **not**

To be straight with whoever's reviewing this:

- This is **one homepage**. Not a full site.
- There's **no PDP, PLP, cart, or checkout** wired up.
- Product imagery is hot-linked from outfitters.com.pk's Shopify CDN — would need to be self-hosted in production.
- Ratings, review counts, and stock numbers are illustrative.

This is a **direction**, not a finished product. The goal is to align on the visual language and key UX moments before committing engineering time to a full Shopify theme.

---

## Conversion-relevant changes (versus the live site)

Most of the redesign is brand expression. These specific changes are likely to move revenue if shipped:

1. **Product reviews + star ratings** — the live site has zero
2. **Delivery promise upfront** ("2-day in Lahore/Karachi/Islamabad") vs. buried "5–7 working days"
3. **COD visible** in the utility bar and footer chips
4. **Free returns / 14-day messaging** in the utility bar
5. **WhatsApp Concierge** promoted in the header and burger menu
6. **Live drop countdown** to build notification opt-ins
7. **Newsletter explicit "10% off first order"** hook
8. **Quick Add** on product cards (saves a click)
9. **Visible color swatches** on PLP cards

If only two could be shipped to the live site tomorrow, install a reviews app (Judge.me or Loox) and surface delivery + COD in the utility bar.

---

## License

This is a design mockup made for evaluation. Outfitters imagery is hot-linked from outfitters.com.pk and remains property of Outfitters.
