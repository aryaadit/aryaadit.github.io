# AGENTS.md

Rules I follow when working in this folder.

## Never publish
- Phone number, home address, personal email
- Grades, salary, visa status, date of birth
- Anything in `private/`: add it to `.gitignore` first
- Original files that contain personal data (the CV PDF, the original photo with GPS metadata). Only publish cleaned copies.

## Ask me first
- Before any git push or change on GitHub
- Before deleting or overwriting a file

## Style
- Plain HTML and CSS, clean and minimal
- Vibe: entrepreneur portfolio, professional and casual. Lead with what I'm building; the CV is a compact background section, not the headline.
- Colors: dark charcoal with a warm gold accent, matching Palate (no Columbia branding). Font: Plus Jakarta Sans.
- Navigation: Building, Background, Beyond work, All projects, Contact
- Portfolio as a gallery page that links to each project

## Structure
- `index.html` at the root; site CSS in `assets/css/`, images in `assets/img/`
- Each project lives in its own folder under `projects/`, linked from the gallery at `projects/index.html`
- Local-only originals (CV, original photos) go in `private/`, which is gitignored
- Never commit other people's personal data (for example raw resumes)

## When I finish
- Tell you what I changed and what I skipped
