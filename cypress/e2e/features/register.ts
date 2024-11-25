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
  // Create a test file
  cy.fixture("profile-picture.jpg", "base64").then((fileContent) => {
    // Convert base64 to blob
    const blob = Cypress.Blob.base64StringToBlob(fileContent, "image/jpeg");
    const testFile = new File([blob], "profile-picture.jpg", {
      type: "image/jpeg",
    });

    // Use Mantine's FileInput component directly
    cy.get('[data-test="profile-picture"]').then(($input) => {
      // Trigger the file selection programmatically
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(testFile);

      // Find the hidden input within Mantine's FileInput
      const fileInput = $input.find(
        'input[type="file"]'
      )[0] as HTMLInputElement;
      if (fileInput) {
        fileInput.files = dataTransfer.files;
        cy.wrap(fileInput).trigger("change", { force: true });
      }
    });
  });
});

// Form filling
When(
  "I fill in the following registration fields:",
  (dataTable: { hashes: () => Array<{ Field: string; Value: string }> }) => {
    const fieldMappings: Record<string, string> = {
      "First Name": "first-name",
      "Last Name": "last-name",
      "Phone Number": "phone-number",
      Email: "email",
      Password: "password",
      "Password Confirmation": "password-confirmation",
      Address: "address",
    };

    const formData = dataTable
      .hashes()
      .reduce((acc: Record<string, string>, row) => {
        const fieldId = fieldMappings[row.Field];
        if (fieldId) {
          acc[fieldId] = row.Value;
        }
        return acc;
      }, {});

    // Fill in each field
    Object.entries(formData).forEach(([field, value]) => {
      cy.get(`[data-test="${field}"]`)
        .clear()
        .type(value)
        .should("have.value", value);
    });
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

When(
  "I fill in all required registration fields correctly:",
  (dataTable: { hashes: () => Array<{ Field: string; Value: string }> }) => {
    const fieldMappings: Record<string, string> = {
      "First Name": "first-name",
      "Last Name": "last-name",
      "Phone Number": "phone-number",
      Email: "email",
      Password: "password",
      "Password Confirmation": "password-confirmation",
      Address: "address",
    };

    const formData = dataTable
      .hashes()
      .reduce((acc: Record<string, string>, row) => {
        const fieldId = fieldMappings[row.Field];
        if (fieldId) {
          acc[fieldId] = row.Value;
        }
        return acc;
      }, {});

    // Fill in each field
    Object.entries(formData).forEach(([field, value]) => {
      cy.get(`[data-test="${field}"]`)
        .clear()
        .type(value)
        .should("have.value", value);
    });
  }
);

// Selections and checkboxes
When("I select {string} as gender", (gender: string) => {
  cy.get(`[data-test="gender-group"] input[value="${gender}"]`).check({
    force: true,
  });
});

When("I accept the terms and conditions", () => {
  cy.get('[data-test="terms"]').check();
});

When("I do not accept the terms and conditions", () => {
  cy.get('[data-test="terms"]').uncheck();
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
  // Wait for form submission and success message
  cy.get('[data-test="registration-success"]', { timeout: 10000 }).should(
    "be.visible"
  );
  cy.get('[data-test="validation-error"]').should("not.exist");
});

Then("I should see validation messages for required fields", () => {
  cy.get('[data-test="validation-error"]').should("be.visible");
  cy.get('[data-test="validation-error"]').should(
    "contain.text",
    "Please fix the errors in the form"
  );
});

Then("I should see phone number validation error", () => {
  cy.get('[data-test="phone-validation-error"]').should("be.visible");
  cy.get('[data-test="phone-validation-error"]').should(
    "contain.text",
    "Please enter a valid phone number"
  );
});

Then("I should see email validation error", () => {
  cy.get('[data-test="email-validation-error"]').should("be.visible");
  cy.get('[data-test="email-validation-error"]').should(
    "contain.text",
    "Please enter a valid email address"
  );
});

Then("I should see password mismatch error", () => {
  cy.get('[data-test="password-validation-error"]').should("be.visible");
  cy.get('[data-test="password-validation-error"]').should(
    "contain.text",
    "Passwords do not match"
  );
});

Then("I should see terms and conditions validation error", () => {
  cy.get('[data-test="terms-validation-error"]').should("be.visible");
  cy.get('[data-test="terms-validation-error"]').should(
    "contain.text",
    "You must accept the terms and conditions"
  );
});
