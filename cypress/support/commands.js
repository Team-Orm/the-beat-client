// cypress/support/commands.js
Cypress.Commands.add("login", () => {});

Cypress.Commands.add("getStyle", (element, prop) => {
  return cy.get(element).then(($el) => {
    return getComputedStyle($el[0])[prop];
  });
});

Cypress.Commands.add("deleteRooms", (roomId) => {
  const jwt = localStorage.getItem("jwt");

  cy.request({
    method: "DELETE",
    url: `${Cypress.env("SERVER_URL")}/api/rooms/${roomId}`,
    headers: {
      authorization: `Bearer ${jwt}`,
    },
    failOnStatusCode: false,
  });
});
