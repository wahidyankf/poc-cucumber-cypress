Feature: Dashboard Access
  As a registered user
  I want to access the dashboard
  So that I can view protected content

  Scenario: Redirect to login when accessing dashboard without authentication
    When I visit the dashboard page
    Then I should be redirected to the login page

  Scenario: Access dashboard after successful registration
    Given I have registered with the following information:
      | firstName   | John                  |
      | lastName    | Doe                   |
      | email       | john.doe@example.com  |
      | password    | SecurePass123!        |
      | phoneNumber | 1234567890            |
      | bio         | Test bio information  |
      | gender      | Male                  |
    When I visit the dashboard page
    Then I should see "Welcome, John!" on the page
    And I should see my profile information:
      | field       | value                |
      | Name        | John Doe             |
      | Email       | john.doe@example.com |
      | Phone       | 1234567890           |
      | Bio         | Test bio information |
    And I should see a "Male" badge

  Scenario: Access dashboard after successful login
    Given a user exists with email "john.doe@example.com" and password "SecurePass123!"
    And I am on the login page
    When I fill in login field "Email" with "john.doe@example.com"
    And I fill in login field "Password" with "SecurePass123!"
    And I click the login button
    Then I should be redirected to the dashboard page
    And I should see "Welcome, John!" on the page
