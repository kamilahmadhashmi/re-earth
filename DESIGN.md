---
version: 1.0.0
name: RE-EARTH
description: Planetary collegiate circular electronics infrastructure transforming discarded university electronics into verified recovery telemetry.
colors:
  ground: "#0B0F14"       # Deep silicon wafer substrate obsidian
  surface: "#131922"      # Physical matte equipment chassis
  surface-hover: "#1C2430"# Focused chassis layer
  ink: "#F8FAFC"          # Pure high-contrast legible titanium white (15.8:1 contrast)
  muted: "#94A3B8"        # Electrolytic palladium conductive trace silver (7.8:1 contrast)
  copper: "#C86432"       # Refined reclaimed metallurgical copper (Cu #29)
  gold: "#EAB308"         # Circuit board contact refined gold (Au #79)
  attestation: "#10B981"  # Cryptographic hardware attestation (calm, non-neon verification)
typography:
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontWeight: "700"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "14px"
    lineHeight: "1.6"
  telemetry:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "12px"
rounded:
  control: "6px"          # Buttons, inputs, small tags (rounded-md)
  pill: "8px"             # Segmented control toggles (rounded-lg, no bulbous blobs)
  card: "12px"            # Telemetry panels and modals (rounded-xl)
borders:
  hairline: "1px solid rgba(255, 255, 255, 0.09)"
  active: "1px solid rgba(200, 100, 50, 0.35)"
---

# RE-EARTH Design Contract & Anti-Slop Specification

## 1. Physical Engineering Concept
RE-EARTH is an environmental computing and circular economy engineering system, not a marketing template. Every visual move must derive from the physics and economics of electronics recovery: silicon substrates, copper traces, gold contact fingers, and cryptographic kiosk telemetry.

## 2. Refused AI Defaults (Strictly Banned)
- **No Purple/Indigo Gradients (P0 C1):** Completely purged. Replaced with physical metallurgy tokens (Copper `#C86432`, Gold `#EAB308`, Palladium `#94A3B8`).
- **No Gradient Headlines (P0 C6):** `bg-clip-text text-transparent` is banned. Headlines are solid, high-contrast, confident text.
- **No Over-Rounded Bulbous Containers:** Containers use purposeful 8px to 12px radii. No `rounded-3xl` bubble cards.
- **No Unjustified Glassmorphism (P1 K3):** Opaque, solid matte chassis (`#131922`) with crisp 1px hairline borders (`rgba(255,255,255,0.09)`). Blur is reserved exclusively for the top sticky navigation bar over scrolling content.
- **No Generic Sparkle Icons (P1 I3):** `Sparkles` icon is banned. Replaced with domain-accurate iconography (`Layers`, `Cpu`, `ShieldCheck`, `Scale`, `Flame`).
- **No Screaming Tracked ALL-CAPS Eyebrows (P1 SD4):** Replaced with clean structural metadata in sentence case or precise chapter tags.
- **No Single-Word Headline Accenting (P1 SD5):** No artificial single colored words in headlines. The entire message carries authority.
- **No Worn Arrow Glyph Welded to CTAs (P1 CP3):** Buttons declare their exact action directly without trailing decorative `→`.
- **Accessible Motion & States:** All transitions strictly capped at 150-200ms ease. `@media (prefers-reduced-motion: reduce)` respected globally. Keyboard `:focus-visible` rings on all interactive elements.
