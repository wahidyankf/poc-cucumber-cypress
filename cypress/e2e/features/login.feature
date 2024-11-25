Feature: Login Page
  As a user
  I want to be able to login
  So that I can access protected content

  Background:
    Given a user exists with the following details:
      | Email                | Password       | First Name | Last Name |
      | john.doe@example.com | SecurePass123! | John       | Doe       |
    And I am on the login page
  @focus
  Scenario Outline: Login attempts with various credentials
    When I fill in login field "Email" with "<Input Email>"
    And I fill in login field "Password" with "<Input Password>"
    And I click the login button
    Then I should see "<Expected Result>"

    Examples:
      | Input Email          | Input Password | Expected Result         |
      | john.doe@example.com | SecurePass123! | Redirected to dashboard |
      | wrong@example.com    | SecurePass123! | Invalid credentials     |
      | john.doe@example.com | WrongPass123!  | Invalid credentials     |
      | wrong@example.com    | WrongPass123!  | Invalid credentials     |

  Scenario: Login form validation
    When I click the login button
    Then I should see form validation errors
    And I should not be redirected to dashboard
