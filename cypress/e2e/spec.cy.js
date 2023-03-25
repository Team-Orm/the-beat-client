describe("template spec", () => {
  it("passes", () => {
    cy.visit("https://example.cypress.io");
  });
});

describe("Login", () => {
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
    cy.wait(500);
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

describe("RoomMaker", () => {
  const mockUser = {
    name: "Test man",
    email: "testman@example.com",
    password: "password123",
  };

  const login = () => {
    cy.get("[data-cy=login-button]").click();
    cy.get("[data-cy=login-email]").type(mockUser.email);
    cy.get("[data-cy=login-password]").type(mockUser.password);
    cy.get("[data-cy=submit-button]").click();

    cy.url().should("eq", "http://localhost:3000/");
    cy.get('[data-cy="create-room"]').click();
  };

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    login();
  });

  it("should play and pause the song on play button click", () => {
    cy.window()
      .its("localStorage")
      .invoke("getItem", "jwt")
      .should("not.be.null");

    cy.get("[data-cy=play-button]").as("playBtn");
    cy.get("@playBtn").click().should("contain", "⏸️ BGM OFF");
    cy.get("@playBtn").click().should("contain", "🎵 BGM ON");
  });

  it("should hover and click a song container", () => {
    cy.get("[data-cy=song-container-0]").as("songContainer");
    cy.get("[data-cy=room-maker-container]").as("roomMakerContainer");

    // Log the initial style before hovering
    cy.getStyle("@roomMakerContainer", "backgroundImage").then(
      (initialStyle) => {
        console.log("Initial Style:", initialStyle);
      },
    );

    cy.get("@songContainer").trigger("mouseover").trigger("mouseenter");

    // Log the style after hovering
    cy.getStyle("@roomMakerContainer", "backgroundImage").then(
      (hoveredStyle) => {
        console.log("Hovered Style:", hoveredStyle);
      },
    );

    cy.get("@songContainer").click();
  });

  it("should click leave button and test navigation", () => {
    cy.get("[data-cy=leave-button]").click();
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("should click create room button and test navigation", () => {
    cy.get("[data-cy=song-container-0]").as("songContainer");
    cy.get("@songContainer").click();
    cy.get("[data-cy=create-button]").click();

    cy.url().should("include", "http://localhost:3000/battles/");

    cy.url().then((url) => {
      const roomId = url.split("/").pop();

      cy.url().should("eq", `http://localhost:3000/battles/${roomId}`);
    });

    cy.wait(1000);
    cy.get("[data-cy=exit-button").click();
    cy.url().should("eq", "http://localhost:3000/");
  });
});
