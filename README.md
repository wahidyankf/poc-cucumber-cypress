# POC Cucumber Cypress

A proof-of-concept project demonstrating end-to-end testing using Cypress with Cucumber integration in a Next.js application. This project uses Mantine UI components for the frontend and implements BDD (Behavior Driven Development) testing practices.

## Features

- **User Authentication**: Complete user registration and login functionality
- **User Profile Management**: Profile creation and updates with support for:
  - Basic information (name, email, phone)
  - Profile picture upload
  - Address information
  - Bio and gender
- **Dashboard**: Personalized user dashboard after authentication
- **Data Persistence**: File-based JSON storage for demonstration purposes
- **Form Validation**: Comprehensive client and server-side validation
- **Responsive Design**: Mobile-friendly UI using Mantine components

## Tech Stack

- **Frontend Framework**: Next.js 14.1
- **UI Components**: Mantine UI 7.14
- **Testing Framework**: Cypress 13.16
- **BDD Framework**: Cucumber (via @badeball/cypress-cucumber-preprocessor 21.0)
- **Language**: TypeScript 5.7
- **Styling**: PostCSS with Mantine preset
- **Data Storage**: File-based JSON (for demonstration purposes)

## Prerequisites

- Node.js 22.11.0 (managed by Volta)
- npm 10.9.1 (managed by Volta)

### Volta Setup

This project uses [Volta](https://volta.sh/) to ensure consistent Node.js and npm versions. If you have Volta installed, it will automatically use the correct versions specified in `package.json`.

```bash
# Install Volta (if not already installed)
curl https://get.volta.sh | bash

# Volta will automatically use the correct versions when you cd into the project directory
cd poc-cucumber-cypress
```

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
│   │   ├── api/              # API routes for authentication and user management
│   │   ├── dashboard/        # Dashboard page
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── components/            # React components
│   ├── lib/                  # Utilities and database operations
│   └── styles/               # CSS and style files
├── data/                     # JSON file storage directory
├── public/                    # Static files
├── cypress.config.ts          # Cypress configuration
├── next-env.d.ts             # Next.js TypeScript declarations
├── postcss.config.js         # PostCSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Testing

This project uses Cucumber with Cypress for end-to-end testing. The tests are written in Gherkin syntax (`.feature` files) with corresponding step definitions in TypeScript.

### Feature Files

The project includes several feature files that test different aspects of the application:

- `login.feature`: Tests user authentication scenarios
- `register.feature`: Tests user registration process
- `dashboard.feature`: Tests dashboard functionality and profile management

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

- `next`: ^14.2.0
- `react`: ^18.3.1
- `react-dom`: ^18.3.1
- `@mantine/core`: ^7.14.1
- `@mantine/dates`: ^7.14.1
- `@mantine/form`: ^7.14.1
- `@mantine/hooks`: ^7.14.1
- `@tabler/icons-react`: ^3.22.0
- `@types/node`: ^22.9.1
- `@types/react`: ^18.3.12
- `@types/react-dom`: ^18.3.1
- `@types/uuid`: ^10.0.0
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

## Data Storage

For demonstration purposes, this project uses a simple file-based JSON storage system located in the `data` directory. In a production environment, this should be replaced with a proper database system.

### Storage Structure

- User data is stored in `data/users.json`
- Profile pictures are stored in the public directory
- All data is persisted between server restarts

## License

ISC
