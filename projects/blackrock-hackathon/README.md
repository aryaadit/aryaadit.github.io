# BlackRock iResume

Summer 2017 BlackRock intern hackathon project. An interactive dashboard of resume trends: geographic distribution, schools, GPAs, programming languages and common keywords.

## What is here

- `index.html`, `style.css`, `js/`: the dashboard (D3, Highcharts).
- `*.csv`, `data/`: aggregated counts the dashboard reads. No individual resumes.
- `main.py`, `pdf2txt.py`: the pipeline that turned a folder of resume PDFs into those aggregate counts.
- `programming_languages`, `technical_keywords`, `additional_stopwords`, `schools`, `schools_small`: word lists used by the pipeline.

## Not included

The source resumes (PDFs and text extracts) belonged to other people and contained personal contact details. They have been removed from the repository, so `main.py` will not run as-is. The dashboard still works because it only needs the aggregated files.

## Run

From the repository root: `python3 -m http.server 8000`, then open `/projects/blackrock-hackathon/`.
