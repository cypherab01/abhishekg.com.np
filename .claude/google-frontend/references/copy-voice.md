# Copy and voice

Copy is half of why a Google page reads as a Google page. A layout in the right proportions with
copy in the wrong voice does not land. These rules are specific and mechanical enough to follow
exactly.

## The five hard rules

**1. Headlines end with a period.** This is the single most distinctive marker of Google marketing
copy. "Reality, expanded." "Unfold extraordinary." "Circle it. Search it. Find the look." "Bold
deals. Bolder adventures." The terminal period turns a headline into a statement rather than a
label, and its absence is immediately noticeable to anyone familiar with the register. Apply it to
hero headlines, section headlines, card headlines, and value-prop lines. Do **not** apply it to
button labels, nav items, eyebrows, or column headings.

**2. Sentence case everywhere.** Headlines, buttons, nav, labels, column headings, chips. Never
Title Case, never ALL CAPS, not even for eyebrows or buttons. Only proper nouns and product names
capitalise.

**3. Three to six words in a headline.** Count them. "Meet the new status pro." (5) "Lighter gets
mightier." (3) "Do spectacular, on the regular." (5) "Unbelievable sound. Unreal value." (4).
Longer headlines are the most common failure — a nine-word headline reads as a subheading and
collapses the hierarchy.

**4. One sentence of support, maximum.** Below a headline, one line explaining the benefit
concretely. If you need two sentences, the headline is doing too little work or the section is
trying to do too much.

**5. Eyebrow before headline.** The small grey label above a headline names the *product or
feature*; the headline states the *benefit*. `Quick Share` / "Share every moment with iPhone
friends, too." `Circle to Search` / "One gesture, many possibilities." This ordering — what it is,
then why you care — is characteristic and worth preserving.

## The voice

Warm, plain, confident, and specific. Google's marketing copy avoids both the enterprise register
("leverage our best-in-class platform") and the startup register ("we're on a mission to
revolutionise"). It talks about what the thing does for you, in short declarative sentences, in
ordinary words.

Devices Google's copywriters lean on:

- **Compression** — a benefit stated in the fewest possible words. "Lighter gets mightier."
- **Antithesis** — two contrasting halves. "Switch over. Don't start over." "Bold deals. Bolder
  adventures." "Precision crafted. Performance ready."
- **The imperative sequence** — a short chain of commands describing the interaction. "Circle it.
  Search it. Find the look."
- **Repetition with variation** — "Continuous updates. Constant delight." "Unbelievable sound.
  Unreal value."
- **Understated superlative** — a big claim in flat language rather than an exclamation. "The real
  deal." "Meet the new status pro."

What it never does: exclamation marks, rhetorical questions as headlines ("Ready to transform your
workflow?"), "unlock" / "elevate" / "seamlessly" / "revolutionary" / "game-changing", em-dash-heavy
sentences, second-person flattery ("you deserve"), or urgency manufactured with countdown language.

## Buttons and links

Verb-first, sentence case, 1–3 words, no period. The label states the action, and it stays the same
word through the whole flow — a button that says "Save changes" produces a confirmation that says
"Changes saved," not "Success."

The house set, which you can use directly:

| Context | Label |
|---|---|
| Primary commerce | `Shop deals` · `Pre-order now` · `Buy` · `Add to cart` |
| Primary informational | `Learn more` · `Explore` · `Get started` · `See how it works` |
| Secondary | `Explore more` · `See the latest features` · `Compare devices` |
| Navigation to a list | `Shop all` · `Browse all phones` · `See all support` |
| Form | `Sign up` · `Submit` · `Sign in and sign up` |

`Learn more` is Google's workhorse and appears many times on a single page; that repetition is fine
and normal here, but each instance needs an accessible name that distinguishes it — either
`aria-label="Learn more about Pixel Watch 4"` or a visually-hidden span. A page with fourteen
identical "Learn more" links and no distinguishing labels is unusable with a screen reader's link
list.

Never: "Click here", "Read more →" with the arrow as text (use an icon element),
"Submit" for anything other than a form submission, or a label that differs from the destination's
heading.

## Section headline formulas

Patterns that recur across Google's properties, safe to adapt:

```
Explore the latest on {product}.
Shop the latest {category}.
Shop popular categories.
Popular on the {store name}.
Discover the world of {product}.
Why buy on the {store name}.
Be in the mix with {brand}.
Meet the new {product}.
Introducing the new {product}.
{Benefit}, {intensifier}.
```

## Product names

Full product name as the band headline (`Google Pixel 10 Pro and Pro XL`), then the positioning
line beneath it (`Meet the new status pro.`). The name is the heading and does not take a period;
the positioning line does. Names use the brand's own capitalisation exactly and are never
abbreviated on first use.

## Empty, error, and success states

Three states, each with a job:

- **Error** explains what happened and what to do, in the interface's voice, without apologising
  and without vagueness. "Please enter a valid email address." not "Oops! Something's not right."
  System-level failures can be brief and non-specific because the user can't fix them:
  "Something went wrong." plus a `Try again` action.
- **Success** confirms in the past tense of the action taken. "You're all set." "Changes saved."
- **Empty** is an invitation, not a shrug. Say what the space is for and give the action that
  fills it.

## Footnotes and disclaimers

Any claim about availability, price, performance, compatibility, or AI output carries a numbered
footnote. This is a real convention of the register, not decoration — reproducing it is part of
what makes a page read as authentic rather than as an imitation.

The house phrasings:

```
Availability may vary by device, country, and language.
Check responses for accuracy.
Results for illustrative purposes and may vary.
Compatibility varies. Internet connection required. Available in select countries and to users 18+.
Product availability, features, and specifications vary by region, carrier, and device.
Terms apply.
All other trademarks are the property of their respective owners.
```

Superscript markers in the body (`<sup>1</sup>`) link down to the footnote list; each footnote links
back up. Use `*` for a general caveat and numbers for specific claims.

## Accessibility of copy

- Link text makes sense out of context. This is why generic "Learn more" needs a distinguishing
  accessible name.
- Headings form a real outline: one `<h1>`, then `<h2>` per section, `<h3>` per card. Do not skip
  levels to get a font size — use a class.
- Alt text describes what the image shows and why it is there, in a sentence, in the same plain
  voice: "A slightly opened Pixel 10 Pro Fold in Jade colour." Decorative imagery gets `alt=""`.
- Never rely on colour alone to carry meaning; the words have to say it too.

## A worked example

Weak, generic version:

> ## Revolutionary Smart Home Technology
> Unlock the power of seamless connectivity with our game-changing ecosystem of AI-powered devices
> designed to elevate your everyday living experience. Get Started Today!

Rewritten to the register:

> ###### Nest Cam
> ## More insight inside.
> 2K clarity and Gemini smarts, watching over the room that matters most.
>
> Learn more →
>
> <sup>1</sup> Subscription required for some features. Availability varies by region.

Note what changed: the eyebrow appeared, the headline dropped to three words and gained a period,
title case became sentence case, the paragraph became one concrete sentence, the button became a
text link, and the claim acquired a footnote.
