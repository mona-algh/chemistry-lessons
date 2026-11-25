# DESIGN.md — بوابة دروس الكيمياء التفاعلية

## Design Read
Reading this as: Interactive Arabic Chemistry Lessons Portal & Tabbed Classroom Workspace for secondary students and teachers (كيمياء 2-1 وكيمياء 3), in a Soft Academic ("أكاديمي ناعم") visual language, dial **ENERGY 1 / RHYTHM 2 / MOTION 1**.

## Palette (R-29: 2 core colors + 1 accent + neutrals)
- **Light Mode (Default)**:
  - Page Background: `#F6F7F9` (warm academic off-white)
  - Card Surface: `#FFFFFF`
  - Muted Surface: `#ECEFF4`
  - Primary Text: `#182230` (contrast > 13:1 on white)
  - Secondary Text: `#4A586E` (contrast > 6.5:1 on white)
  - Core 1 (Academic Petrol/Teal): `#1D5A70` (active tabs, primary buttons, key headings)
  - Core 2 (Soft Slate Blue): `#497A8F` (secondary interactive states, structural borders)
  - Accent (Warm Ochre): `#925107` (focal badges: الفكرة الرئيسة, تنبيه التحصيلي, active timer)
- **Dark Mode (`[data-theme="dark"]`)**:
  - Page Background: `#0F1622`
  - Card Surface: `#162030`
  - Muted Surface: `#1E2B3F`
  - Primary Text: `#E9EFF6`
  - Secondary Text: `#A5B4C7`
  - Core 1: `#5DA7C2`
  - Core 2: `#3E7C94`
  - Accent: `#E5A84B`

## Purpose Decisions (R-31)
- **Why this color palette?**: Soft slate-teal and warm off-white reduce eye strain during classroom projection and long reading sessions, while warm ochre highlights focal pedagogical markers (main idea & Tahsili tips) without neon or purple AI-slop gradients.
- **Why this layout?**: Top bar hosts lesson context, classroom timer, whiteboard toggle, and theme switcher; 5 focused tabs segment pedagogy (الأهداف والتركيز، المحتوى التفاعلي، استراتيجيات وربط، تقويم تكويني، التقويم النهائي والتحصيلي) to match the user's request for tabs and keep each view scannable.
- **Why this typography?**: `Tajawal` with `IBM Plex Sans Arabic` fallback for crisp RTL Arabic readability, paired with `tabular-nums` and isolated `dir="ltr"` chemical equation spans so subscripts/superscripts never scramble in RTL context.
- **Why these borders/shadows?**: Subtle 1px structural borders (`#DCE2EA` / `#28374D`) and minimal elevation only on the floating whiteboard toolbar and sticky header, avoiding uniform heavy drop shadows.
- **Why these simulations & icons?**: Custom interactive HTML5 Canvas/SVG chemistry models (particle motion, phase diagram, gas piston laws, galvanic cell flow, electrolysis) directly visualize lesson concepts instead of decorative stock icons.
