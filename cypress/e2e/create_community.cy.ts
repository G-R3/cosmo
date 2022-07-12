import { generateCommunity } from "../support/generate";

describe("Create a community", () => {
  it("will not allow if not authenticated", () => {
    cy.clearCookies();
    const { name, description } = generateCommunity();
    cy.visit("/");
    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");

    cy.get("[data-cy='create-community-modal']").click();

    cy.get("input").type(name);
    cy.get("textarea").type(description);

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 403);
  });

  it("will allow if authenticated", () => {
    const { name, description } = generateCommunity();
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    cy.get("input").type(name);
    cy.get("textarea").type(description);

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 200);
  });

  it("will not allow empty community name", () => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 400);
  });

  it("will not allow name exceeds max characters", () => {
    const name = "ThisShouldExceedTheCharacterLimit";
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    // create community
    cy.get("input").type(name);

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 400);
  });

  it("will not allow if community exists", () => {
    const { name } = generateCommunity();
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    // create community
    cy.get("input").type(name);

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 200);

    // attemp to create the same community
    cy.get("[data-cy='create-community-modal']").click();

    cy.get("input").type(name);

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 400);
  });
});
