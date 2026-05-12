# Reflection

## What we built
We built a lightweight audit + analysis engine that processes inputs and generates structured outputs using LLM-based reasoning.

## What worked well
- Modular architecture separating core logic from prompts
- Clean TypeScript setup
- Easy integration with OpenRouter/OpenAI-compatible APIs

## What didn’t work well
- Type safety gaps in early iterations
- Missing test coverage during initial development
- Some prompt responses were inconsistent across models

## Key learnings
- Prompt structure heavily impacts output consistency
- Separation of concerns is critical for scaling LLM workflows
- Logging is essential for debugging model behavior

## Next improvements
- Add full test coverage
- Introduce caching layer for API calls
- Improve deterministic output formatting