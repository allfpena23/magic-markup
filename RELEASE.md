# Semantic Release Setup

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate version management and package releases.

## How It Works

When you merge a pull request to the `main` branch, the GitHub Actions workflow automatically:

1. Analyzes commit messages to determine the version bump
2. Generates a changelog
3. Updates the version in `package.json`
4. Creates a GitHub release with release notes
5. Commits the changes back to the repository

## Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Version Bumps

- **Major Release** (1.0.0 → 2.0.0): Include `BREAKING CHANGE:` in commit footer
  ```
  feat: new API design
  
  BREAKING CHANGE: API endpoints have been restructured
  ```

- **Minor Release** (1.0.0 → 1.1.0): Use `feat:` prefix
  ```
  feat: add new card layout option
  ```

- **Patch Release** (1.0.0 → 1.0.1): Use `fix:` prefix
  ```
  fix: resolve rendering issue in accordion mode
  ```

### Other Commit Types (No Release)

- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring (triggers patch release)
- `perf:` - Performance improvements (triggers patch release)
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- `build:` - Build system changes

## Workflow File

The workflow is defined in `.github/workflows/release.yml` and runs on every push to `main`.

## Configuration

The semantic-release configuration is in `.releaserc.json` and includes:

- **Commit Analyzer**: Determines version bump based on commits
- **Release Notes Generator**: Creates changelog from commits
- **Changelog Plugin**: Maintains `CHANGELOG.md`
- **NPM Plugin**: Updates `package.json` (publishing disabled)
- **Git Plugin**: Commits version changes back to repo
- **GitHub Plugin**: Creates GitHub releases

## First Release

The first release will be created when you merge your first PR with a conventional commit to `main`. Make sure your commits follow the convention above!

## Example Workflow

1. Create a feature branch: `git checkout -b feature/new-layout`
2. Make changes and commit: `git commit -m "feat: add grid layout option"`
3. Push and create PR: `git push origin feature/new-layout`
4. Merge PR to `main`
5. GitHub Actions automatically creates a new minor release (e.g., 1.1.0)

## Skipping CI

If you need to push to `main` without triggering a release, include `[skip ci]` in your commit message.
