# Playwright Automation Project

End-to-end UI + API automation project built with [Playwright](https://playwright.dev/) and TypeScript.

This repository focuses on:
- UI flows for login/registration
- API helpers for account lifecycle (create/delete)
- Test data management through fixtures
- CI execution with browser artifacts

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Run Tests](#run-tests)
- [Reports and Debugging](#reports-and-debugging)
- [Configuration](#configuration)
- [CI/CD](#cicd)
- [GitHub Actions](#github-actions-already-included)
- [Azure Pipelines](#azure-pipelines-ready-to-use)
- [Poetry Notes](#poetry-notes)
- [Troubleshooting](#troubleshooting)
- [Roadmap Ideas](#roadmap-ideas)

## Project Overview

The test suite runs against `https://www.automationexercise.com` and validates account flows both from API and UI perspectives.

Main scenarios currently covered:
- open login page
- register user through UI flow
- create user through API
- login through UI with API-prepared user

## Tech Stack

- Node.js (LTS)
- TypeScript
- Playwright Test (`@playwright/test`)
- Yarn (lockfile present)

## Project Structure

```text
playwright-automation-project/
|-- .github/
|   `-- workflows/
|       `-- playwright.yml         # GitHub Actions workflow
|-- tests/
|   |-- api/
|   |   `-- account.api.ts         # API helper methods (create/delete account)
|   |-- fixtures/
|   |   |-- register.json          # Test data for register/login
|   |-- models/
|   |   `-- user.model.ts          # TypeScript model for user payload
|   |-- pages/
|   |   `-- login/
|   |       `-- index.ts           # Login page object
|   `-- specs/
|       `-- login/
|           `-- login.spec.ts      # Main test scenarios
|-- playwright.config.ts           # Playwright runtime/configuration
|-- package.json
`-- yarn.lock
```

## Prerequisites

Install these tools before running the project:

- [Node.js LTS](https://nodejs.org/)
- [Yarn Classic](https://classic.yarnpkg.com/lang/en/docs/install/) (or enable via Corepack)

Check installed versions:

```bash
node -v
yarn -v
```

## Quick Start

### 1) Clone the repository

```bash
git clone <your-repository-url>
cd playwright-automation-project
```

### 2) Install dependencies

```bash
yarn
```

### 3) Install Playwright browsers

```bash
yarn playwright install --with-deps
```

> On Windows, `--with-deps` mostly impacts Linux dependency installation in CI. It is safe to keep the same command across environments.

### 4) Run tests

```bash
yarn playwright test
```

## Run Tests

### Run all tests

```bash
yarn playwright test
```

### Run tests in headed mode

```bash
yarn playwright test --headed
```

### Run a specific file

```bash
yarn playwright test tests/specs/login/login.spec.ts
```

### Run only Chromium project

```bash
yarn playwright test --project=chromium
```

## Reports and Debugging

This project uses Playwright HTML reporter.

### Open the HTML report

```bash
yarn playwright show-report
```

### Useful debug options

```bash
# Enable Playwright Inspector
yarn playwright test --debug

# Keep trace collection (already enabled on first retry by config)
yarn playwright test --trace on
```

## Configuration

Current key values from `playwright.config.ts`:

- `testDir`: `./tests`
- `fullyParallel`: `true`
- `retries`: `2` on CI, `0` locally
- `workers`: `1` on CI
- `reporter`: `html`
- `baseURL`: `https://www.automationexercise.com`
- browser project enabled: `chromium`

If needed, you can make `baseURL` environment-driven by replacing hardcoded values with `process.env.BASE_URL`.

## CI CD

### GitHub Actions (already included)

The workflow in `.github/workflows/playwright.yml` currently:
- runs on push/PR to `main` and `master`
- installs Node + Yarn dependencies
- installs Playwright browsers
- executes tests
- uploads `playwright-report/` as build artifact

No extra setup is required beyond standard repository permissions.

### Azure Pipelines (ready-to-use)

If you want the same behavior in Azure DevOps, add `azure-pipelines.yml` at repository root:

```yaml
trigger:
  branches:
    include:
      - main
      - master

pr:
  branches:
    include:
      - main
      - master

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: 'lts/*'
    displayName: 'Use Node.js LTS'

  - script: |
      npm install -g yarn
      yarn
    displayName: 'Install dependencies'

  - script: yarn playwright install --with-deps
    displayName: 'Install Playwright browsers'

  - script: yarn playwright test
    displayName: 'Run Playwright tests'

  - task: PublishPipelineArtifact@1
    condition: succeededOrFailed()
    inputs:
      targetPath: 'playwright-report'
      artifact: 'playwright-report'
      publishLocation: 'pipeline'
    displayName: 'Publish Playwright report'
```

After committing this file:
1. Go to Azure DevOps -> Pipelines -> New Pipeline
2. Select your repository
3. Choose existing `azure-pipelines.yml`
4. Run pipeline

## Poetry Notes

This repository is currently **Node/TypeScript based**, so Poetry is **not required** for the default workflow.

If your goal is to run Python Playwright with Poetry, that is a separate stack (`pyproject.toml`, Python dependencies, `poetry run pytest` or `poetry run playwright ...`) and should be added in a dedicated migration branch to avoid mixing ecosystems.

## Troubleshooting

- `Error: Failed to launch browser`
  - Run `yarn playwright install --with-deps` again.

- Tests pass locally but fail in CI
  - Check `forbidOnly` behavior in CI and ensure there is no `test.only` in specs.

- Base URL issues
  - Confirm `baseURL` in `playwright.config.ts` or switch to environment variable strategy.

- Flaky account tests
  - Keep API cleanup/create logic consistent and avoid reusing stale accounts.

## Roadmap Ideas

- Add npm/yarn scripts in `package.json` (`test`, `test:headed`, `report`, `test:debug`)
- Add linting + formatting (`eslint`, `prettier`)
- Add multi-browser projects (Firefox/WebKit)
- Add environment-specific config files (dev/staging/prod)
- Add test tags/suites for smoke/regression execution

---

If you want, I can also create:
- a production-ready `azure-pipelines.yml` file directly in this repo
- cleaner package scripts in `package.json`
- a `.env.example` + environment-based configuration pattern
