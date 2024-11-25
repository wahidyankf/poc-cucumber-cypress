import {
  When,
  Then,
  Given,
  DataTable,
} from "@badeball/cypress-cucumber-preprocessor";

// User setup
Given(
  "a user exists with email {string} and password {string}",
  (email: string, password: string) => {
    const userInfo = {
      email,
      password,
      firstName: "John",
      lastName: "Doe",
    };

    // Clear any existing users first
    cy.request({
      method: "POST",
      url: "/api/test/clear-data",
    }).then(() => {
      // Create user in backend
      cy.request({
        method: "POST",
        url: "/api/setup-test-user",
        body: userInfo,
      });
    });
  }
);

Given(
  "I have registered with the following information:",
  (dataTable: { raw: () => string[][] }) => {
    const userInfo = dataTable.raw().reduce(
      (acc, [key, value]) => {
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );

    // Clear any existing users first
    cy.request({
      method: "POST",
      url: "/api/test/clear-data",
    }).then(() => {
      // Create user in backend
      cy.request({
        method: "POST",
        url: "/api/setup-test-user",
        body: userInfo,
      }).then(() => {
        // Login to get auth token
        cy.request({
          method: "POST",
          url: "/api/login",
          body: {
            email: userInfo.email,
            password: userInfo.password,
          },
        }).then((response) => {
          expect(response.status).to.equal(200);
          
          // Set auth cookie
          cy.setCookie("auth-token", "dummy-token");

          // Set localStorage
          cy.window().then((win) => {
            win.localStorage.setItem(
              "userInfo",
              JSON.stringify({
                firstName: userInfo.firstName,
                lastName: userInfo.lastName,
                email: userInfo.email,
                phoneNumber: userInfo.phoneNumber,
                bio: userInfo.bio,
                gender: userInfo.gender,
              })
            );
          });
        });
      });
    });
  }
);

// Navigation
When("I visit the dashboard page", () => {
  cy.visit("/dashboard");
});

Given("I am on the login page", () => {
  // Clear any existing cookies and localStorage before visiting login
  cy.clearCookie("auth-token");
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.visit("/login");
});

// Form interactions
When(
  "I fill in login field {string} with {string}",
  (field: string, value: string) => {
    cy.get(`[data-test="${field.toLowerCase()}"]`).type(value);
  }
);

When("I click the login button", () => {
  cy.get('[data-test="login-button"]').click();
});

// Assertions
Then("I should be redirected to the login page", () => {
  // Wait for redirect and page load
  cy.url({ timeout: 10000 }).should("include", "/login");
  cy.get('[data-test="login-form"]', { timeout: 10000 }).should("be.visible");
});

Then("I should be redirected to the dashboard page", () => {
  // Wait for navigation and page load
  cy.url({ timeout: 10000 }).should("include", "/dashboard");
  cy.get('[data-test="dashboard-welcome"]', { timeout: 10000 }).should("be.visible");
});

Then("I should see {string} on the page", (text: string) => {
  // Wait for content to be visible with increased timeout
  cy.get('[data-test="dashboard-welcome"]', { timeout: 15000 })
    .contains(text)
    .should("be.visible");
});

Then("I should see my profile information:", (dataTable: DataTable) => {
  const profileInfo = dataTable.rows();
  profileInfo.forEach(([field, value]) => {
    cy.get('[data-test="profile-info"]', { timeout: 10000 })
      .contains(field)
      .should("be.visible");
    cy.get('[data-test="profile-info"]', { timeout: 10000 })
      .contains(value)
      .should("be.visible");
  });
});

Then("I should see a {string} badge", (text: string) => {
  cy.get('[data-test="gender-badge"]', { timeout: 10000 })
    .contains(text)
    .should("be.visible");
});
