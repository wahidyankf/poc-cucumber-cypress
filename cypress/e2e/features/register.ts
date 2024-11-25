import {
  When,
  Then,
  Before,
  After,
} from "@badeball/cypress-cucumber-preprocessor";
import { clearUsers } from "../../support/db";

// Clear database before and after each test
Before(() => {
  clearUsers();
});

After(() => {
  clearUsers();
});

// Navigation
When("I visit the registration page", () => {
  cy.visit("/register");
});

// Profile Picture Upload
When("I upload a profile picture", () => {
  // For Mantine's FileInput, we need to trigger the hidden file input
  cy.get('[data-test="profile-picture"]')
    .click()
    .then(() => {
      // After clicking, find the actual file input that Mantine creates
      cy.get('input[type="file"]').selectFile('cypress/fixtures/profile-picture.jpg', { force: true });
    });
});

// Form filling
When(
  "I fill in the following registration fields:",
  (dataTable: { hashes: () => Array<{ Field: string; Value: string }> }) => {
    const formData = dataTable.hashes().reduce(
      (acc: Record<string, string>, row: { Field: string; Value: string }) => {
        acc[row.Field.toLowerCase().replace(/\s+/g, "-")] = row.Value;
        return acc;
      },
      {} as Record<string, string>
    );

    // First fill in all fields except password confirmation
    Object.entries(formData)
      .filter(([field]) => field !== "password-confirmation")
      .forEach(([field, value]) => {
        cy.get(`[data-test="${field}"]`)
          .clear()
          .type(value as string)
          .should("have.value", value);
      });

    // Then fill in password confirmation last
    const passwordConfirmation = formData["password-confirmation"];
    if (passwordConfirmation) {
      cy.get('[data-test="password-confirmation"]')
        .clear()
        .type(passwordConfirmation)
        .should("have.value", passwordConfirmation);
    }
  }
);

When(
  "I fill in registration field {string} with {string}",
  (field: string, value: string) => {
    const fieldId = field.toLowerCase().replace(/\s+/g, "-");
    cy.get(`[data-test="${fieldId}"]`)
      .clear()
      .type(value)
      .should("have.value", value);
  }
);

When("I fill in all required registration fields correctly", () => {
  const defaultData = {
    "first-name": "John",
    "last-name": "Doe",
    "phone-number": "1234567890",
    email: "john.doe@example.com",
    password: "SecurePass123!",
    "password-confirmation": "SecurePass123!",
    address: "123 Main St, City",
  };

  Object.entries(defaultData).forEach(([field, value]) => {
    cy.get(`[data-test="${field}"]`)
      .clear()
      .type(value)
      .should("have.value", value);
  });

  cy.get('[data-test="gender-male"]').check();
});

// Selections and checkboxes
When("I select {string} as gender", (gender: string) => {
  cy.get(`[data-test="gender-${gender}"]`).check();
});

When("I accept the terms and conditions", () => {
  cy.get('[data-test="terms-and-conditions"]').check();
});

When("I do not accept the terms and conditions", () => {
  cy.get('[data-test="terms-and-conditions"]').uncheck();
});

When("I subscribe to the newsletter", () => {
  cy.get('[data-test="newsletter"]').check();
});

// Form submission
When("I click the register button", () => {
  cy.get('[data-test="register-button"]').click();
});

// Assertions
Then("I should see all registration fields are filled correctly", () => {
  cy.get('[data-test="registration-success"]').should("be.visible");
});

Then("I should see validation messages for required fields", () => {
  cy.get('[data-test="validation-error"]').should("be.visible");
});

Then("I should see phone number validation error", () => {
  cy.get('[data-test="phone-validation-error"]').should("be.visible");
});

Then("I should see email validation error", () => {
  cy.get('[data-test="email-validation-error"]').should("be.visible");
});

Then("I should see password mismatch error", () => {
  cy.get('[data-test="password-mismatch-error"]').should("be.visible");
});

Then("I should see terms and conditions validation error", () => {
  cy.get('[data-test="terms-validation-error"]').should("be.visible");
});
