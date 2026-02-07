"""
Parser for budget speech markdown files
"""

import logging
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import spacy

logger = logging.getLogger(__name__)


class SpeechParser:
    """Parse budget speech markdown files"""

    def __init__(self):
        self.nlp = None

    def load_spacy(self):
        """Load spaCy model for sentence tokenization"""
        if self.nlp is None:
            try:
                self.nlp = spacy.load("en_core_web_sm")
            except OSError:
                logger.info("Downloading spaCy model...")
                import subprocess

                subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
                self.nlp = spacy.load("en_core_web_sm")

    def extract_metadata(self, content: str) -> Dict[str, str]:
        """Extract metadata from markdown header"""
        metadata = {}

        # Extract date
        date_match = re.search(r"\*\*Date:\*\*\s*(\d{4}-\d{2}-\d{2})", content)
        if date_match:
            metadata["speech_date"] = date_match.group(1)

        # Extract title
        title_match = re.search(r"\*\*Title:\*\*\s*(.+?)(?:\n|\*\*)", content)
        if title_match:
            metadata["speech_title"] = title_match.group(1).strip()

        # Extract primary speaker
        speaker_match = re.search(r"\*\*Speakers:\*\*\s*([^(;]+)", content)
        if speaker_match:
            metadata["primary_speaker"] = speaker_match.group(1).strip()

        return metadata

    def extract_sections_and_text(self, content: str) -> List[Tuple[Optional[str], str]]:
        """Extract sections and their text content as paragraphs"""
        # Remove metadata header
        content = re.sub(r"^.*?---\s*\n", "", content, flags=re.DOTALL, count=1)

        lines = content.split("\n")
        current_section: Optional[str] = None
        paragraphs: List[Tuple[Optional[str], str]] = []
        current_para: List[str] = []

        for line in lines:
            line = line.strip()

            # Check if it's a section header
            if re.match(r"^#{1,6}\s+", line):
                # Save current paragraph
                if current_para:
                    paragraphs.append((current_section, " ".join(current_para)))
                    current_para = []

                # Update current section
                current_section = re.sub(r"^#{1,6}\s+", "", line)
                continue

            # Skip empty or special lines
            if not line or line == "---" or (line.startswith("**") and line.endswith("**")):
                if current_para:
                    paragraphs.append((current_section, " ".join(current_para)))
                    current_para = []
                continue

            current_para.append(line)

        # Save final paragraph
        if current_para:
            paragraphs.append((current_section, " ".join(current_para)))

        return paragraphs

    def split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences using spaCy"""
        self.load_spacy()

        doc = self.nlp(text)
        sentences = []

        for sent in doc.sents:
            sentence_text = sent.text.strip()

            # Filter very short sentences (likely artifacts)
            if len(sentence_text) >= 20:
                sentences.append(sentence_text)

        return sentences

    def count_words(self, text: str) -> int:
        """Count words in text (excluding punctuation)"""
        self.load_spacy()

        doc = self.nlp(text)
        words = [t.text for t in doc if not t.is_space and not t.is_punct]
        return len(words)

    def parse_file(self, file_path: Path) -> List[Dict]:
        """
        Parse a markdown file and return list of sentence dictionaries

        Args:
            file_path: Path to markdown file

        Returns:
            List of dicts, each containing sentence data
        """
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        year = int(file_path.stem)

        # Extract sections and text
        paragraphs = self.extract_sections_and_text(content)

        # Process each paragraph into sentences
        sentences = []
        sentence_order = 0

        for section_title, text in paragraphs:
            if not text:
                continue

            # Split into sentences
            for sentence_text in self.split_into_sentences(text):
                word_count = self.count_words(sentence_text)

                sentences.append(
                    {
                        "year": year,
                        # 'speech_date': metadata.get('speech_date'),
                        # 'primary_speaker': metadata.get('primary_speaker'),
                        # 'speech_title': metadata.get('speech_title'),
                        "section_title": section_title,
                        "sentence_order": sentence_order,
                        "sentence_text": sentence_text,
                        "word_count": word_count,
                        "char_count": len(sentence_text),
                    }
                )
                sentence_order += 1

        return sentences
