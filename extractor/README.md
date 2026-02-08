# Budget Speech Extractor

Web scraping module for extracting Singapore budget speeches from Parliament Hansard.

---

## Overview

This module scrapes budget speeches from the Singapore Parliament Official Reports (Hansard) and saves them as markdown files. It handles:
- Metadata extraction (date, speaker, title)
- Content parsing from HTML
- Section structure preservation
- Text formatting and cleanup

---

## Quick Start

```bash
# Extract all speeches from Hansard
poetry run python extractor/main.py
```

This will:
1. Read speech URLs from `speech_links.py`
2. Scrape each speech from Hansard
3. Save as markdown files in `output_markdown/`
4. Print progress and any errors

---

## Module Structure

```
extractor/
├── main.py              # Main extraction script
├── speech_links.py      # Budget speech URLs and metadata
├── utils_link.py        # Scraping utilities
└── README.md            # This file
```

---

## Speech Links Database

`speech_links.py` contains metadata for all budget speeches:

```python
budget_speech_links = {
    2025: {
        'minister': 'Lawrence Wong',
        'date': '2025-02-18',
        'link': 'https://sprs.parl.gov.sg/...'
    },
    2024: {
        'minister': 'Lawrence Wong',
        'date': '2024-02-16',
        'link': 'https://sprs.parl.gov.sg/...'
    },
    # ... back to 1960
}
```
---

## Scraping Details

### HTML Parsing

Uses BeautifulSoup4 to:
1. Extract speech metadata from Hansard HTML
2. Parse section headings (`<h2>`, `<h3>` tags)
3. Extract paragraph text
4. Clean and format content

### Text Cleanup

- Removes extra whitespace
- Preserves section structure
- Maintains paragraph breaks
- Handles special characters

### Error Handling

- Validates URLs before scraping
- Catches network errors
- Logs missing or failed speeches
- Continues on individual failures

---

## Adding New Speeches

When a new budget speech is delivered:

### 1. Find the Hansard URL

Visit: https://www.parliament.gov.sg/
- Navigate to Parliamentary Business → Official Reports
- Find the budget speech date
- Copy the speech URL

### 2. Update `speech_links.py`

Add new entry:

```python
budget_speech_links[2026] = {
    'minister': 'Lawrence Wong',  # Current Finance Minister
    'date': '2026-02-XX',         # Actual speech date
    'link': 'https://sprs.parl.gov.sg/search/#/fullreport?sittingdate=XX-XX-XXXX'
}
```

### 3. Run Extraction

```bash
poetry run python extractor/main.py
```

This will:
- Detect the new speech
- Scrape and save as `output_markdown/2026.md`
- Leave existing files unchanged

### 4. Verify Output

Check `output_markdown/2026.md`:
- Metadata correct (date, speaker, title)
- Sections properly formatted
- No missing content

### 5. Process and Analyze

```bash
# Convert to structured data
poetry run python processor/main.py

# Re-run analysis notebooks
poetry run jupyter notebook
```

---L parser)

Install via Poetry:
```bash
poetry install
```

---

## Related Documentation

- **[Processor README](../processor/README.md)** - Converting markdown to datasets
- **[Analysis README](../analysis/README.md)** - Using the extracted data
- **[Main README](../README.md)** - Project overview
