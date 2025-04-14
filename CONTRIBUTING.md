# Contributing to Meta MCP

Thank you for your interest in contributing to Meta MCP! This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and publishing.

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification to automatically determine semantic version bumps. Please format your commit messages as follows:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature (minor version bump)
- `fix`: A bug fix (patch version bump)
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Breaking Changes

If your commit includes a breaking change, include `BREAKING CHANGE:` in the footer followed by a description of the breaking change.

### Examples

```
feat(campaign): add ability to specify ad scheduling

fix(adset): resolve targeting settings not being applied correctly

docs(readme): update installation instructions

refactor(client): improve error handling

BREAKING CHANGE: The API for createAd has changed to use a more
consistent parameter structure
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and commit using the conventional commit format
4. Push to your fork (`git push origin feature/amazing-feature`) 
5. Open a Pull Request against the `main` branch

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Run tests: `npm test`

Thank you for your contributions! 