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

## Review gate

Before accepting a visual change:

1. Compare light and dark modes against the current baseline at the same viewport.
2. Verify that labels and supporting text meet contrast requirements without becoming decorative UI.
3. Confirm that no heading changed semantic or visual component type.
4. Confirm that the layout and density are unchanged unless the task explicitly authorizes them.
5. Reject the change if branding becomes more prominent than the documentation content.
