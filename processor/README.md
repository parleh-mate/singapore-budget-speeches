# Budget Speech Processor

Convert markdown budget speeches to structured CSV/Parquet format for sentence-level topical analysis.

## Features

- **Accurate sentence tokenization** using spaCy (handles abbreviations, numbers, acronyms)
- **Metadata extraction** from markdown headers (date, speaker, title)
- **Section tracking** preserves document structure
- **Multiple output formats** (CSV and Parquet)
- **Derived features** (decade, era classifications)
- **Modular design** for easy integration

## Installation

```bash
# Install dependencies
pip install spacy pandas pyarrow

# Download spaCy model
python -m spacy download en_core_web_sm
```

## Quick Start

### Command Line

```bash
# Run the processor from the project root
python -m processor.main
```

This will:
1. Process all markdown files in `output_markdown/`
2. Generate `budget_speeches.csv` and `budget_speeches.parquet`
3. Print progress and summary statistics

### Python API

```python
from processor import process_all_speeches

# Basic usage
df = process_all_speeches()

# Custom paths
df = process_all_speeches(
    markdown_dir="custom_markdown",
    output_csv="custom_output.csv",
    output_parquet="custom_output.parquet"
)
```

## Output Schema

Each row represents one sentence with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| `sentence_id` | int | Unique sentence identifier |
| `year` | int | Budget speech year |
| `speech_date` | str | Date of speech (YYYY-MM-DD) |
| `primary_speaker` | str | Main speaker name |
| `speech_title` | str | Speech title |
| `section_title` | str | Section heading |
| `sentence_order` | int | Sentence position in document |
| `sentence_text` | str | Full sentence text |
| `word_count` | int | Words in sentence (excl. punctuation) |
| `char_count` | int | Characters in sentence |
| `decade` | int | Decade (1960, 1970, etc.) |
| `era` | str | Era classification |

### Era Classifications

- **Early Years (1960-1979)**: Post-independence development
- **Growth Era (1980-1999)**: Economic transformation
- **Modern Era (2000-2019)**: Mature economy
- **Contemporary (2020+)**: Recent budgets

## Module Structure

```
processor/
├── __init__.py       # Package exports
├── parser.py         # SpeechParser class
├── writer.py         # Output functions
├── processor.py      # Batch processing
├── main.py           # CLI entry point
└── README.md         # Documentation
```

## API Reference

### SpeechParser

```python
from processor import SpeechParser

parser = SpeechParser()
sentences = parser.parse_file(Path("output_markdown/2020.md"))
# Returns: List[Dict] with sentence data
```

**Methods:**
- `parse_file(file_path)` - Parse single markdown file
- `extract_metadata(content)` - Extract header metadata
- `extract_sections_and_text(content)` - Extract sections
- `split_into_sentences(text)` - spaCy sentence tokenization
- `count_words(text)` - Count words excluding punctuation

### Writers

```python
from processor import write_to_csv, write_to_parquet
from processor.writer import prepare_dataframe

# Prepare data
df = prepare_dataframe(all_sentences)

# Write outputs
csv_path = write_to_csv(df, "output.csv")
parquet_path = write_to_parquet(df, "output.parquet")
```

## Analysis Examples

```python
import pandas as pd

# Load data
df = pd.read_csv("budget_speeches.csv")

# Filter by year
df_2020 = df[df['year'] == 2020]

# Search for keywords
productivity = df[df['sentence_text'].str.contains('productivity', case=False)]

# Average sentence length by decade
df.groupby('decade')['word_count'].mean()

# Top speakers by sentence count
df['primary_speaker'].value_counts().head()

# Era comparisons
df.groupby('era')['word_count'].agg(['mean', 'median', 'std'])
```

## Performance

- **Processing time**: ~2-3 minutes for 66 files (1960-2025)
- **Output size**: ~5-10 MB CSV, ~2-3 MB Parquet
- **Memory usage**: Efficient streaming processing

## Requirements

- Python 3.7+
- spacy >= 3.0
- pandas >= 1.0
- pyarrow (for Parquet support)

## License

See project LICENSE file.
