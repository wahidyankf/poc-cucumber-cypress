import {
  Given,
  When,
  Then,
  DataTable,
  Before,
  After,
} from "@badeball/cypress-cucumber-preprocessor";
import { clearUsers, setupTestUser } from "../../support/db";

// Clear database before and after each test
Before(() => {
  clearUsers();
});

After(() => {
  clearUsers();
});

// Background steps
Given("a user exists with the following details:", (dataTable: DataTable) => {
  const [user] = dataTable.hashes();
  setupTestUser(user).then((response) => {
    expect(response.status).to.equal(201);
  });
});

Given("I am on the login page", () => {
  cy.visit("/login");
});

// Form interaction steps
When(
  "I fill in login field {string} with {string}",
  (field: string, value: string) => {
    cy.get(`[data-test="${field.toLowerCase().replace(/\s+/g, "-")}"]`).type(
      value
    );
  }
);

When("I click the login button", () => {
  cy.get('[data-test="login-button"]').click();
});

// Assertion steps
Then("I should see {string}", (result: string) => {
  switch (result) {
    case "Redirected to dashboard":
      cy.url().should("include", "/dashboard");
      break;
    case "Invalid credentials":
      cy.contains("Invalid credentials").should("be.visible");
      break;
    default:
      throw new Error(`Unexpected result: ${result}`);
  }
});

Then("I should see form validation errors", () => {
  // Check for HTML5 validation messages
  cy.get('[data-test="email"]:invalid').should("exist");
  cy.get('[data-test="password"]:invalid').should("exist");
});

Then("I should not be redirected to dashboard", () => {
  cy.url().should("include", "/login");
  cy.url().should("not.include", "/dashboard");
});
