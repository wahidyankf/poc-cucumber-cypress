const config = {
  nonGlobalStepDefinitions: true,
  stepDefinitions: ["cypress/e2e/features/*.ts"],
  json: {
    enabled: true,
    output: "cypress/reports/cucumber-json/cucumber-report.json",
  },
  messages: {
    enabled: true,
    output: "cypress/reports/cucumber-messages/cucumber-messages.ndjson",
  },
};

export default config;
