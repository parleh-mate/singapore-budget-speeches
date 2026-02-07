"""
Writers for output formats (CSV, Parquet)
"""

import logging
from pathlib import Path
from typing import Dict, List

import pandas as pd

logger = logging.getLogger(__name__)


def prepare_dataframe(all_sentences: List[Dict]) -> pd.DataFrame:
    """
    Convert list of sentence dicts to pandas DataFrame with derived columns

    Args:
        all_sentences: List of sentence dictionaries

    Returns:
        pandas DataFrame with all sentences and derived columns
    """
    df = pd.DataFrame(all_sentences)

    # Sort by year and sentence_order
    df = df.sort_values(["year", "sentence_order"]).reset_index(drop=True)

    # Re-assign sentence_order within each year to be consecutive (0, 1, 2, ...)
    df["sentence_order"] = df.groupby("year").cumcount()

    # Add sentence_id as first column
    df.insert(0, "sentence_id", range(len(df)))

    return df


def write_to_csv(df: pd.DataFrame, output_path: str = "budget_speeches.csv") -> Path:
    """
    Write DataFrame to CSV

    Args:
        df: DataFrame to write
        output_path: Output file path

    Returns:
        Path to written file
    """
    path = Path(output_path)
    df.to_csv(path, index=False)
    return path


def write_to_parquet(df: pd.DataFrame, output_path: str = "budget_speeches.parquet") -> Path:
    """
    Write DataFrame to Parquet (more efficient format)

    Args:
        df: DataFrame to write
        output_path: Output file path

    Returns:
        Path to written file
    """
    path = Path(output_path)
    df.to_parquet(path, index=False)
    return path


def print_summary(df: pd.DataFrame):
    """Print summary statistics of the dataset"""
    logger.info(f"\n{'='*60}")
    logger.info("Dataset Summary")
    logger.info("=" * 60)
    logger.info(f"Total sentences: {len(df):,}")
    logger.info(f"Total words: {df['word_count'].sum():,}")
    logger.info(f"Avg words per sentence: {df['word_count'].mean():.1f}")
    logger.info(f"Years covered: {df['year'].min()} - {df['year'].max()}")
    logger.info(f"DataFrame shape: {df.shape}")
    logger.info(f"\nColumns: {list(df.columns)}")
