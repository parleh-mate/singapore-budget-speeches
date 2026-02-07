# Budget Speeches Dataset

This directory contains the processed Singapore budget speeches dataset in two formats:
- `budget_speeches.csv` - CSV format for easy viewing and analysis
- `budget_speeches.parquet` - Parquet format for efficient storage and querying

## Dataset Schema

| Column | Type | Description |
|--------|------|-------------|
| `sentence_id` | int | Unique identifier for each sentence |
| `year` | int | Year of the budget speech (1960-2025) |
| `section_title` | str | Section heading where the sentence appears |
| `sentence_order` | int | Order of sentence within the year (0-indexed) |
| `sentence_text` | str | The actual sentence text |
| `word_count` | int | Number of words in the sentence (excluding punctuation) |
| `char_count` | int | Number of characters in the sentence |

## Dataset Statistics

- **Total sentences**: 39,707
- **Total words**: 754,643
- **Average words per sentence**: 19.0
- **Years covered**: 1960 - 2025
- **Duplicates removed**: 39,782 (during processing)

## Data Quality

### Deduplication
The dataset has been deduplicated at the sentence level within each year. Duplicate sentences (exact text matches) are removed, keeping only the first occurrence based on sentence order. This handles cases where source markdown files contained repeated content.

Years with significant duplicates removed:
- 2011: 15,690 → 1,847 sentences (13,843 duplicates removed)
- 2009: 8,114 → 954 sentences (7,160 duplicates removed)
- 2007: 8,257 → 1,033 sentences (7,224 duplicates removed)
- 2004: 9,089 → 1,089 sentences (8,000 duplicates removed)

### Sentence Filtering
- Minimum sentence length: 20 characters
- Excludes very short fragments and artifacts
- Preserves full context for each sentence

## Year-by-Year Coverage

All years have consecutive sentence ordering (0-indexed) and unique sentence IDs:

| Year | Sentences | Sentence Order Range | Sentence ID Range |
|------|-----------|---------------------|-------------------|
| 1960 | 560 | 0-559 | 0-559 |
| 1961 | 715 | 0-714 | 560-1,274 |
| 1962 | 530 | 0-529 | 1,275-1,804 |
| 1963 | 463 | 0-462 | 1,805-2,267 |
| 1964 | 577 | 0-576 | 2,268-2,844 |
| 1965 | 382 | 0-381 | 2,845-3,226 |
| 1966 | 465 | 0-464 | 3,227-3,691 |
| 1967 | 517 | 0-516 | 3,692-4,208 |
| 1968 | 361 | 0-360 | 4,209-4,569 |
| 1969 | 518 | 0-517 | 4,570-5,087 |
| 1970 | 656 | 0-655 | 5,088-5,743 |
| 1971 | 655 | 0-654 | 5,744-6,398 |
| 1972 | 592 | 0-591 | 6,399-6,990 |
| 1973 | 510 | 0-509 | 6,991-7,500 |
| 1974 | 736 | 0-735 | 7,501-8,236 |
| 1975 | 255 | 0-254 | 8,237-8,491 |
| 1976 | 271 | 0-270 | 8,492-8,762 |
| 1977 | 254 | 0-253 | 8,763-9,016 |
| 1978 | 359 | 0-358 | 9,017-9,375 |
| 1979 | 292 | 0-291 | 9,376-9,667 |
| 1980 | 488 | 0-487 | 9,668-10,155 |
| 1981 | 467 | 0-466 | 10,156-10,622 |
| 1982 | 548 | 0-547 | 10,623-11,170 |
| 1983 | 552 | 0-551 | 11,171-11,722 |
| 1984 | 567 | 0-566 | 11,723-12,289 |
| 1985 | 390 | 0-389 | 12,290-12,679 |
| 1986 | 392 | 0-391 | 12,680-13,071 |
| 1987 | 450 | 0-449 | 13,072-13,521 |
| 1988 | 431 | 0-430 | 13,522-13,952 |
| 1989 | 326 | 0-325 | 13,953-14,278 |
| 1990 | 473 | 0-472 | 14,279-14,751 |
| 1991 | 447 | 0-446 | 14,752-15,198 |
| 1992 | 525 | 0-524 | 15,199-15,723 |
| 1993 | 626 | 0-625 | 15,724-16,349 |
| 1994 | 568 | 0-567 | 16,350-16,917 |
| 1995 | 469 | 0-468 | 16,918-17,386 |
| 1996 | 616 | 0-615 | 17,387-18,002 |
| 1997 | 495 | 0-494 | 18,003-18,497 |
| 1998 | 634 | 0-633 | 18,498-19,131 |
| 1999 | 529 | 0-528 | 19,132-19,660 |
| 2000 | 631 | 0-630 | 19,661-20,291 |
| 2001 | 480 | 0-479 | 20,292-20,771 |
| 2002 | 781 | 0-780 | 20,772-21,552 |
| 2003 | 814 | 0-813 | 21,553-22,366 |
| 2004 | 886 | 0-885 | 22,367-23,252 |
| 2005 | 673 | 0-672 | 23,253-23,925 |
| 2006 | 744 | 0-743 | 23,926-24,669 |
| 2007 | 991 | 0-990 | 24,670-25,660 |
| 2008 | 691 | 0-690 | 25,661-26,351 |
| 2009 | 888 | 0-887 | 26,352-27,239 |
| 2010 | 708 | 0-707 | 27,240-27,947 |
| 2011 | 912 | 0-911 | 27,948-28,859 |
| 2012 | 651 | 0-650 | 28,860-29,510 |
| 2013 | 722 | 0-721 | 29,511-30,232 |
| 2014 | 666 | 0-665 | 30,233-30,898 |
| 2015 | 979 | 0-978 | 30,899-31,877 |
| 2016 | 774 | 0-773 | 31,878-32,651 |
| 2017 | 565 | 0-564 | 32,652-33,216 |
| 2018 | 723 | 0-722 | 33,217-33,939 |
| 2019 | 875 | 0-874 | 33,940-34,814 |
| 2020 | 892 | 0-891 | 34,815-35,706 |
| 2021 | 886 | 0-885 | 35,707-36,592 |
| 2022 | 852 | 0-851 | 36,593-37,444 |
| 2023 | 726 | 0-725 | 37,445-38,170 |
| 2024 | 757 | 0-756 | 38,171-38,927 |
| 2025 | 779 | 0-778 | 38,928-39,706 |

## Usage Examples

### Python (Pandas)
```python
import pandas as pd

# Load CSV
df = pd.read_csv('output_processor/budget_speeches.csv')

# Load Parquet (more efficient)
df = pd.read_parquet('output_processor/budget_speeches.parquet')

# Query specific year
df_2011 = df[df['year'] == 2011]

# Search for keywords
inflation = df[df['sentence_text'].str.contains('inflation', case=False)]
```

### SQL (DuckDB)
```sql
-- Load and query
SELECT year, COUNT(*) as sentence_count
FROM 'output_processor/budget_speeches.parquet'
GROUP BY year
ORDER BY year;

-- Find duplicates (should be none)
SELECT sentence_text, COUNT(*) as count
FROM 'output_processor/budget_speeches.parquet'
WHERE year = 2011
GROUP BY sentence_text
HAVING count > 1;
```

## Generation

This dataset is generated by running:
```bash
poetry run python processor/main.py
```

The processor:
1. Reads markdown files from `output_markdown/`
2. Parses each file into sentences using spaCy
3. Deduplicates sentences within each year
4. Extracts metadata (word count, character count)
5. Outputs to CSV and Parquet formats
