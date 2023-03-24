describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("login page", () => {
  beforeEach(function () {
    // cy.loginByGoogleApi();
  });

  it("visis main page", () => {
    const baseUrl = Cypress.env("baseUrl");
    cy.visit(baseUrl);

    cy.contains("Press Login Button to Start");
    cy.url().should("include", "/login");
  });

  // it("logs in with Google OAuth and redirects to /", () => {
  //   cy.visit("http://localhost:3000/login");

  //   cy.get('button[type="button"]').click();

  //   cy.url().should("eq", "http://localhost:3000");
  // });
});
