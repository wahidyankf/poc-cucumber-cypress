Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the welcome message and navigate to other pages

  Scenario: Visiting the home page
    When I visit the home page
    Then I should see the welcome message

  Scenario: Navigating to the registration form
    When I visit the home page
    And I click the registration form link
    Then I should be on the registration page
