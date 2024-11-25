import {
  Given,
  When,
  Then,
  DataTable,
  Before,
  After,
} from "@badeball/cypress-cucumber-preprocessor";

// Clear database before and after each test
Before(() => {
  cy.request({
    method: "POST",
    url: "/api/test/clear-data",
  });
});

After(() => {
  cy.request({
    method: "POST",
    url: "/api/test/clear-data",
  });
});

// Background steps
Given("a user exists with the following details:", (dataTable: DataTable) => {
  const rawUser = dataTable.hashes()[0];
  // Convert field names to lowercase
  const user = {
    email: rawUser.Email || rawUser.email,
    password: rawUser.Password || rawUser.password,
    firstName: rawUser['First Name'] || rawUser.firstName,
    lastName: rawUser['Last Name'] || rawUser.lastName
  };
  
  console.log("Setting up test user with data:", user);
  
  // First clear any existing users
  cy.request({
    method: "POST",
    url: "/api/test/clear-data",
    failOnStatusCode: false,
  }).then(() => {
    // Create the test user
    return cy.request({
      method: "POST",
      url: "/api/setup-test-user",
      headers: {
        "Content-Type": "application/json",
      },
      body: user,
      failOnStatusCode: false,
    });
  }).then((response) => {
    console.log("Test user setup response:", response);
    expect(response.status).to.equal(201);
    
    // Verify the user was created by trying to read it
    return cy.request({
      method: "POST",
      url: "/api/login",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: user.email,
        password: user.password
      },
      failOnStatusCode: false,
    });
  }).then(response => {
    console.log("Test login response:", response);
    // We expect this to succeed since we just created the user
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('success', true);
    expect(response.body).to.have.property('email', user.email);
  });
});

Given("I am on the login page", () => {
  // Clear any existing auth state
  cy.clearCookie("auth-token");
  cy.window().then((win) => {
    win.localStorage.clear();
  });
  cy.visit("/login");
});

// Form interaction steps
When(
  "I fill in login field {string} with {string}",
  (field: string, value: string) => {
    const fieldId = field.toLowerCase().replace(/\s+/g, "-");
    console.log(`Filling in field ${fieldId} with value:`, value);
    
    // First verify the field exists
    cy.get(`[data-test="${fieldId}"]`)
      .should('exist')
      .should('be.visible')
      .then(($el) => {
        // Clear any existing value
        cy.wrap($el).clear();
        
        if (value) {
          // Type the new value
          cy.wrap($el)
            .type(value, { delay: 50 })
            .should('have.value', value);
        }
        
        // Log the final value
        cy.wrap($el)
          .invoke('val')
          .then((finalValue) => {
            console.log(`Final value for ${fieldId}:`, finalValue);
          });
      });
  }
);

When("I click the login button", () => {
  // Get form values first
  cy.get('[data-test="email"]').invoke('val').then(email => {
    cy.get('[data-test="password"]').invoke('val').then(password => {
      const loginData = { email, password };
      console.log('Login form values:', loginData);
      
      // Set up API request interception with the form data
      cy.intercept("POST", "/api/login", (req) => {
        // Ensure proper headers
        req.headers['content-type'] = 'application/json';
        
        // Parse and stringify to ensure proper JSON formatting
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        req.body = JSON.stringify(body);
        
        console.log('Intercepted login request:', {
          headers: req.headers,
          body: req.body
        });
      }).as("loginRequest");
      
      // Click the button after interception is set up
      cy.get('[data-test="login-button"]').click();
    });
  });
});

// Assertion steps
Then("I should see {string}", (result: string) => {
  // Wait for the API request to complete
  cy.wait("@loginRequest").then((interception) => {
    console.log("Login response:", {
      request: interception.request?.body,
      response: interception.response?.body,
      statusCode: interception.response?.statusCode,
      responseHeaders: interception.response?.headers
    });

    switch (result) {
      case "Redirected to dashboard":
        // For successful login, expect 200 and verify navigation
        expect(interception.response?.statusCode).to.equal(200);
        
        // Wait for localStorage to be set
        cy.window().then((win) => {
          const userInfo = win.localStorage.getItem("userInfo");
          expect(userInfo).to.exist;
          const parsedUserInfo = JSON.parse(userInfo || "{}");
          expect(parsedUserInfo).to.have.property("email");
        });
        
        // Wait for navigation
        cy.url({ timeout: 10000 }).should("include", "/dashboard");
        break;
        
      case "Invalid credentials":
        // For invalid credentials, expect 401 and verify error message
        expect(interception.response?.statusCode).to.equal(401);
        cy.get('[data-test="validation-error"]', { timeout: 10000 })
          .should("be.visible")
          .and("contain", "Invalid credentials");
        break;
        
      default:
        throw new Error(`Step not implemented for result: ${result}`);
    }
  });
});

Then("I should see form validation errors", () => {
  // Check for HTML5 validation messages
  cy.get('[data-test="email"]:invalid').should("exist");
  cy.get('[data-test="password"]:invalid').should("exist");
});

Then("I should not be redirected to dashboard", () => {
  cy.url().should("include", "/login");
});
