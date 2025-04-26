# Contributing to Gemini AI Assistant

Thank you for considering contributing to the Gemini AI Assistant project! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and considerate of others when contributing to this project. We aim to foster an inclusive and welcoming community.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies with `npm install`
4. Create a new branch for your feature or bug fix

## Development Workflow

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Commit your changes with clear, descriptive commit messages
4. Push your branch to your fork
5. Submit a pull request to the main repository

## Pull Request Guidelines

When submitting a pull request:

1. Provide a clear description of the changes
2. Link any related issues
3. Ensure all tests pass
4. Include screenshots for UI changes if applicable
5. Update documentation if necessary

## Coding Standards

Please follow these coding standards:

- Use the Vue 3 Composition API
- Follow ESLint rules configured in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components focused on a single responsibility
- Use async/await for asynchronous operations

## Component Structure

When creating or modifying Vue components:

1. Use the following component structure:

   ```vue
   <template>
     <!-- Template code -->
   </template>

   <script>
   // Import statements
   import { ref, computed } from "vue";

   export default {
     name: "ComponentName",
     props: {
       // Props
     },
     emits: ["event-name"],
     setup(props, { emit }) {
       // Composition API code
       return {
         // Returned variables and functions
       };
     },
   };
   </script>
   ```

2. Keep template code clean and readable
3. Extract complex logic into separate functions
4. Use props and emits for component communication

## Testing

Before submitting your changes:

1. Test your changes in different browsers (Chrome, Firefox, Safari)
2. Verify both dark and light themes work correctly
3. Test the application with different screen sizes
4. Ensure the application works without console errors

## Feature Requests

If you have a feature request:

1. First, check if it's already in the issues
2. If not, create a new issue with the "feature request" label
3. Describe the feature in detail and why it would be valuable

## Bug Reports

When reporting bugs:

1. Check if the bug has already been reported
2. Include detailed steps to reproduce the bug
3. Include browser and OS information
4. Add screenshots or videos if possible
5. Describe expected vs. actual behavior

## Documentation

If you're updating documentation:

1. Keep language clear and concise
2. Use Markdown formatting appropriately
3. Verify links work correctly
4. Spell check your changes

## Commit Messages

Write clear, descriptive commit messages:

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Start with a capital letter
- Keep the first line under 72 characters
- Reference issues and pull requests where appropriate

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT license.

## Questions?

If you have any questions or need help, please open an issue with the "question" label, and we'll be happy to assist you.
