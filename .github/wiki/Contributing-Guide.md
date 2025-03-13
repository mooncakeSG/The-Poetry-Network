# Contributing Guide

Thank you for your interest in contributing to Poetry Network! This guide will help you get started with contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](Code-of-Conduct).

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/poetry-network.git
cd poetry-network
```
3. Set up your development environment (see [Development Setup](Development-Setup))
4. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

## Development Workflow

1. Make your changes
2. Write or update tests
3. Run the test suite:
```bash
npm test
```
4. Commit your changes:
```bash
git commit -m "feat: your feature description"
```
5. Push to your fork:
```bash
git push origin feature/your-feature-name
```
6. Create a Pull Request

## Pull Request Guidelines

### Before Submitting

- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow the code style guide

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the [CHANGELOG.md](../CHANGELOG.md) with a note describing your changes
3. The PR will be merged once you have the sign-off of at least one other developer

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Code Style

- Use TypeScript for all new code
- Follow the ESLint configuration
- Use Prettier for code formatting
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

### Writing Tests

- Place tests next to the code they test
- Use `.test.ts` or `.test.tsx` extension
- Follow the testing patterns in existing tests
- Aim for good test coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments for functions and classes
- Document complex algorithms
- Include examples where helpful
- Keep documentation up to date

### Wiki Documentation

- Keep wiki pages up to date
- Add new pages for new features
- Include code examples where relevant
- Use clear and concise language

## Review Process

1. Automated checks must pass
2. Code review by at least one maintainer
3. Address any feedback
4. Merge when approved

## Getting Help

- Check the [FAQ](FAQ)
- Read the [Troubleshooting Guide](Troubleshooting)
- Ask in our [Discord community](https://discord.gg/poetry-network)
- Open an issue for bugs or feature requests

## Recognition

Contributors will be recognized in:
- The [CHANGELOG.md](../CHANGELOG.md)
- The [Contributors page](https://github.com/your-username/poetry-network/graphs/contributors)
- Release notes

## Questions?

If you have any questions, feel free to:
1. Open an issue
2. Join our [Discord community](https://discord.gg/poetry-network)
3. Contact the maintainers 