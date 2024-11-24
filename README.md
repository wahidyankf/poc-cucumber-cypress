# POC Cucumber Cypress

A proof-of-concept project demonstrating end-to-end testing using Cypress with Cucumber integration in a Next.js application. This project uses Mantine UI components for the frontend and implements BDD (Behavior Driven Development) testing practices.

## Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Components**: Mantine UI 7.14
- **Testing Framework**: Cypress 13.16
- **BDD Framework**: Cucumber (via @badeball/cypress-cucumber-preprocessor 21.0)
- **Language**: TypeScript 5.7
- **Styling**: PostCSS with Mantine preset

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

- `npm run dev` - Start the development server at http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting checks
- `npm run cypress:open` - Open Cypress Test Runner
- `npm run cypress:run` - Run Cypress tests in headless mode
- `npm run test:e2e` - Start the dev server and run E2E tests (uses start-server-and-test)

## Project Structure

```
poc-cucumber-cypress/
├── cypress/                    # Cypress test files
│   ├── e2e/                   # End-to-end test specifications
│   │   └── features/          # Cucumber feature files and step definitions
│   ├── fixtures/              # Test data and mock files
│   └── support/               # Support files and commands
├── src/                       # Source code
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   └── styles/                # CSS and style files
├── public/                    # Static files
├── cypress.config.ts          # Cypress configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── postcss.config.js         # PostCSS configuration
└── tsconfig.json             # TypeScript configuration
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

## Dependencies

### Main Dependencies

- `next`: ^15.0.3
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `@mantine/core`: ^7.14.1
- `@mantine/dates`: ^7.14.1
- `@mantine/form`: ^7.14.1
- `@mantine/hooks`: ^7.14.1
- `@tabler/icons-react`: ^3.22.0
- `typescript`: ^5.7.2
- `uuid`: ^11.0.3

### Development Dependencies

- `cypress`: ^13.16.0
- `@badeball/cypress-cucumber-preprocessor`: ^21.0.3
- `@bahmutov/cypress-esbuild-preprocessor`: ^2.2.3
- `cypress-file-upload`: ^5.0.8
- `esbuild`: ^0.24.0
- `start-server-and-test`: ^2.0.8

### PostCSS Configuration

The project uses PostCSS with the following plugins:

- `postcss-preset-mantine`
- `postcss-simple-vars`

## License

ISC
