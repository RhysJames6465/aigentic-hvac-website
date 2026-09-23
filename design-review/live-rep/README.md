# Live AI Rep homepage teaser comparison

This is an isolated review surface for the existing Aigentic Campaign homepage `#demo` section. The production homepage is untouched. Open `index.html` from the repository root at `/design-review/live-rep/`.

## Shared brief

- Audience: established HVAC contractors.
- Same illustrative enquiry and request outcome in every direction.
- Brand continuity: existing navy, cyan, Manrope, DM Sans, and Aigentic lockup.
- The example does not connect to CueVue, send a message, or book an appointment.
- The contact link leads to the site's existing contact page. It does not imply a live calendar.

## Named design sources

| Direction | Authority used | Distinct design decision |
| --- | --- | --- |
| A | Impeccable 4.3.1, `new-work` and `craft-floor` | Conversation takes the visual lead; no phone mockup. |
| B | Impeccable plus the published UI UX Pro Max skill guidance | Show the visitor exchange and the contractor's structured handoff side by side. The Pro Max search script was **not** run in this environment. |
| C | Impeccable plus principles studied in VoltAgent's Apple design reference | Restrained typography and whitespace around the exchange. This is not an Apple skin or copied tokens. |

The Impeccable context launcher could not complete here. The incumbent website, shared assets and CSS were inspected directly, and its `new-work` and `craft-floor` references informed the work. These are **directed variants**, not independent runs of three agents or a blinded skill benchmark.

## Review questions

1. Can an HVAC owner tell what Sophie does within seconds?
2. Is the handoff to a human team clear, without implying a guaranteed booking?
3. Does the surface feel native to Aigentic's existing site?
4. Does mobile keep the conversation readable and the CTA discoverable?
5. Does motion explain the sequence rather than decorate it?

## Release gate

Choose a direction and complete visual QA at desktop and mobile widths before replacing the production `#demo` section. A dedicated `/live-rep` page needs a verified CueVue embed, approved claims, tested booking/contact route, and final demonstration assets. Do not publish this review page as a finished customer-facing experience.

## Checks completed

- JavaScript syntax check and HTML structure/link checks.
- Three tab controls, five story beats and one replay action per direction.
- Keyboard tab navigation and a reduced-motion static presentation are implemented.

Visual browser QA remains open: the available cloud browser blocks localhost, and no local browser binary was available.
