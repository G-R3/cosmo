import { generateCommunity } from "../support/generate";

// TODO
// instead test to see if we get errors (?)
// also Im manually removing spaces by using str.replace(/ /g, '');
// faker has no way to provide text without any spaces

describe("Create a community", () => {
  it("will not allow if not authenticated", () => {
    cy.clearCookies();
    const { name, description } = generateCommunity();
    cy.visit("/");
    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");

    cy.get("[data-cy='create-community-modal']").click();

    cy.get("input").type(name.replace(/ /g, ""));
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

    cy.get("input").type(name.replace(/ /g, ""));
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
    cy.get("[data-cy='community-name-error']").should("be.visible");
  });

  it("will not allow name exceeds max characters", () => {
    const name = "ThisShouldExceedTheCharacterLimit";
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    // create community
    cy.get("input").type(name.replace(/ /g, ""));

    cy.get("[data-cy='confirm-create']").click();
    cy.get("[data-cy='community-name-error']").should("be.visible");
  });

  it("will not allow if community exists", () => {
    const { name } = generateCommunity();
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/community.create?*").as("createCommunity");
    cy.get("[data-cy='create-community-modal']").click();

    // create community
    cy.get("input").type(name.replace(/ /g, ""));

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 200);

    // attemp to create the same community
    cy.get("[data-cy='create-community-modal']").click();

    cy.get("input").type(name.replace(/ /g, ""));

    cy.get("[data-cy='confirm-create']").click();
    cy.wait("@createCommunity").its("response.statusCode").should("eq", 400);
  });
});
