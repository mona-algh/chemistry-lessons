# DESIGN.md : بوابة دروس الكيمياء التفاعلية

## Design Read
Interactive Arabic Chemistry Lessons Portal & Fixed Slide-Deck Classroom Workspace for secondary students and teachers (كيمياء 2-1 وكيمياء 3), in a cheerful bright classroom visual language ("مشرق ومبهج"), dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

## Palette (R-29: 2 core colors + 1 accent + neutrals)
- **Light Mode (Default)**:
  - Page Background: `#F5F7FC` (warm sunlit off-white)
  - Stage Backdrop: `#E9EEF8` (soft airy sky backdrop behind slide cards)
  - Card Surface: `#FFFFFF`
  - Muted Surface: `#EEF2FA`
  - Primary Text: `#18223C` (contrast > 14:1 on white)
  - Secondary Text: `#4A5674` (contrast > 6.8:1 on surface and bg)
  - Core 1 (Vibrant Cobalt Blue): `#1D5FD6` (active tabs, primary buttons, key headings)
  - Core 2 (Fresh Emerald Green): `#0B7A43` (success states, interactive confirmations, secondary badges)
  - Accent (Warm Coral Amber): `#B44308` (focal highlights: الفكرة الرئيسة, بطاقة الخروج, active simulation pills)
- **Dark Mode (`[data-theme="dark"]`)**:
  - Page Background: `#0E172A`
  - Stage Backdrop: `#09101E`
  - Card Surface: `#15213B`
  - Muted Surface: `#1D2C4D`
  - Primary Text: `#F0F5FF`
  - Secondary Text: `#A9B8D8`
  - Core 1: `#5BA4FF`
  - Core 2: `#4FD18B`
  - Accent: `#FF9A5C`

## Purpose Decisions
- **Why this color palette?**: Bright sunlit surfaces with cobalt blue, emerald green, and warm coral replace muted gray-slate tones so classroom projection feels energetic, clear, and inviting while keeping strict WCAG AA >= 4.5:1 legibility in both Light and Dark mode.
- **Why this layout?**: Full-height fixed slide deck (`100vh`) with wide smartboard-ready stage (`max-width: 1360px`), 40-minute classroom timer, floating whiteboard pen dock, edge corner navigation arrows, and 3 streamlined sections (`الأهداف والتركيز`, `تسلسل الدرس والتفاعل`, `بطاقة الخروج`).
- **Why this pedagogical sequence?**: Interleaves each concept immediately with its animated experiment, learning strategy, real-life link, and formative question before advancing to the next concept, culminating in `بطاقة الخروج` (Tahsili tips & exit questions).
- **Why live animations?**: All 10 lessons feature live HTML5 Canvas / SVG chemistry animations (Graham diffusion tube, IMF boiling/springs, kinetic states & viscosity race, phase diagram chamber, animated piston gas laws, ideal gas particle expansion, Haber volume reaction, galvanic electron/ion flow, battery & cathodic protection, and electrolysis bubbles/plating).
