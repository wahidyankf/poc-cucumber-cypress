# Demo Cucumber Cypress

A demonstration project showcasing end-to-end testing using Cypress with Cucumber integration in a Next.js application. This project uses Mantine UI components for the frontend and implements BDD (Behavior Driven Development) testing practices.

## Tech Stack

- **Frontend Framework**: Next.js
- **UI Components**: Mantine UI
- **Testing Framework**: Cypress
- **BDD Framework**: Cucumber
- **Language**: TypeScript

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting checks
- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run Cypress tests in headless mode
- `npm run test:e2e` - Start the dev server and run E2E tests

## Project Structure

```
demo-cucumber-cypress/
├── cypress/                 # Cypress test files
│   ├── e2e/                # End-to-end test specifications
│   │   └── features/       # Cucumber feature files and step definitions
│   └── support/            # Support files and commands
├── src/                    # Source code
│   └── app/               # Next.js app directory
├── public/                # Static files
└── cypress.config.ts      # Cypress configuration
```

## Testing

This project uses Cucumber with Cypress for end-to-end testing. The tests are written in Gherkin syntax (`.feature` files) with corresponding step definitions in TypeScript.

### Running Tests

1. To open Cypress Test Runner:

   ```bash
   npm run cypress:open
   ```

2. To run tests in headless mode:

   ```bash
   npm run cypress:run
   ```

3. To run tests with development server:
   ```bash
   npm run test:e2e
   ```

## Key Features

- Integration of Cucumber with Cypress for BDD-style testing
- Next.js application with TypeScript
- Mantine UI components for modern UI design
- End-to-end test coverage
- Custom step definitions for common testing scenarios

## Dependencies

### Main Dependencies

- Next.js
- React
- Mantine UI (@mantine/core, @mantine/form, etc.)
- UUID

### Development Dependencies

- Cypress
- @badeball/cypress-cucumber-preprocessor
- cypress-file-upload
- TypeScript

## License

ISC
