Feature: Registration
  As a user
  I want to register for an account
  So that I can access the application

  Scenario: Registering with valid data including profile picture
    When I visit the registration page
    And I upload a profile picture
    And I fill in the following registration fields:
      | Field                 | Value                |
      | First Name            | John                 |
      | Last Name             | Doe                  |
      | Phone Number          | 1234567890           |
      | Email                 | john.doe@example.com |
      | Password              | SecurePass123!       |
      | Password Confirmation | SecurePass123!       |
      | Address               | 123 Main St, City    |
    And I select "male" as gender
    And I accept the terms and conditions
    And I subscribe to the newsletter
    And I click the register button
    Then I should see all registration fields are filled correctly

  Scenario: Registration form validation for required fields
    When I visit the registration page
    And I click the register button
    Then I should see validation messages for required fields

  Scenario: Registration phone number validation
    When I visit the registration page
    And I fill in registration field "Phone Number" with "123"
    Then I should see phone number validation error

  Scenario: Registration email validation
    When I visit the registration page
    And I fill in registration field "Email" with "invalid-email"
    Then I should see email validation error

  Scenario: Registration password confirmation validation
    When I visit the registration page
    And I fill in registration field "Password" with "Pass123!"
    And I fill in registration field "Password Confirmation" with "DifferentPass123!"
    Then I should see password mismatch error

  Scenario: Registration terms and conditions validation
    When I visit the registration page
    And I fill in all required registration fields correctly
    But I do not accept the terms and conditions
    And I click the register button
    Then I should see terms and conditions validation error
