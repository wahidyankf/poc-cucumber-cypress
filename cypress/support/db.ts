export function clearUsers() {
  return cy.request({
    method: "POST",
    url: "/api/test/clear-data",
    failOnStatusCode: false,
  });
}

export const setupTestUser = (userData: Record<string, string | File>) => {
  // Send data as JSON instead of FormData since we don't have any files in this case
  return cy.request({
    method: "POST",
    url: "/api/setup-test-user",
    body: userData,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
