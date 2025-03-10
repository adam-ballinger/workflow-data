### Prioritized TODO List

1. **Add Error Handling for File Operations**

   - **Why**: File operations (e.g., `readCsv`, `readJson`, `writeCsv`, `writeJson`, `writeHtml`) can fail due to issues like missing files, permission errors, or invalid data. Without proper error handling, the module may crash unexpectedly, impacting reliability.
   - **What**: Wrap file operations in `try-catch` blocks and throw meaningful errors (e.g., "File not found at [filePath]" or "Invalid CSV format").
   - **Effort**: Low — adding error handling is straightforward and involves minimal code changes.
   - **Impact**: High — prevents crashes and improves user experience by providing actionable feedback.

2. **Enhance Documentation for All Functions**

   - **Why**: Current JSDoc comments exist but are incomplete or lack examples, especially for complex functions like `pivot`. Better documentation makes the module easier to use and reduces misuse.
   - **What**: Add detailed JSDoc comments for each function, including parameter descriptions, return types, and usage examples (e.g., for `pivot`, show how to transform data into a table-like structure).
   - **Effort**: Low — writing documentation requires no code changes, just time to describe functionality.
   - **Impact**: High — improves usability for new and existing users, reducing the learning curve.

3. **Validate Inputs for Key Functions, Including Checking Row Lengths in `readCsv`**

   - **Why**: Functions like `filter`, `update`, `erase`, and `pivot` assume valid inputs, and `readCsv` assumes consistent row lengths. Invalid inputs (e.g., non-array `data`, malformed CSV) can lead to errors or unexpected behavior.
   - **What**:
     - Add checks in `filter`, `update`, `erase`, and `pivot` to ensure `data` is an array and parameters (e.g., `filter`) match expected types.
     - In `readCsv`, verify that all rows have the same number of columns as the headers, throwing an error if inconsistent.
   - **Effort**: Low — simple type and structure checks can be added quickly.
   - **Impact**: High — prevents runtime errors and ensures data integrity.

4. **Implement Unit Tests for All Functions**

   - **Why**: No tests currently exist, so bugs or regressions could go unnoticed. Tests ensure the module works as intended and provide confidence for future changes.
   - **What**: Write unit tests using a framework like Jest or Mocha, covering each function’s core functionality and edge cases (e.g., empty arrays, malformed CSV files).
   - **Effort**: Moderate — requires some time to set up and write tests, but the module’s simplicity keeps this manageable.
   - **Impact**: High — catches bugs early and supports long-term maintenance.

5. **Add a Sort Function for Arrays of Objects**

   - **Why**: Sorting is a common data manipulation need, and its absence limits the module’s utility. Users could benefit from ordering data by specific keys.
   - **What**: Create a `sort` function that takes an array of objects, a key (or keys), and an optional order (ascending/descending), using JavaScript’s `Array.sort()`.
   - **Effort**: Low — sorting is a standard operation with a simple implementation.
   - **Impact**: Moderate to High — adds valuable functionality with minimal complexity.

6. **Review and Refactor Code for Better Readability and Maintainability**
   - **Why**: The code is functional but could be more consistent and readable (e.g., naming conventions, redundant logic). This improves long-term maintenance.
   - **What**:
     - Ensure consistent naming (e.g., `filePath` vs. `json` in `writeJson`).
     - Simplify logic where possible (e.g., review `erase`’s reverse loop for clarity).
     - Remove any unused variables or redundant checks.
   - **Effort**: Moderate — requires a careful pass through the code but no major rewrites.
   - **Impact**: Moderate — enhances maintainability without immediate user-facing benefits.
