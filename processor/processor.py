"""
Main processor for batch processing all speeches
"""

import logging
from parser import SpeechParser
from pathlib import Path

import pandas as pd
from writer import prepare_dataframe, print_summary, write_to_csv, write_to_parquet

logger = logging.getLogger(__name__)


def process_all_speeches(
    markdown_dir: str = "output_markdown",
    output_csv: str = "output_processor/budget_speeches.csv",
    output_parquet: str = "output_processor/budget_speeches.parquet",
) -> pd.DataFrame:
    """
    Process all budget speech markdown files

    Args:
        markdown_dir: Directory containing markdown files
        output_csv: Path for CSV output
        output_parquet: Path for Parquet output

    Returns:
        pandas DataFrame with all processed sentences
    """
    markdown_path = Path(markdown_dir)
    files = sorted(markdown_path.glob("*.md"))

    logger.info("Budget Speech Processor")
    logger.info("=" * 60)
    logger.info(f"Markdown directory: {markdown_path}")
    logger.info(f"Found {len(files)} files")
    logger.info("=" * 60)
    logger.info("Processing files...")

    # Initialize parser
    parser = SpeechParser()

    # Process all files
    all_sentences = []
    total_duplicates_removed = 0

    for i, file_path in enumerate(files, 1):
        try:
            logger.info(f"{i:2d}/{len(files)}: {file_path.name}...")

            sentences = parser.parse_file(file_path)
            original_count = len(sentences)

            # Deduplicate within this year/file
            df_year = pd.DataFrame(sentences)
            df_year_deduped = df_year.drop_duplicates(subset=["sentence_text"], keep="first")
            sentences_deduped = df_year_deduped.to_dict("records")

            duplicates_in_year = original_count - len(sentences_deduped)
            total_duplicates_removed += duplicates_in_year

            all_sentences.extend(sentences_deduped)

            if duplicates_in_year > 0:
                logger.info(
                    f"✓ ({original_count} → {len(sentences_deduped)} sentences, {duplicates_in_year} duplicates removed)"
                )
            else:
                logger.info(f"✓ ({len(sentences_deduped)} sentences)")

        except Exception as e:
            logger.error(f"✗ Error processing {file_path.name}: {e}")

    # Convert to DataFrame
    logger.info("Creating DataFrame...")

    if total_duplicates_removed > 0:
        logger.info(f"Total duplicates removed across all years: {total_duplicates_removed}")

    df = prepare_dataframe(all_sentences)

    # Write outputs
    logger.info("Writing outputs...")

    # Create output directory if it doesn't exist
    output_dir = Path(output_csv).parent
    output_dir.mkdir(parents=True, exist_ok=True)

    csv_path = write_to_csv(df, output_csv)
    logger.info(f"✓ CSV saved to: {csv_path}")

    parquet_path = write_to_parquet(df, output_parquet)
    logger.info(f"✓ Parquet saved to: {parquet_path}")

    # Print summary
    print_summary(df)

    return df
