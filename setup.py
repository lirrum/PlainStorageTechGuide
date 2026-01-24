from setuptools import setup, find_packages

long_desc = """
# PSTG Markdown Extensions

Custom Markdown extensions for the *Plain Storage Tech Guide* (PSTG) project.

## Features
*   `=text=` : Creates a spoiler blur effect.
*   `[text]<style>` : Applies custom inline styles (e.g., `[text]<red>`).
"""

setup(
    name="PSTG-markdown-extensions",
    version="0.1.0",
    author="PSTG",
    description="Custom Markdown extensions for PSTG, providing spoiler and inline style syntax.",
    long_description=long_desc,
    long_description_content_type="text/markdown",
    packages=find_packages(include=['PSTG_markdown', 'PSTG_markdown.*']),
    install_requires=[
        "markdown>=3.4",
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    entry_points={
        "markdown.extensions": [
            "PSTGmarkdownAddition = PSTG_markdown:makeExtension",
        ]
    },
)