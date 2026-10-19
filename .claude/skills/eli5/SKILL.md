---
name: eli5
description: Explain research papers, technical concepts, or unfamiliar project components in simple language, using concrete examples and little jargon. Use when the user asks for ELI5, an easy explanation, or clarification of something technically dense. Match the user's language; do not turn ordinary implementation tasks into explanations.
---

# ELI5

Explain the main idea in the user's language and at their level of understanding. For Vietnamese requests, use natural Vietnamese. Start with the direct answer, then explain how it works and why it matters with one concrete example or analogy when useful.

For a named paper, DOI, arXiv ID or URL, read the actual source with available document or browsing tools before attributing findings to it. Do not assume a Feynman CLI is installed. For a repository question, inspect the relevant files and dependencies before explaining their roles. A general concept does not require finding papers unless the user asks for research or verification.

Use a short explanation for a simple question. For a longer paper or concept, cover the big idea, mechanism, practical significance and limitations; choose headings or lists only when they help the reader. Do not force a six-section template.

Guidelines:
- Use short sentences and concrete words.
- Define jargon immediately or remove it.
- Prefer one good analogy over several weak ones.
- Separate what the paper actually shows from speculation or interpretation.
- Keep the explanation inline unless the user explicitly asks to save it as an artifact.
- Preserve facts, scope and uncertainty while simplifying. For medical or scientific material, keep the distinction between evidence, an analogy and an inference; cite the source when discussing a specific finding.
