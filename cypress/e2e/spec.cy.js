describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("login page", () => {
  const mockUser = {
    name: "Test man",
    email: "testman@example.com",
    password: "password123",
  };

  beforeEach(() => {
    const client = Cypress.env("CLIENT_URL");
    cy.visit(client);
  });

  afterEach(() => {
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("SERVER_URL")}/api/users/delete`,
      body: { email: mockUser.email },
    });
  });

  it("should register a new user", () => {
    cy.get("[data-cy=register-button]").click();
    cy.get("[data-cy=register-name]").type(mockUser.name);
    cy.get("[data-cy=register-email]").type(mockUser.email);
    cy.get("[data-cy=register-password]").type(mockUser.password);
    cy.get("[data-cy=submit-button]").click();
    cy.get("[data-cy=message]").contains("유저가 등록 되었습니다.");
  });

  it("should login a user", () => {
    cy.get("[data-cy=login-button]").click();
    cy.get("[data-cy=login-email]").type(mockUser.email);
    cy.get("[data-cy=login-password]").type(mockUser.password);
    cy.get("[data-cy=submit-button]").click();

    // Add any assertion for a successful login here
  });
});
