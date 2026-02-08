# Interactive Website (Coming Soon)

This folder will contain the interactive website for exploring Singapore budget speeches.

---

## Status

**🚧 In Development** - Website not yet deployed

**Deployment Target**: GitHub Pages
**URL (planned)**: `https://jeremychia.github.io/singapore-budget-speeches/`

---

## Overview

Progressive disclosure website with three reading paths:

| Path | Time | Target Audience | Content |
|------|------|----------------|---------|
| **Storyteller** | 5 min | General public | Key insights, narrative |
| **Explorer** | 15 min | Policy enthusiasts | Interactive charts |
| **Researcher** | 30+ min | Analysts, academics | Full data access |

---

## Planned Pages

### 1. Homepage (`index.html`)
- Hero section with key statistics
- Three reading paths
- Recent insights carousel
- Quick search

### 2. Search Page (`search.html`)
- Search 40,123 sentences
- Filters: year, minister, ministry, keyword
- Context display with highlighting
- Export results

### 3. Ministries Page (`ministries.html`)
- Stacked area chart (1960-2025)
- Ministry selector
- Crisis overlays
- Trend analysis

### 4. Ministers Page (`ministers.html`)
- Side-by-side comparison
- Policy focus heatmap
- Speech characteristics
- Timeline view

### 5. Language Page (`language.html`)
- Readability trends
- Sentence complexity
- Vocabulary evolution
- Minister style comparison

### 6. About Page (`about.html`)
- Methodology
- Data sources
- Classification accuracy
- Contact information

---

## Design System

### Colors
- **Primary**: `#003D82` (Singapore blue)
- **Accent**: `#C41E3A` (Singapore red)
- **Background**: `#F8F9FA`
- **Text**: `#212529`
- **Muted**: `#6C757D`

### Typography
- **Headings**: Inter (sans-serif)
- **Body**: Source Sans Pro
- **Code**: Fira Code

### Layout
- **Max width**: 1200px
- **Grid**: 12 columns
- **Breakpoints**: 768px (tablet), 1024px (desktop)

---

## Technical Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript (ES6+)** - Interactive features
- **D3.js** - Data visualizations
- **Chart.js** - Statistical charts

### Data
- **JSON files** - Exported from CSV datasets
- **Static hosting** - GitHub Pages
- **No backend** - Client-side only

### Build Tools
- **Rollup/Webpack** - Module bundling (optional)
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting

---

## Data Export Pipeline

### Convert CSV to JSON

```python
import pandas as pd
import json

# Ministry by year
df = pd.read_csv('analysis/ministry_by_year.csv', index_col=0)
data = {
    'years': df.index.tolist(),
    'ministries': df.columns.tolist(),
    'data': df.values.tolist()
}
with open('docs/data/ministry_by_year.json', 'w') as f:
    json.dump(data, f)

# Sentences (sampled for demo)
df_sentences = pd.read_parquet('output_processor/2020.parquet')
sample = df_sentences.sample(100).to_dict('records')
with open('docs/data/sample_sentences.json', 'w') as f:
    json.dump(sample, f)
```

### JSON Files Needed

| File | Source | Description |
|------|--------|-------------|
| `ministry_by_year.json` | `analysis/ministry_by_year.csv` | Ministry trends |
| `ministry_by_minister.json` | `analysis/ministry_by_minister.csv` | Minister focus |
| `yearly_stats.json` | `analysis/yearly_speech_statistics.csv` | Linguistic data |
| `minister_stats.json` | `analysis/minister_speech_statistics.csv` | Minister comparison |
| `sentences_sample.json` | `output_processor/*.parquet` | Sample for search demo |
| `crisis_data.json` | Calculated | Crisis response data |

---

## Development Roadmap

### Phase 1: Data Preparation ✅
- [x] Extract speeches from Hansard
- [x] Process to structured data
- [x] Run comprehensive analysis
- [x] Generate CSV outputs

### Phase 2: Design & Planning ✅
- [x] Define user personas
- [x] Create information architecture
- [x] Design page wireframes
- [x] Write design specification

### Phase 3: Implementation (In Progress)
- [ ] Set up docs/ folder structure
- [ ] Export data to JSON
- [ ] Build homepage with three paths
- [ ] Create interactive charts (D3.js)
- [ ] Implement search functionality
- [ ] Add ministry trend visualizations
- [ ] Build minister comparison page
- [ ] Create language analysis charts

### Phase 4: Polish & Deploy
- [ ] Mobile responsive design
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Deploy to GitHub Pages
- [ ] Set up custom domain (optional)

---

## Folder Structure (Planned)

```
docs/
├── index.html              # Homepage
├── search.html             # Search page
├── ministries.html         # Ministry trends
├── ministers.html          # Minister comparison
├── language.html           # Linguistic analysis
├── about.html              # About & methodology
│
├── css/
│   ├── styles.css          # Main stylesheet
│   ├── charts.css          # Chart-specific styles
│   └── responsive.css      # Mobile styles
│
├── js/
│   ├── main.js             # Core functionality
│   ├── search.js           # Search implementation
│   ├── charts.js           # Chart configurations
│   └── utils.js            # Helper functions
│
├── data/
│   ├── ministry_by_year.json
│   ├── ministry_by_minister.json
│   ├── yearly_stats.json
│   ├── minister_stats.json
│   └── sentences_sample.json
│
├── img/
│   ├── logo.png
│   ├── ministers/          # Minister photos (if available)
│   └── icons/              # UI icons
│
└── lib/
    ├── d3.min.js           # D3.js for visualizations
    └── chart.min.js        # Chart.js for charts
```

---

## Key Features

### 1. Smart Search
- Full-text search across 40k+ sentences
- Autocomplete suggestions
- Filter by year, minister, ministry
- Highlight matches in context
- Export results to CSV

### 2. Interactive Charts
- Zoom and pan on time series
- Hover tooltips with details
- Toggle ministries on/off
- Crisis event overlays
- Responsive to screen size

### 3. Progressive Disclosure
- Start with high-level insights
- Drill down to details
- "Learn more" expansions
- Breadcrumb navigation
- Print-friendly views

### 4. Accessibility
- ARIA labels for screen readers
- Keyboard navigation
- High contrast mode
- Alt text for charts
- Semantic HTML

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| First Load | < 2s | Including all assets |
| Time to Interactive | < 3s | Usable state |
| Chart Render | < 500ms | D3.js animations |
| Search Response | < 200ms | Client-side filtering |
| Mobile Score | > 90 | Lighthouse audit |

---

## Content Guidelines

### Writing Style
- **Clarity**: Simple language, no jargon
- **Brevity**: Concise explanations
- **Context**: Explain "why it matters"
- **Evidence**: Link to source data

### Visualization Principles
- **Simplicity**: One message per chart
- **Color**: Consistent palette
- **Labels**: Clear axis labels and legends
- **Annotations**: Highlight key events

---

## Deployment Steps

### 1. Enable GitHub Pages

In repository settings:
- Source: `main` branch
- Folder: `/docs`
- Custom domain: (optional)

### 2. Test Locally

```bash
cd docs
python -m http.server 8000
# Visit http://localhost:8000
```

### 3. Verify Deployment

- Check `https://jeremychia.github.io/singapore-budget-speeches/`
- Test all pages and features
- Validate responsive design
- Run accessibility audit

### 4. Update README

Add deployment link to main README.

---

## Maintenance

### Adding New Year

When new budget speech is delivered:

1. **Update data**:
   ```bash
   poetry run python extractor/main.py
   poetry run python processor/main.py
   # Re-run analysis notebooks
   ```

2. **Export new JSON**:
   ```python
   # Run data export script
   python scripts/export_to_json.py
   ```

3. **Update website**:
   - Refresh year range in text
   - Update statistics
   - Re-deploy

### Analytics (Optional)

Add Google Analytics or similar:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
```

---

## Related Documentation

- **[Main README](../README.md)** - Project overview
- **[WEBSITE_STRATEGY.md](../WEBSITE_STRATEGY.md)** - Complete design document
- **[Analysis README](../analysis/README.md)** - Data source documentation
- **[Processor README](../processor/README.md)** - Data preparation

---

## Contributing

Want to help build the website?

### Areas for Contribution
- **Design**: UI/UX improvements
- **Visualizations**: New chart types
- **Features**: Search enhancements, filters
- **Content**: Writing, explanations
- **Testing**: Bug reports, usability feedback

### How to Contribute
1. Fork the repository
2. Create feature branch
3. Make changes in `docs/` folder
4. Test locally
5. Submit pull request

---

## Contact

For website-related questions:
- **GitHub Issues**: Feature requests, bugs
- **Pull Requests**: Code contributions
- **Email**: Project maintainer

---

**Status**: Planning complete, implementation starting soon
**Target Launch**: Q2 2026
**Preview**: Not yet available
