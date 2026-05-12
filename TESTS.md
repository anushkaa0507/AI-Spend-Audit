# Tests

## Overview
This project uses unit tests to validate core audit engine behavior and output consistency.

## Current Coverage
- Input validation tests
- Audit engine execution tests
- LLM response parsing tests

## Suggested Stack
- Jest or Vitest
- ts-jest for TypeScript support

## Example Test Cases

### Audit Engine
- Should return structured output for valid input
- Should handle empty input gracefully
- Should not crash on malformed JSON

### Prompt Handling
- Should inject variables correctly
- Should fallback on missing fields

## Run Tests
```bash
npm run test