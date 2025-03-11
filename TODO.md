### Prioritized TODO List

6. **Review and Refactor Code for Better Readability, Maintainability, and minimize file size**
   - **Why**: The code is functional but could be more consistent and readable (e.g., naming conventions, redundant logic). This improves long-term maintenance.
   - **What**:
     - point out inconsistent naming (e.g., `filePath` vs. `json` in `writeJson`).
     - point out where to Simplify logic where possible (e.g., review `erase`’s reverse loop for clarity).
     - recommend removal of any unused variables or redundant checks.
   - **Effort**: Moderate — requires a careful pass through the code but no major rewrites.
   - **Impact**: Moderate — enhances maintainability without immediate user-facing benefits.
