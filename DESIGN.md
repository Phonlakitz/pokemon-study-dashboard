# Critical Visual Direction: Compact Nintendo DS Menu

The current highest-priority design goal is not decoration.

The highest-priority goal is proportion.

The dashboard must look like a compact Pokémon Nintendo DS menu screen, not a full-width modern web dashboard with Pokémon styling.

---

# Main Layout Proportion

The main dashboard shell must be centered and compact.

Desktop behavior:

* Do not stretch the dashboard across the full browser width.
* The dashboard should feel like a fixed handheld game screen.
* Recommended main shell max-width: 920px–980px.
* The inner content should be tight and menu-like.
* Avoid oversized empty space.
* Avoid wide SaaS dashboard proportions.

Mobile behavior:

* The layout must remain responsive.
* No horizontal overflow.
* Cards may stack vertically or reduce columns naturally.
* The DS feeling should remain even on small screens.

Key rule:

If the dashboard becomes wider and wider as the browser expands, the design is wrong.

---

# Top Panel Proportion

Trainer Profile and Weekly Progress should be compact.

They should not dominate the page.

Trainer Profile:

* Smaller avatar.
* Smaller title.
* Less vertical padding.
* Shorter panel height.
* Text block should feel like a DS menu label area, not a hero section.

Weekly Progress:

* Compact progress bar.
* Compact stat boxes.
* Less empty vertical space.
* Align visually with Trainer Profile.

The top section should support the daily quest cards, not overpower them.

---

# Daily Quest Card Proportion

Daily Quest Cards are the most important visual area.

They must resemble Pokémon DS menu cards.

Desktop target:

* 3 columns x 2 rows.
* Compact card size.
* Cards should be closer to the reference image, not long stretched web cards.
* Reduce grid gap.
* Reduce internal padding.
* Reduce card height.
* Avoid large blank areas.

Card structure:

* Tight colored header.
* Pokéball/day icon on the left.
* Day label beside the icon.
* Level badge on the right.
* White task list panel inside the card.
* Compact square checkboxes.
* Thin divider lines between task rows.
* Subtle Pokéball watermark in the lower-right of the task list.
* Footer row:

  * quest count on the left
  * READY/status on the right

Visual style:

* Stronger DS-like border.
* Subtle inner bevel.
* Slight shadow for tactile depth.
* Pixel-style labels.
* Pastel color panels.
* Avoid modern rounded card styling.
* Avoid excessive spacing.

Key rule:

The cards should feel like small selectable game menu panels, not large productivity dashboard cards.

---

# Bottom Navbar Proportion

The bottom navigation must look like a Nintendo DS game menu bar.

It should not look like a modern website tab bar.

Requirements:

* Short and compact height.
* Segmented rectangular buttons.
* Each button should feel like a physical DS menu button.
* Active tab should look selected or pressed.
* Inactive tabs should still have visible borders and depth.
* Icons should be readable and aligned.
* Text should be compact and pixel-style.
* The right Pokéball button should be separated from the main nav group.
* The Pokéball button should feel like its own larger DS control button.
* Avoid flat full-width navigation.

Recommended feel:

* Chunky border.
* Inner highlight.
* Inset shadow.
* Small pixel icon.
* Tight label spacing.

---

# Updated Day Color Direction

Use soft Pokémon DS-inspired pastel colors.

Monday:

Background: #FFF4B8
Border: #E3B647
Accent: #B88900

Tuesday:

Background: #FFD9E8
Border: #E99AB8
Accent: #B85078

Wednesday:

Background: #DDF5E3
Border: #7CCB95
Accent: #479A61

Thursday:

Background: #FFD9C2
Border: #E7A078
Accent: #B96534

Friday:

Background: #DDEEFF
Border: #7DAEEA
Accent: #3F78B8

Weekend:

Background: #E8D4F3
Border: #B889CC
Accent: #7B4A96

---

# Spacing Rule

Use compact Nintendo DS menu spacing.

Prefer:

* tight padding
* compact rows
* small labels
* clear borders
* strong panel separation

Avoid:

* large whitespace
* oversized hero sections
* full-width stretching
* modern web dashboard spacing
* large empty card interiors

---

# Golden Visual Test

After every UI change, compare the result to the Pokémon DS reference.

Ask:

1. Does it feel like a compact handheld game menu?
2. Are the daily cards small and balanced?
3. Is the bottom navbar segmented like a DS menu?
4. Is the dashboard centered instead of stretched?
5. Does it avoid looking like a modern SaaS dashboard?

If any answer is no, redesign the layout proportions before changing colors.
