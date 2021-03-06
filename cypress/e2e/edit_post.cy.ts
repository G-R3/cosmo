import { faker } from "@faker-js/faker";

describe("Should edit a post", () => {
  it("edits a post", () => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");

    cy.intercept("POST", "/api/trpc/post.edit?*").as("editPost");

    cy.get("[data-cy='post-edit-link']").eq(0).click();
    cy.url().should("contain", "/edit");
    cy.get("[data-cy='submit']").should("be.disabled");

    cy.get("[data-cy='edit-post-body']").clear().type(faker.lorem.words(20));

    cy.get("[data-cy='submit']").click();
    cy.wait("@editPost").its("response.statusCode").should("eq", 200);
  });
});
