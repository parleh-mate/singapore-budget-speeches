# Processed Budget Speech Data

Sentence-level structured datasets in Parquet format, ready for analysis.

---

## Overview

This folder contains 66 Parquet files (one per year), each with sentence-level data extracted from budget speeches. Total: **40,123 sentences** from 1960-2025.

---

## Files

### Naming Convention
Files are named by year: `YYYY.parquet`

Examples:
- `1960.parquet` - 560 sentences from first budget speech
- `2025.parquet` - 778 sentences from most recent speech

### Coverage
- **Total files**: 66
- **Year range**: 1960-2025
- **Total sentences**: 40,123
- **Total size**: ~2-3 MB (highly compressed)

---

## Schema

Each Parquet file has the same structure:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `sentence_id` | int | Unique sentence identifier | 12345 |
| `year` | int | Budget speech year | 2020 |
| `speech_date` | str | Date of speech (YYYY-MM-DD) | "2020-02-18" |
| `primary_speaker` | str | Finance Minister name | "Heng Swee Keat" |
| `speech_title` | str | Speech title | "Budget Statement" |
| `section_title` | str | Section heading | "Healthcare Subsidies" |
| `sentence_order` | int | Position in document | 42 |
| `sentence_text` | str | Full sentence text | "We will enhance..." |
| `word_count` | int | Words (excl. punctuation) | 24 |
| `char_count` | int | Characters in sentence | 145 |
| `decade` | int | Decade (1960, 1970, etc.) | 2020 |
| `era` | str | Era classification | "Contemporary" |

### Era Classifications

| Era | Years | Description |
|-----|-------|-------------|
| **Early Years** | 1960-1979 | Post-independence development |
| **Growth Era** | 1980-1999 | Economic transformation |
| **Modern Era** | 2000-2019 | Mature economy |
| **Contemporary** | 2020+ | Recent budgets |

---

## File Statistics

### Size by Year

| Period | Files | Avg Sentences | Avg Size |
|--------|-------|---------------|----------|
| 1960s | 9 | 490 | 35 KB |
| 1970s | 10 | 520 | 38 KB |
| 1980s | 10 | 515 | 40 KB |
| 1990s | 10 | 580 | 45 KB |
| 2000s | 10 | 710 | 52 KB |
| 2010s | 10 | 800 | 58 KB |
| 2020s | 7 | 785 | 56 KB |

### Largest Files

| Year | Sentences | Size | Minister |
|------|-----------|------|----------|
| 2012 | 1,221 | 89 KB | Tharman |
| 2018 | 1,015 | 74 KB | Heng |
| 2019 | 987 | 72 KB | Heng |

### Smallest Files

| Year | Sentences | Size | Minister |
|------|-----------|------|----------|
| 1965 | 382 | 26 KB | Goh Keng Swee |
| 1968 | 361 | 25 KB | Goh Keng Swee |
| 1960 | 560 | 35 KB | Goh Keng Swee |

---

## Usage

### Load Single Year

```python
import pandas as pd

# Load 2020 budget speech
df = pd.read_parquet('output_processor/2020.parquet')
print(df.head())
print(f"Total sentences: {len(df)}")
```

### Load All Years

```python
import pandas as pd
from pathlib import Path

# Load all Parquet files
files = sorted(Path('output_processor').glob('*.parquet'))
dfs = [pd.read_parquet(f) for f in files]
df_all = pd.concat(dfs, ignore_index=True)

print(f"Total sentences: {len(df_all):,}")
print(f"Year range: {df_all['year'].min()}-{df_all['year'].max()}")
```

### Search for Keywords

```python
# Find all sentences mentioning "healthcare"
healthcare = df_all[
    df_all['sentence_text'].str.contains('healthcare', case=False)
]

print(f"Found {len(healthcare)} sentences")
print(healthcare[['year', 'primary_speaker', 'sentence_text']].head())
```

### Aggregate by Year

```python
# Average sentence length by year
yearly_stats = df_all.groupby('year').agg({
    'word_count': 'mean',
    'sentence_text': 'count'
}).rename(columns={'sentence_text': 'total_sentences'})

print(yearly_stats.tail())
```

### Aggregate by Minister

```python
# Total sentences by minister
minister_stats = df_all.groupby('primary_speaker').agg({
    'sentence_text': 'count',
    'word_count': 'mean'
}).rename(columns={
    'sentence_text': 'total_sentences',
    'word_count': 'avg_word_count'
})

print(minister_stats.sort_values('total_sentences', ascending=False))
```

### Filter by Era

```python
# Modern era speeches (2000-2019)
modern = df_all[df_all['era'] == 'Modern Era']
print(f"Modern era: {len(modern):,} sentences")

# Contemporary speeches (2020+)
contemporary = df_all[df_all['era'] == 'Contemporary']
print(f"Contemporary: {len(contemporary):,} sentences")
```

---

## Data Quality

### Sentence Tokenization

Uses spaCy's English model (`en_core_web_sm`) for accurate sentence splitting:

**Handles correctly**:
- Abbreviations: "Mr.", "Dr.", "Hon."
- Numbers: "S$10.5 billion"
- Acronyms: "CPF", "GST", "HDB"
- Decimal points: "3.5% growth"
- Multiple punctuation: "...and so on."

**Edge cases**:
- Very long sentences (>100 words) kept intact
- Bullet points treated as separate sentences
- Parliamentary interjections preserved

### Word Counting

Counts **content words only**, excluding:
- Punctuation marks
- Standalone numbers (in most cases)
- Special characters

Formula: `len([word for word in text.split() if word.isalnum()])`

---

## Data Pipeline

This folder is the **second stage** of the pipeline:

```
1. output_markdown/
   └─> 66 markdown files (raw speeches)

2. output_processor/ (You are here)
   └─> 66 Parquet files (structured sentences)

3. analysis/
   └─> Jupyter notebooks + CSV outputs
```

### Creation Process

Files created by running:

```bash
poetry run python processor/main.py
```

This:
1. Reads markdown files from `output_markdown/`
2. Extracts metadata (date, speaker, title)
3. Splits text into sentences (spaCy)
4. Counts words and characters
5. Adds derived features (decade, era)
6. Saves as Parquet

---

## Updating Data

### Add New Year

When new budget speech is delivered:

1. **Extract speech**:
   ```bash
   poetry run python extractor/main.py
   ```

2. **Process to Parquet**:
   ```bash
   poetry run python processor/main.py
   ```

3. **Verify new file**: Check `output_processor/YYYY.parquet`

4. **Validate**:
   ```python
   df = pd.read_parquet('output_processor/2026.parquet')
   assert len(df) > 0
   assert df['year'].iloc[0] == 2026
   ```


---

## Sample Data

### Example Sentence Record

```python
{
    'sentence_id': 12345,
    'year': 2020,
    'speech_date': '2020-02-18',
    'primary_speaker': 'Heng Swee Keat',
    'speech_title': 'Budget Statement',
    'section_title': 'Supporting Businesses',
    'sentence_order': 342,
    'sentence_text': 'We will provide $4 billion to help businesses transform and grow.',
    'word_count': 11,
    'char_count': 68,
    'decade': 2020,
    'era': 'Contemporary'
}
```

### Example Queries

**Longest sentence**:
```python
longest = df_all.loc[df_all['word_count'].idxmax()]
print(f"Year: {longest['year']}")
print(f"Words: {longest['word_count']}")
print(f"Text: {longest['sentence_text'][:100]}...")
```

**Shortest sentence**:
```python
shortest = df_all.loc[df_all['word_count'].idxmin()]
print(f"Year: {shortest['year']}")
print(f"Words: {shortest['word_count']}")
print(f"Text: {shortest['sentence_text']}")
```

**Most common words** (across all years):
```python
from collections import Counter

all_words = []
for text in df_all['sentence_text']:
    all_words.extend(text.lower().split())

word_counts = Counter(all_words)
print(word_counts.most_common(20))
```

---

## Schema Evolution

If schema changes in future versions:

### Version 1.0 (Current)
- 12 columns
- Era classification (4 eras)
- Basic sentence metrics

### Potential Future Additions
- `sentiment_score` - Sentiment analysis
- `ministry_topic` - Classified topic (Defence, Health, etc.)
- `readability_score` - Flesch reading ease
- `named_entities` - Extracted entities (JSON)

---

## Related Documentation

- **[Processor README](../processor/README.md)** - How these files are created
- **[Analysis README](../analysis/README.md)** - Using this data for analysis
- **[Output Markdown README](../output_markdown/README.md)** - Source data
- **[Main README](../README.md)** - Project overview
