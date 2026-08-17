# Construction OS — Design System & Visual Foundation

## Design Philosophy
> **Simple. Calm. Trustworthy. Transparent. Human.**

Construction OS balances high utility with a calm visual tone. It avoids flashy gimmicks, dark purple accents, or dense enterprise dashboard clutter.

## Color Palette Tokens

| Category | Token | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | `slate-900` | `#0F172A` | Primary text, header bars, key structural elements |
| **Brand Accent** | `blue-600` | `#2563EB` | Interactive buttons, primary calls to action |
| **Background** | `slate-50` | `#F8FAFC` | Calm background surface |
| **Surface Cards** | `white` | `#FFFFFF` | Content card containers, elevated modals |
| **Borders** | `slate-200` | `#E2E8F0` | Subtle clean card borders |
| **Text Primary** | `slate-800` | `#1E293B` | Main readable body content |
| **Text Muted** | `slate-500` | `#64748B` | Labels, timestamps, secondary hints |
| **Success State** | `emerald-600` | `#059669` | Completed milestones, verified badges, within budget |
| **Warning State** | `amber-600` | `#D97706` | Pending approvals, upcoming milestone alerts |
| **Error State** | `rose-600` | `#E11D48` | Budget overrun, rejected order requests |

## Typography
- **Primary Sans**: `Inter`, `Plus Jakarta Sans` or system UI font stack (`system-ui`, `-apple-system`, `sans-serif`).
- **Financial / Numbers**: Tabular numbers for clear budget alignment (`font-variant-numeric: tabular-nums`).

## Component Guidelines
1. **Cards**: Generous padding (`p-5` / `p-6`), rounded corners (`rounded-xl`), subtle border (`border border-slate-200`), clean shadow.
2. **Buttons**: Clear visual hierarchy (Primary blue/navy, Secondary outline, Ghost neutral). Accessible touch target height (min 44px on mobile).
3. **Badges**: Explicit pill style for statuses (`VERIFIED`, `PENDING`, `IN_PROGRESS`, `COMPLETED`).
4. **Timelines**: Vertically aligned progress timeline with clear node states (Done ✓, Current ●, Upcoming ○).
