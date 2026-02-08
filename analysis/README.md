# Budget Speech Analysis

Comprehensive analysis of Singapore budget speeches using Jupyter notebooks.

---

## Overview

This folder contains in-depth analysis of 40,123 sentences from 66 budget speeches (1960-2025), including:
- Ministry topic classification across 15 policy areas
- Finance Minister comparison and style analysis
- Linguistic evolution (readability, complexity)
- Crisis response patterns
- Speech timing characteristics

---

## Notebooks

### 1. Ministry Topic Analysis
**File**: `ministry_topic_analysis.ipynb`
**Coverage**: All 66 speeches, 40,123 sentences

**Key Analyses**:
- Ministry classification using weighted keyword matching
- Topic distribution over time (stacked area charts, heatmaps)
- Minister preferences for policy areas
- Crisis response patterns (1985, 1997, 2008, COVID-19)
- Emerging vs declining topics
- Speech diversity metrics (Shannon entropy)

**Exported Data**:
- `ministry_by_year.csv` - Ministry % by year (1960-2025)
- `ministry_by_minister.csv` - Policy focus by Finance Minister
- `ministry_by_decade.csv` - Decade-level aggregation
- `ministry_topic_statistics.csv` - Comprehensive ministry stats

### 2. Speech Analysis
**File**: `speech_analysis.ipynb`

**Key Analyses**:
- Speech length trends over time
- Sentences per speech by minister
- Word count distributions
- Minister-specific statistics

**Exported Data**:
- `yearly_speech_statistics.csv` - Statistics by year
- `minister_speech_statistics.csv` - Statistics by minister

### 3. Speech Timing Analysis
**File**: `speech_timing_analysis.ipynb`

**Key Analyses**:
- Budget speech dates and day-of-week patterns
- Month and timing trends
- Correlation with speech characteristics

**Exported Data**:
- `minister_timing_stats.csv` - Timing by minister
- `timing_characteristics_combined.csv` - Comprehensive timing data
- `correlation_matrix.csv` - Correlation analysis

---

## Minister Comparison

| Minister | Period | Speeches | Top 3 Focus Areas | Defining Policy |
|----------|--------|----------|-------------------|----------------|
| **Goh Keng Swee** | 1959-1984 | 26 | Defence (25.2%)<br>Finance (16.8%)<br>Education (5.4%) | Economic Foundation |
| **Tony Tan** | 1983-1985 | 3 | Defence (23.1%)<br>Finance (18.2%)<br>Education (5.1%) | Recession Response |
| **Richard Hu** | 1985-2001 | 17 | Finance (19.3%)<br>Defence (18.4%)<br>Trade (10.1%) | Fiscal Prudence |
| **Lee Hsien Loong** | 2001-2007 | 7 | Finance (15.7%)<br>Defence (14.2%)<br>Education (7.8%) | Knowledge Economy |
| **Tharman** | 2007-2015 | 9 | Finance (14.3%)<br>Defence (11.8%)<br>Manpower (9.2%) | Workfare Pioneer |
| **Heng Swee Keat** | 2015-2021 | 7 | Finance (12.8%)<br>Manpower (9.8%)<br>Defence (9.4%) | Pioneer Gen Package |
| **Lawrence Wong** | 2021-2025 | 5 | Finance (11.9%)<br>Defence (8.1%)<br>Manpower (8.4%) | Sustainability Push |

---

### Linguistic Trends

**Sentence Complexity**
- 1960s: 21.0 words/sentence (formal, directive)
- 2020s: 18.1 words/sentence (accessible, inclusive)
- Trend: Gradual simplification over 65 years

**Readability (Flesch Score)**
- Range: 52-60 (standard to fairly difficult)
- Stable over time despite vocabulary changes
- Most readable: 1965 (Flesch 63.6)
- Least readable: 2010 (Flesch 51.8)

**Vocabulary Evolution**
- 1960s-70s: "defence, economic, development, industrial"
- 1980s-90s: "restructuring, services, productivity, global"
- 2000s-10s: "inclusive, healthcare, upgrading, innovation"
- 2020s: "sustainability, digital, resilience, climate"

**Minister Styles**
- Most complex: Goh Keng Swee (20.6 words/sentence)
- Most accessible: Heng Swee Keat (18.0 words/sentence)
- Tharman: Balanced (19.2 words/sentence)

---

### Crisis Response Patterns

#### 1985 Recession
**Changes during crisis (vs. before):**
- Finance: +4.1 pp (fiscal response)
- Defence: -3.2 pp (budget reallocation)
- Trade & Industry: +2.8 pp (restructuring)

#### 1997 Asian Financial Crisis
**Changes during crisis:**
- Finance: +5.3 pp (highest crisis response)
- Social & Family: +0.8 pp (safety nets begin)
- Defence: -2.1 pp

#### 2008 Global Financial Crisis
**Changes during crisis:**
- Manpower: +2.7 pp (Workfare expansion)
- Social & Family: +1.4 pp (inclusive growth)
- Health: +1.1 pp (healthcare support)

#### 2020 COVID-19 Pandemic
**Changes during crisis:**
- Health: +1.9 pp (pandemic response)
- Social & Family: +1.1 pp (support packages)
- Sustainability: +0.8 pp (green recovery)

---

## Methodology

### 1. Ministry Classification

**Approach**: Weighted keyword matching
- 15 ministry categories mapped to current government structure
- 10-30 keywords per ministry
- Multi-word keywords weighted higher (e.g., "national service" = 2 points)

**Accuracy**: 82.7% of sentences classified to specific ministries

**Example Keywords**:
- Defence: "defence", "military", "saf", "national service"
- Health: "healthcare", "hospital", "medisave", "medishield"
- Manpower: "cpf", "employment", "workfare", "progressive wage"

### 2. Linguistic Analysis

**Metrics Calculated**:
- **Flesch Reading Ease**: `206.835 - 1.015(words/sentence) - 84.6(syllables/word)`
- **Sentence length**: Average words per sentence
- **Word complexity**: Average syllables per word
- **Vocabulary diversity**: Unique words per 100 words

### 3. Crisis Analysis

**Method**: 3-year window comparison
- Before: 3 years prior to crisis
- During: Crisis period (1-3 years)
- After: 3 years post-crisis

**Metrics**: Change in ministry percentage points (pp)

### 4. Speech Diversity

**Shannon Entropy**: Measures topic distribution balance
- Higher entropy = more diverse topics covered
- Formula: `H = -Σ(p_i * log2(p_i))`
- Normalized to 0-1 scale

---

## Datasets

### CSV Files in This Folder

| File | Size | Rows | Description |
|------|------|------|-------------|
| `ministry_by_year.csv` | ~45KB | 66 | Ministry % by year (columns: 15 ministries) |
| `ministry_by_minister.csv` | ~8KB | 7 | Ministry % by minister |
| `ministry_by_decade.csv` | ~6KB | 7 | Ministry % by decade (1960s-2020s) |
| `ministry_topic_statistics.csv` | ~5KB | 15 | Total sentences, %, peak year per ministry |
| `yearly_speech_statistics.csv` | ~15KB | 66 | Words, sentences, readability by year |
| `minister_speech_statistics.csv` | ~3KB | 7 | Avg words, sentences by minister |
| `correlation_matrix.csv` | ~2KB | - | Speech timing correlations |

### Column Schemas

**ministry_by_year.csv**
```
year,defence,finance,education,manpower,health,transport,...
1960,22.3,15.8,6.2,4.1,1.8,3.4,...
```

**ministry_topic_statistics.csv**
```
Ministry,Total Sentences,% of Total,Avg Confidence,Years Mentioned,Peak Year,Peak Year Count
Defence,7509,18.9,1.18,66,1961,200
```

**yearly_speech_statistics.csv**
```
year,total_sentences,total_words,avg_words_per_sentence,readability,minister
1960,560,11784,21.04,59.55,Goh Keng Swee
```

---

## Usage Examples

### Load and Explore

```python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load ministry trends
ministry_by_year = pd.read_csv('ministry_by_year.csv', index_col=0)

# Plot Defence trend
ministry_by_year['defence'].plot(
    title='Defence in Budget Speeches (1960-2025)',
    ylabel='% of sentences',
    xlabel='Year'
)
plt.show()
```

### Minister Comparison

```python
# Load minister data
ministry_by_minister = pd.read_csv('ministry_by_minister.csv', index_col=0)

# Get top 3 focus areas per minister
top_3 = ministry_by_minister.apply(lambda x: x.nlargest(3), axis=1)
print(top_3)

# Heatmap comparison
sns.heatmap(ministry_by_minister, annot=True, fmt='.1f', cmap='YlOrRd')
plt.title('Ministry Focus by Finance Minister')
plt.show()
```

### Linguistic Analysis

```python
# Load yearly stats
yearly_stats = pd.read_csv('yearly_speech_statistics.csv')

# Plot readability over time
yearly_stats.plot(
    x='year',
    y='readability',
    title='Flesch Reading Ease Score (1960-2025)',
    ylabel='Score (higher = easier)',
    legend=False
)
plt.show()

# Compare ministers
minister_stats = pd.read_csv('minister_speech_statistics.csv')
minister_stats.plot(
    x='minister',
    y='avg_words_per_sentence',
    kind='barh',
    title='Sentence Complexity by Minister'
)
plt.show()
```

### Crisis Analysis

```python
# Define crisis periods
crisis_years = {
    '1985 Recession': (1985, 1987),
    '1997 Asian Crisis': (1997, 1999),
    '2008 Global Crisis': (2008, 2010),
    'COVID-19': (2020, 2021)
}

# Compare Defence during crises
for crisis, (start, end) in crisis_years.items():
    crisis_avg = ministry_by_year.loc[start:end, 'defence'].mean()
    before_avg = ministry_by_year.loc[start-3:start-1, 'defence'].mean()
    change = crisis_avg - before_avg
    print(f"{crisis}: {change:+.1f}pp")
```

---

## Running the Notebooks

### 1. Start Jupyter

```bash
cd analysis
poetry run jupyter notebook
```

### 2. Open Notebook

- `ministry_topic_analysis.ipynb` - Most comprehensive
- `speech_analysis.ipynb` - General statistics
- `speech_timing_analysis.ipynb` - Timing patterns

### 3. Run All Cells

In Jupyter: Cell → Run All

### 4. Export Updated CSVs

Notebooks automatically export CSVs at the end.

---

## Updating Analysis

When new speeches are added:

### 1. Process New Data
```bash
poetry run python processor/main.py
```

### 2. Re-run Notebooks
```bash
poetry run jupyter notebook
# Open and run each notebook
```

### 3. Verify Exports
Check that CSV files are updated with new year.

### 4. Review Findings
- Do ministry trends change?
- How does new minister compare?
- Any linguistic shifts?

---

## Advanced Analysis Ideas

### Sentiment Analysis
```python
from textblob import TextBlob

# Analyze sentiment by year
df['sentiment'] = df['sentence_text'].apply(
    lambda x: TextBlob(x).sentiment.polarity
)
sentiment_by_year = df.groupby('year')['sentiment'].mean()
```

### Topic Modeling (LDA)
```python
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer

vectorizer = CountVectorizer(max_features=1000, stop_words='english')
doc_term_matrix = vectorizer.fit_transform(df['sentence_text'])

lda = LatentDirichletAllocation(n_components=10, random_state=42)
lda.fit(doc_term_matrix)
```

### Network Analysis
```python
import networkx as nx

# Create co-occurrence network of ministries
# Nodes = ministries, edges = appear in same speech
```

---

## Requirements

- pandas >= 1.0
- matplotlib >= 3.0
- seaborn >= 0.11
- numpy >= 1.19
- jupyter >= 1.0
- scikit-learn >= 0.24 (for advanced analysis)
- scipy >= 1.5 (for entropy calculations)

Install via Poetry:
```bash
poetry install
```

---

## Performance

- **Load time**: CSV files load in < 1 second
- **Analysis time**: Full notebook runs in 2-5 minutes
- **Memory usage**: ~500MB for all data
- **Export time**: CSV writes in < 1 second

---

## Related Documentation

- **[Processor README](../processor/README.md)** - Data preparation
- **[Extractor README](../extractor/README.md)** - Data collection
- **[Main README](../README.md)** - Project overview
- **[Website Strategy](../WEBSITE_STRATEGY.md)** - Visualization plans

---

## Contact

For analysis questions:
- **GitHub Issues**: Report analysis bugs or request new analyses
- **Pull Requests**: Submit new notebooks or improvements
## Key Findings

### Singapore's Policy Evolution

#### 1960s-1970s: Survival & Security
- **Defence**: 19.8% of speeches
- **Context**: Post-independence nation-building, industrialization
- **Finance Minister**: Goh Keng Swee's "Architect" era
- **Style**: Crisp, directive (20.6 words/sentence)

#### 1980s-1990s: Economic Transformation
- **Finance**: 17.4% peak during restructuring
- **Trade & Industry**: 12.3% (manufacturing → services)
- **Crises**: 1985 Recession, 1997 Asian Financial Crisis
- **Ministers**: Tony Tan, Richard Hu (longest tenure)

#### 2000s-2010s: Inclusive Growth
- **Manpower**: Rose to 9.2% (Workfare, CPF reforms)
- **Health**: Grew to 3.1% (Medishield Life, subsidies)
- **Social & Family**: 2.4% (Pioneer Generation Package)
- **Ministers**: Lee Hsien Loong, Tharman Shanmugaratnam

#### 2020s: Sustainable Future
- **Sustainability**: Jumped to 4.1% (carbon tax, net-zero)
- **Digital**: Emerged as priority
- **COVID-19**: Unprecedented health/social spending
- **Minister**: Lawrence Wong's sustainability focus

### 2. Speech Length Over Time
- Total words per speech over the years
- Total sentences per speech
- Trend analysis showing how speech length has evolved

### 3. Speech Characteristics by Minister
- Average speech length by minister
- Average words per sentence by minister
- Comparative visualizations

### 4. Temporal Trends
- Combined view showing how different ministers' speech patterns vary
- Identification of longest and shortest speeches
- Overall statistical summaries
