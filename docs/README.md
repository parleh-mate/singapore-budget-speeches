# Singapore Budget Speeches Interactive Website

An interactive website for exploring 65 years of Singapore Budget Speeches (1960–2025).

🌐 **Live Website**: [jeremychia.github.io/singapore-budget-speeches](https://jeremychia.github.io/singapore-budget-speeches/)

---

## Features

### 📊 Full-Text Search
- Search across **39,704 sentences** from 66 budget speeches
- **Context expansion**: View surrounding sentences for better understanding
- **Topic classification**: Results tagged with policy areas (Defence, Education, Health, etc.)
- **Advanced filters**: By decade, minister, topic
- **Sorting options**: By relevance, year, minister, or topic

### 📈 Interactive Visualisations
- **Ministry Trends**: Stacked area chart showing policy focus over time
- **Minister Comparison**: Side-by-side analysis of 10 Finance Ministers
- **Language Analysis**: Speech complexity, sentence length, and readability trends

### 🎯 Key Statistics
- 66 Budget Speeches (1960–2025)
- 10 Finance Ministers
- 15 Policy Areas tracked
- 39,704 Searchable sentences

---

## Pages

| Page | Description |
|------|-------------|
| **Homepage** | Overview statistics, quick questions, entry points |
| **Search** | Full-text search with filters and context |
| **Ministries** | Budget allocation trends by ministry over time |
| **Ministers** | Comparison of 10 Finance Ministers |
| **Language** | Linguistic analysis and speech characteristics |
| **About** | Methodology, data sources, and project information |

---

## Technical Stack

### Frontend
- **HTML5** – Semantic markup
- **CSS3** – Custom properties, Grid, Flexbox
- **Vanilla JavaScript (ES6+)** – No framework dependencies
- **Plotly.js** – Interactive charts (via CDN)
- **Google Fonts** – Public Sans & Lato typography

### Data Architecture
- **Progressive loading** – Search index split into decade shards
- **Static JSON** – No backend required
- **GitHub Pages** – Static hosting

### Design System ("Civic Strength")
| Element | Value |
|---------|-------|
| Primary | `#0C2340` (Deep Navy) |
| Accent | `#C8102E` (Vibrant Red) |
| Neutral | `#9EA2A2` (Slate Gray) |
| Background | `#FAF9F7` (Warm Sand) |
| Headings | Public Sans |
| Body | Lato |

---

## Folder Structure

```
docs/
├── index.html              # Homepage
├── search.html             # Search page
├── ministries.html         # Ministry trends
├── ministers.html          # Minister comparison
├── language.html           # Linguistic analysis
├── about.html              # About & methodology
│
├── assets/
│   ├── style.css           # Main stylesheet
│   ├── search.js           # Search functionality
│   ├── ministries.js       # Ministry charts
│   ├── ministers.js        # Minister charts
│   └── language.js         # Language charts
│
└── data/
    ├── summary/
    │   ├── ministries_overview.json
    │   ├── ministers_overview.json
    │   └── yearly_overview.json
    │
    └── search-index/
        └── decades/
            ├── 1960s.json
            ├── 1970s.json
            ├── 1980s.json
            ├── 1990s.json
            ├── 2000s.json
            ├── 2010s.json
            └── 2020s.json
```

---

## Development

### Run Locally

```bash
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Regenerate Data

When new budget speeches are added:

```bash
# 1. Extract and process new speeches
poetry run python extractor/main.py
poetry run python processor/main.py

# 2. Run analysis notebooks to update CSVs

# 3. Export data for web
poetry run python analysis/export_for_web.py
```

The export script (`analysis/export_for_web.py`):
- Parses all markdown files in `output_markdown/`
- Extracts sentences with context
- Classifies topics using keyword matching
- Generates decade-sharded search indices
- Creates summary JSONs for charts

---

## Data Sources

| Source | Description |
|--------|-------------|
| `output_markdown/*.md` | Processed budget speech texts |
| `analysis/ministry_by_year.csv` | Ministry allocation by year |
| `analysis/minister_speech_statistics.csv` | Minister speech characteristics |
| `analysis/yearly_speech_statistics.csv` | Yearly linguistic statistics |

---

## Finance Ministers (1960–2026)

| Minister | Budget Years |
|----------|--------------|
| Goh Keng Swee | 1960–1965, 1968–1970 |
| Lim Kim San | 1966–1967 |
| Hon Sui Sen | 1971–1978 |
| Goh Chok Tong | 1979–1981 |
| Tony Tan | 1982–1985 |
| Richard Hu | 1986–2001 |
| Lee Hsien Loong | 2002–2006 |
| Tharman Shanmugaratnam | 2007–2015 |
| Heng Swee Keat | 2016–2021 |
| Lawrence Wong | 2022–2026 |

---

## Related Documentation

- **[Main README](../README.md)** – Project overview
- **[Analysis README](../analysis/README.md)** – Data analysis documentation
- **[Processor README](../processor/README.md)** – Data processing pipeline

---

## Contributing

Contributions welcome! Areas for improvement:
- **Visualisations**: New chart types, better interactions
- **Search**: Enhanced relevance ranking, more filters
- **Accessibility**: Screen reader support, keyboard navigation
- **Performance**: Optimisation, caching strategies

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make changes in `docs/` folder
4. Test locally
5. Submit a pull request

---

## Licence

This project is open source. See [LICENSE](../LICENSE) for details.
