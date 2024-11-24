import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

When("I visit the home page", () => {
  cy.visit("http://localhost:3000");
});

Then("I should see the welcome message", () => {
  cy.get('[data-test="welcome-message"]').should("be.visible");
});

When("I click the registration form link", () => {
  cy.get('[data-test="register-link"]').click();
});

Then("I should be on the registration page", () => {
  cy.url().should("include", "/register");
});
