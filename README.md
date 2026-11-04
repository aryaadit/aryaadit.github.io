# aryaadit.github.io

Personal site for Adit Arya. Plain HTML and CSS, no build step. Served by GitHub Pages at https://aryaadit.github.io.

## Structure

```
.
├── index.html            Home: education, experience, additional information
├── assets/
│   ├── css/style.css     Site styles (Columbia blue)
│   └── img/portrait.jpg  Web copy of the portrait, metadata stripped
├── projects/
│   ├── index.html        Projects gallery
│   ├── blackrock-hackathon/            BlackRock iResume dashboard (2017)
│   ├── cs4154-alpha/                   Unity WebGL game, CS 4154 alpha
│   ├── cs4154-throwaway/               Unity WebGL game, CS 4154
│   └── cs4621-first-person-explorer/   WebGL final project, CS 4621
├── AGENTS.md             Rules for working in this repo
└── private/              Local only, gitignored (CV, original photo)
```

## Working on it

Open `index.html` in a browser. To test the projects (which fetch local data files), serve the folder:

```
python3 -m http.server 8000
```

## Privacy

See [AGENTS.md](AGENTS.md). Contact details, the CV and original photos are kept in `private/` and are never committed.
