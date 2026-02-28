```markdown
# AGENTS.md Guidelines

These guidelines outline the principles and rules for development of the AGENTS repository. Adherence to these principles is crucial for maintaining a robust, maintainable, and scalable codebase.

## 1. DRY (Don't Repeat Yourself)

*   All code should have a single, well-defined purpose.
*   Avoid duplication of logic, data structures, or implementation across multiple files.
*   When a feature is reused, consider creating a reusable component or function.
*   Document reusable components clearly.

## 2. KISS (Keep It Simple, Stupid)

*   Prioritize simplicity over complexity.
*   Strive for clear and concise code.
*   Avoid unnecessary abstractions or convoluted logic.
*   Make code easy to understand for yourself and others.

## 3. SOLID Principles

*   **Single Responsibility Principle:** Each class/module should have one, and only one, reason to change.
*   **Open/Closed Principle:** The system should be extensible without modifying the core implementation.
*   **Liskov Substitution Principle:**  Subclasses should be substitutable for their base classes without altering the correctness of the program.
*   **Interface Segregation Principle:** Clients should not be forced to implement interfaces they don’t use.
*   **Dependency Inversion Principle:** Client code should not depend on implementation details.  Instead, they should depend on abstractions.

## 4. YAGNI (You Aren't Gonna Need It)

*   Only implement features that are explicitly required for the current task.
*   Defer non-essential functionality to later iterations.
*   Avoid adding features based on assumptions about future requirements.

## 5. Code Style & Formatting

*   **Indentation:** Use 2 spaces for indentation.
*   **Line Length:** Max. 120 characters per line.
*   **Naming Conventions:**  Follow a consistent naming convention (e.g., snake_case for variables and functions).
*   **Comments:**  Add concise, helpful comments where necessary to explain complex logic.  Avoid over-commenting.
*   **Whitespace:** Use whitespace consistently to improve readability.

## 6. Testing Strategy

*   **Unit Tests:** All code must be thoroughly tested.
*   **Test Coverage:** Minimum 80% coverage of the code.  Tools like `coverage.py` must be used.
*   **Test Isolation:**  Tests should be isolated and not rely on external state.
*   **Test Driven Development:**  Tests should be written *before* implementation to ensure functionality.  No "middle man" testing.

## 7. File Structure & Content Requirements

*   **File Naming:** Use a consistent naming convention for all files.  (Example: `agent_data.py`, `agent_logic.py`)
*   **Directory Structure:**  Maintain a logical directory structure for code organization.
*   **Module Structure:**  Organize code into logical modules with well-defined responsibilities.
*   **Documentation:**  Provide clear and concise documentation for each file and module.
*   **Error Handling:** Implement proper error handling and logging.

## 8. Coding Standards - Length Limit

*   Maximum code length: 180 lines per file.
*   Break down large functions into smaller, well-named sub-functions.
*   Minimize unnecessary complexity.

## 9.  Deliverables and Verification

*   All files must be compiled and executed.
*   Automated tests must pass.
*   Code should be reviewed by another developer to ensure quality and adherence to standards.

## 10. Development Process

*   Prioritize code readability and maintainability.
*   Use version control (Git) for tracking changes.
*   Conduct regular code reviews.
*   Document changes thoroughly.
```