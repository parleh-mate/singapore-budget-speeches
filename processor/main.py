"""
Main entry point for running the processor
"""

import logging

from processor import process_all_speeches


def main():
    """Run the budget speech processor"""
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    process_all_speeches(
        markdown_dir="output_markdown",
        output_csv="output_processor/budget_speeches.csv",
        output_parquet="output_processor/budget_speeches.parquet",
    )


if __name__ == "__main__":
    main()
