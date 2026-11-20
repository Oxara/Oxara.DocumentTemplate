# Optional illustrated consumer integration

Visual authority: [ILLUSTRATED-VISUAL-STANDARD.md](ILLUSTRATED-VISUAL-STANDARD.md). Fixed painted 2D atlas/book/growth defaults replace the rejected vector demo. They are reused when custom artwork is absent; no per-topic generation is needed.

The template owns reusable `document-hero` and `illustrated-card` features,
registered in features/features.json and demonstrated by index.html and
docs/illustrated-presentation.html. Fixed atlas/book defaults are used when
custom artwork is omitted. Consumers can supply topic-specific artwork; it must not replace the
article, sidebar/TOC, search, semantic headings or existing document hierarchy.

## Shared implementation standards

- Page-edge scrollbars use the small semantic-token indicator in
  `features/base/page-scrollbar.css`. Nested code/menu scrollbars keep their
  independent controls, and forced-colours mode restores native affordances.
- The theme control shows the action it will perform: moon while viewing the
  light theme, sun while viewing the dark theme. A glyph does not replace an
  accessible name or a visible keyboard focus indicator.
- A consumer-specific surface palette must be imported by that consumer's package
  or feature. Never add a personal palette to shared `docs-layout` defaults.
- Decorative props and card growth are opt-in consumer features. Respect reduced
  motion, suspend offscreen work and preserve real semantic links if animation
  or artwork fails. Text must remain readable without animation.
- A normal content link must not require a pointer-only gesture; keyboard and
  touch users reach the same destination. Navigation state and URL ownership
  remain with the consumer.

Personal mascots, scenery, autobiography and content are not template assets.
Brand's reviewed product profile records the consumer's deliberate exceptions;
do not infer universal design rules from a single site.

Canonical hero CSS/JS: features/document-hero/document-hero.{css,js}. Cards: features/illustrated-card/illustrated-card.css. Default assets: assets/presentation/. The site consumes these owner files; its site-art.css and library/catalog bind personal art rather than duplicate generic implementation.
