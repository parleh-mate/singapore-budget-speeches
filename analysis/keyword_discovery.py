"""
Keyword Discovery Script for Ministry Topic Classification

This script analyzes Singapore budget speeches to discover common keywords
for each ministry topic, helping to improve the classification keyword lists.
"""

import re
import sys
from collections import Counter
from pathlib import Path
from typing import Dict, List

import pandas as pd

# Add extractor to path
sys.path.append(str(Path(__file__).parent.parent / "extractor"))

# Improved ministry topics (with auto-discovered keywords)
MINISTRY_TOPICS = {
    "communications_information": {
        "keywords": [
            "5g",
            "broadband",
            "broadcasting",
            "communications",
            "cyber",
            "digital",
            "imda",
            "infocomm",
            "information",
            "internet",
            "media",
            "technology",
            "telecommunications",
        ],
        "label": "Communications & Information",
    },
    "culture_community_youth": {
        "keywords": [
            "arts",
            "community",
            "culture",
            "day rally",
            "heritage",
            "library",
            "mccy",
            "museum",
            "national day",
            "national day rally",
            "nlb",
            "racial harmony",
            "recreation",
            "sport",
            "sports",
            "youth",
        ],
        "label": "Culture, Community & Youth",
    },
    "defence": {
        "keywords": [
            "air force",
            "army",
            "defence",
            "defense",
            "military",
            "mindef",
            "national service",
            "navy",
            "ns",
            "rsaf",
            "rsn",
            "saf",
            "safti",
            "security",
        ],
        "label": "Defence",
    },
    "education": {
        "keywords": [
            "college",
            "curriculum",
            "despite",
            "education",
            "ite",
            "items",
            "learning",
            "moe",
            "ntu",
            "nus",
            "polytechnic",
            "preschool",
            "primary",
            "school",
            "schools",
            "secondary",
            "skillsfuture",
            "smu",
            "student",
            "students",
            "teacher",
            "united",
            "universities",
            "university",
        ],
        "label": "Education",
    },
    "finance": {
        "keywords": [
            "budget",
            "corporate",
            "corporate tax",
            "customs",
            "debt",
            "deficit",
            "estimated",
            "excise",
            "fiscal",
            "gst",
            "income tax",
            "iras",
            "personal",
            "personal income",
            "property",
            "property tax",
            "revenue",
            "stamp duty",
            "surplus",
            "tax",
            "tax rate",
            "tax rates",
            "taxes",
            "treasury",
        ],
        "label": "Finance",
    },
    "foreign_affairs": {
        "keywords": [
            "ambassador",
            "asean",
            "bilateral",
            "diplomatic",
            "embassy",
            "foreign",
            "international",
            "mfa",
            "overseas",
            "relations",
            "treaty",
        ],
        "label": "Foreign Affairs",
    },
    "health": {
        "keywords": [
            "careshield",
            "clinic",
            "disease",
            "doctor",
            "eldercare",
            "eldershield",
            "health",
            "healthcare",
            "hospital",
            "hospitals",
            "medical",
            "medisave",
            "medisave top",
            "medishield",
            "moh",
            "nurse",
            "patient",
            "patients",
            "polyclinic",
        ],
        "label": "Health",
    },
    "home_affairs": {
        "keywords": [
            "approves",
            "april",
            "citizen",
            "civil defence",
            "crime",
            "emergency",
            "financial policy",
            "fire",
            "home affairs",
            "ica",
            "immigration",
            "law enforcement",
            "police",
            "pr",
            "safety",
            "scdf",
        ],
        "label": "Home Affairs",
    },
    "law": {
        "keywords": [
            "attorney general",
            "court",
            "judge",
            "judiciary",
            "justice",
            "law",
            "legal",
            "legislation",
            "minlaw",
            "regulation",
            "statute",
        ],
        "label": "Law",
    },
    "manpower": {
        "keywords": [
            "cpf",
            "employers",
            "employment",
            "foreign workers",
            "jobs",
            "labor",
            "labour",
            "manpower",
            "ntuc",
            "progressive wage",
            "retirement",
            "salary",
            "skilled",
            "skills",
            "training",
            "unemployment",
            "wage",
            "wages",
            "workers",
            "workfare",
            "workforce",
        ],
        "label": "Manpower",
    },
    "national_development": {
        "keywords": [
            "bca",
            "bto",
            "building",
            "construction",
            "estate",
            "estate duty",
            "flat",
            "flats",
            "hdb",
            "hdb flats",
            "housing",
            "inflation",
            "planning",
            "property",
            "public housing",
            "resale",
            "room",
            "room hdb",
            "town",
            "ura",
            "urban",
        ],
        "label": "National Development",
    },
    "social_family_development": {
        "keywords": [
            "aged",
            "assistance",
            "children",
            "comcare",
            "elderly",
            "family",
            "family development",
            "low income",
            "msf",
            "social",
            "social support",
            "subsidy",
            "vulnerable",
            "welfare",
        ],
        "label": "Social & Family Development",
    },
    "sustainability_environment": {
        "keywords": [
            "carbon",
            "climate",
            "climate change",
            "emission",
            "emissions",
            "energy",
            "environment",
            "green",
            "nea",
            "net zero",
            "pollution",
            "pub",
            "recycling",
            "renewable",
            "sustainability",
            "waste",
            "water",
        ],
        "label": "Sustainability & Environment",
    },
    "trade_industry": {
        "keywords": [
            "assessment",
            "business",
            "businesses",
            "commerce",
            "edb",
            "enterprise",
            "enterprises",
            "export",
            "exports",
            "fdi",
            "import",
            "important",
            "industrial",
            "industry",
            "innovation",
            "investment",
            "investments",
            "manufacturing",
            "productivity",
            "sme",
            "smes",
            "startup",
            "trade",
        ],
        "label": "Trade & Industry",
    },
    "transport": {
        "keywords": [
            "bus",
            "car",
            "cars",
            "changi airport",
            "coe",
            "erp",
            "lrt",
            "lta",
            "maritime",
            "mrt",
            "opportunities",
            "port",
            "road",
            "shipping",
            "smrt",
            "taxi",
            "traffic",
            "train",
            "transport",
        ],
        "label": "Transport",
    },
}

# Common stop words to exclude
STOP_WORDS = {
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "can",
    "will",
    "just",
    "should",
    "now",
    "i",
    "we",
    "our",
    "this",
    "that",
    "these",
    "those",
    "are",
    "is",
    "was",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "year",
    "years",
    "per",
    "cent",
    "percent",
    "million",
    "billion",
    "also",
    "would",
    "could",
    "may",
    "might",
    "must",
    "sir",
    "mr",
    "mrs",
    "ms",
    "singapore",
    "government",
    "will",
    "new",
    "need",
    "provide",
    "ensure",
    "continue",
    "support",
    "help",
    "make",
    "take",
    "give",
    "work",
    "said",
    "mr",
    "speaker",
    "member",
    "members",
    "house",
    "parliament",
    "madam",
    "chairman",
    "committee",
}


def classify_sentence(text: str) -> tuple:
    """Classify a sentence using existing keywords."""
    text_lower = text.lower()
    scores = {}

    for ministry, info in MINISTRY_TOPICS.items():
        score = 0
        for keyword in info["keywords"]:
            if keyword in text_lower:
                word_count = len(keyword.split())
                weight = word_count if word_count > 1 else 1
                score += weight
        scores[ministry] = score

    max_score = max(scores.values())
    if max_score == 0:
        return "general", 0

    best_ministry = max(scores, key=lambda k: scores[k])
    return best_ministry, max_score


def extract_ngrams(text: str, n: int) -> List[str]:
    """Extract n-grams from text."""
    words = re.findall(r"\b[a-z]{3,}\b", text.lower())
    words = [w for w in words if w not in STOP_WORDS]

    if n == 1:
        return words

    ngrams = []
    for i in range(len(words) - n + 1):
        ngram = " ".join(words[i : i + n])
        ngrams.append(ngram)
    return ngrams


def analyze_ministry_keywords(df: pd.DataFrame, ministry: str, top_n: int = 30) -> Dict[str, int]:
    """Analyze a ministry's classified sentences to find common keywords."""
    ministry_sentences = df[df["ministry_topic"] == ministry]["sentence_text"]

    # Extract 1-grams, 2-grams, and 3-grams
    all_terms = []
    for text in ministry_sentences:
        all_terms.extend(extract_ngrams(text, 1))
        all_terms.extend(extract_ngrams(text, 2))
        all_terms.extend(extract_ngrams(text, 3))

    # Count occurrences
    term_counts = Counter(all_terms)

    # Remove existing keywords from consideration
    existing_keywords = set(MINISTRY_TOPICS[ministry]["keywords"])
    for kw in existing_keywords:
        term_counts.pop(kw, None)

    return dict(term_counts.most_common(top_n))


def calculate_specificity(df: pd.DataFrame, term: str, ministry: str) -> float:
    """
    Calculate how specific a term is to a ministry.
    Returns a score between 0 and 1, where higher means more specific.
    """
    # Count occurrences in this ministry
    ministry_sentences = df[df["ministry_topic"] == ministry]["sentence_text"]
    ministry_count = sum(1 for text in ministry_sentences if term in text.lower())

    # Count occurrences in all sentences
    total_count = sum(1 for text in df["sentence_text"] if term in text.lower())

    if total_count == 0:
        return 0

    # Calculate specificity (what % of occurrences are in this ministry)
    specificity = ministry_count / total_count
    return specificity


def main():
    print("=" * 80)
    print("MINISTRY TOPIC KEYWORD DISCOVERY")
    print("=" * 80)
    print()

    # Load data
    print("Loading speech data...")
    output_processor_path = Path(__file__).parent.parent / "output_processor"
    parquet_files = sorted(output_processor_path.glob("*.parquet"))

    dfs = []
    for file in parquet_files:
        df = pd.read_parquet(file)
        dfs.append(df)

    df_all = pd.concat(dfs, ignore_index=True)
    print(f"✓ Loaded {len(df_all):,} sentences from {len(parquet_files)} files\n")

    # Initial classification
    print("Performing initial classification with existing keywords...")
    classification_results = df_all["sentence_text"].apply(classify_sentence)
    df_all["ministry_topic"] = classification_results.apply(lambda x: x[0])
    df_all["topic_confidence"] = classification_results.apply(lambda x: x[1])

    classified_count = (df_all["ministry_topic"] != "general").sum()
    print(
        f"✓ Classified {classified_count:,} sentences ({classified_count/len(df_all)*100:.1f}%)\n"
    )

    # Analyze each ministry
    print("=" * 80)
    print("DISCOVERING NEW KEYWORDS FOR EACH MINISTRY")
    print("=" * 80)
    print()

    improved_keywords = {}

    for ministry in sorted(MINISTRY_TOPICS.keys()):
        ministry_data = df_all[df_all["ministry_topic"] == ministry]
        if len(ministry_data) == 0:
            continue

        label = MINISTRY_TOPICS[ministry]["label"]
        print(f"\n{label} ({ministry})")
        print("-" * 80)
        print(f"Current keywords: {len(MINISTRY_TOPICS[ministry]['keywords'])}")
        print(f"Classified sentences: {len(ministry_data):,}")

        # Find common terms
        common_terms = analyze_ministry_keywords(df_all, ministry, top_n=50)

        # Filter by specificity (lowered threshold for political analysis)
        print("\nTop candidate keywords (with specificity > 40%):")
        candidates = []
        for term, count in list(common_terms.items())[:50]:
            specificity = calculate_specificity(df_all, term, ministry)
            if specificity >= 0.4 and count >= 8:  # At least 40% specific and appears 8+ times
                candidates.append((term, count, specificity))

        # Sort by specificity
        candidates.sort(key=lambda x: x[2], reverse=True)

        suggested_keywords = []
        for i, (term, count, spec) in enumerate(candidates[:20], 1):  # Show top 20
            print(f"  {i:2d}. '{term}' (count: {count:4d}, specificity: {spec:.1%})")
            suggested_keywords.append(term)

        # Store improved keyword list
        improved_keywords[ministry] = {
            "label": label,
            "original_keywords": MINISTRY_TOPICS[ministry]["keywords"],
            "suggested_additions": suggested_keywords,
            "combined_keywords": sorted(
                set(MINISTRY_TOPICS[ministry]["keywords"] + suggested_keywords)
            ),
        }

    # Generate improved MINISTRY_TOPICS dictionary
    print("\n" + "=" * 80)
    print("GENERATING IMPROVED KEYWORD LISTS")
    print("=" * 80)
    print()

    output_file = Path(__file__).parent / "improved_ministry_keywords.py"

    with open(output_file, "w") as f:
        f.write('"""\\nImproved Ministry Topic Keywords (Auto-generated)\\n"""\\n\\n')
        f.write("MINISTRY_TOPICS = {\\n")

        for ministry, data in improved_keywords.items():
            f.write(f"    '{ministry}': {{\\n")
            f.write("        'keywords': [\\n")

            # Write keywords in groups of 5 for readability
            combined = data["combined_keywords"]
            for i in range(0, len(combined), 5):
                group = combined[i : i + 5]
                keywords_str = ", ".join(f"'{kw}'" for kw in group)
                f.write(f"            {keywords_str}")
                if i + 5 < len(combined):
                    f.write(",\n")
                else:
                    f.write("\n")

            f.write("        ],\\n")
            f.write(f"        'label': '{data['label']}',\\n")
            f.write("    },\\n")

        f.write("}\\n")

    print(f"✓ Improved keyword dictionary saved to: {output_file.name}")

    # Summary statistics
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print()

    for ministry, data in improved_keywords.items():
        original_count = len(data["original_keywords"])
        new_count = len(data["suggested_additions"])
        total_count = len(data["combined_keywords"])
        print(
            f"{data['label']:35s}: {original_count:2d} → {total_count:2d} keywords (+{new_count})"
        )

    print("\n" + "=" * 80)
    print("Next steps:")
    print("  1. Review improved_ministry_keywords.py")
    print("  2. Manually review suggested keywords for relevance")
    print("  3. Update ministry_topic_analysis.ipynb with improved keywords")
    print("  4. Re-run classification to see improvement")
    print("=" * 80)


if __name__ == "__main__":
    main()
