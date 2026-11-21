# DocumentTemplate design guardrails

DocumentTemplate is a restrained, content-first documentation shell. Brand migrations must preserve that character. A color, logo or token task is not authorization to redesign layout or components.

## Public product language

The public documentation presents DocumentTemplate to people who want to use it.
Introduce the benefit and suitable use, then working examples, installation,
customization and relevant accessibility limits. Component rules and accurate HTML
examples belong here; agent instructions, artwork-generation prompts, internal
approval status and orchestration checklists do not belong in the main narrative.
Technical generation sources and originals stay in their canonical guides. A short
optional guide link may remain, and existing public anchors remain compatible.
Changing the audience and content flow is required; replacing a few imperative
verbs alone does not implement this boundary. This rule applies to new sections
throughout the docs, not only Hero ve Kartlar.

The interface uses the Brand Manrope family at 500–700 and code uses JetBrains
Mono at 400–600. Local font files and OFL provenance are distributed with base;
Segoe UI/Arial and Consolas are fallbacks. DT keeps its own content hierarchy and
semantic theme roles; Brand's presentation stylesheet is not imported as a reset.

## Allowed in a brand migration

- Replace approved logo, favicon and application-icon assets.
- Map semantic color tokens while preserving their existing UI roles.
- Improve text contrast when the existing role fails accessibility checks.
- Separate identity, primary-action, secondary-action and text-accent roles without changing component structure.

## Rejected by default

- Turning headings, eyebrows or labels into pills, badges, buttons or cards.
- Adding decorative gradients, glow, prominent shadows or ornamental accent bars.
- Wrapping an existing list or grid in new card surfaces solely to make it feel more branded.
- Changing spacing, border radius, layout, component hierarchy or information density as a side effect of a brand task.
- Using the accent color on every interactive or textual element.
- Importing document-type or site-specific visual behavior into the shared template.

## Navigation and destination cards

- A card may be a single full-surface link only when it has exactly one destination.
- When repository, demo, package registry or extension marketplace destinations differ,
  use the shared `resource-card` structure and label every destination explicitly.
- Do not hide the repository behind a distribution link, or the distribution channel
  behind a repository link. Both must remain independently keyboard-accessible.
- Product-specific labels and URLs belong to the consumer; layout and interaction rules
  belong to DocumentTemplate.
- The optional button treatment belongs only to destination links. It must not be used
  to turn headings, labels or descriptive content into controls.

Any rejected-default change requires a separate, explicit design request and before/after approval. It must not be bundled into token or asset standardization.

## Shared primary and secondary actions

See the cross-project [button inventory and task taxonomy](BUTTON-INVENTORY.md) for current families, exclusions and migration decisions.

The shared owner is `features/base/actions.css`, imported by base and declared
with its optional texture asset in `features/features.json`. Existing
`docs-primary-action` and `docs-secondary-action` classes and link/button
semantics remain valid. Document-layout and hero styles must not independently
set their foreground/background states. Normal and interactive colour pairs
live together in the action owner; hero does not independently recolour them.

### Surface context

Explicit shared CTA classes on plain document surfaces use a calm single-border primary/secondary treatment, without split inner/outer frames, leaf texture or decorative motion. Priority, palette, link/button semantics,48px targets and persistent hover/focus remain shared. Quiet tools remain separate helper actions.

The existing illustrated contexts ([data-document-hero], .document-hero, .docs-home-hero, .illustrated-card) enable the approved frame/leaf treatment through base/actions.css. Consumers must not fork resource-card colours or add decorative overrides. The frame/texture rules below apply only inside these illustrated contexts; the default is undecorated.

The user-selected primary has stable centered text, turquoise to the existing
companion olive `#BAC68D`, a split frame erasing from center to ends, and an
optional low-opacity inward-revealing existing leaf mask. No side symbols,
layout movement or repeated animation. The olive is component usage of the
existing companion palette, not a new global Brand identity token.

Secondary is a quieter tonal/outline action. Keep the same foreground across
normal, hover, focus, active and visited; only transition between backgrounds
that all meet the text contrast requirement. A dark hero uses explicit dark
secondary surfaces even in light mode. Do not combine its pale hero foreground
with the ordinary light-page hover fill. Native focus remains independently
visible and reduced motion retains a static frame. Optional decorative markup
is aria-hidden and labels remain real text.

Final local design decision: primary and secondary are colour variants of one
implementation. Geometry, typography, frame clipping, persistent hairline,
texture crop/opacity and every motion timing are shared. Only foreground,
fill, frame, texture and focus colour variables may differ. Earlier proposals
with different texture intensity or frame motion are superseded. Keep the
secondary's text and outlines quieter than the filled primary; keyboard focus
must remain visible independently of this visual hierarchy.

The professional local candidate keeps hover emphasis for as long as the
pointer remains over the action. A persistent fill and outer boundary carry
that emphasis; the short inner-frame entry is supplementary. Focus uses the
same final emphasis, and reduced motion reaches it instantly. There is no
delayed fade-out or repeated animation.

| Action | Normal → hover/focus fill | Text / inner stroke | Normal → interactive outer stroke |
| --- | --- | --- | --- |
| Primary | `#19C7B5` → `#BAC68D` | Ink `#0B1D29`, fixed | `#8EA6B3` → Cloud `#F4F7F8` |
| Secondary | Graphite `#173344` → Slate `#375C72` | Cloud text; `#5D7D90` → `#BAC9D1` inner | `#5D7D90` → `#BAC9D1` |

These are existing Brand colours (`assets/tokens/colors.json` and companion
olive), used as component pairs rather than new global tokens. The common
opaque Ink separator sits between fill and outer stroke; the 3px Cloud focus
ring also has an Ink backing. Inner strokes are opaque: white directly on
olive was rejected for insufficient contrast. Decorative texture is clipped
away from stroke-adjacent pixels and kept below the text. Keep one shared
geometry, clipping, timing, crop and opacity for both colour variants.

## Quiet actions and control states

Base `controls.css` owns quiet action colours, focus and availability states.
Code-copy, table-copy and close controls share these rules; their feature files
keep placement and density. `document-utility-action` exposes the same treatment
for a consumer-owned helper action. This is not a third CTA priority. Do not add
CTA frames, decorative textures or leaf motion to copy/close tools.

Resource-card retains its original compact38px split icon/label destinations in features/resource-card/resource-card.css. It is excluded from the shared CTA replacement: neither the framed proposal nor the calm replacement is its accepted appearance. Do not alias resource-card actions to docs-primary-action/docs-secondary-action or fork them in consumers. Preserve independent targets, original geometry and interaction. The legacy primary white/turquoise pair is scoped to this retained component (2.13:1 text contrast); it is not a new global role or an AA claim. Shared typed web-action roles remain Ink and keep their normal/hover AA contract.

Native `disabled` blocks button activation; `aria-busy` describes an operation
and does not block activation on its own. Keep labels readable rather than fading
whole controls. Copy actions disable during the promise, announce truthful success
or failure, and restore fallback focus after re-enabling the button. Feedback is
text/state, not a success/danger CTA variant. Link visited colours retain the CTA
foreground. An unavailable destination should not become a fake disabled link.

Tabs and preference groups keep selected/pressed semantics, keyboard behaviour and
their compact geometry. Their selected indicator uses the theme focus colour for
contrast, rather than the decorative identity accent. Disclosure and navigation
remain separate components. Theme/search/menu/scroll tools keep their existing
34–40px targets; copy targets are at least 32px, with 40px on coarse pointers.
Measure actual bounds and spacing in context rather than turning every tool into
a 48px CTA. Code-copy stays visible on touch; focus remains visible for keyboard use.

## Review gate

Before accepting a visual change:

1. Compare light and dark modes against the current baseline at the same viewport.
2. Verify that labels and supporting text meet contrast requirements without becoming decorative UI.
3. Confirm that no heading changed semantic or visual component type.
4. Confirm that the layout and density are unchanged unless the task explicitly authorizes them.
5. Reject the change if branding becomes more prominent than the documentation content.
