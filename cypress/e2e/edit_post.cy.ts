import { faker } from "@faker-js/faker";

describe("Should edit a post", () => {
  it("edits a post", () => {
    let currentBody;
    let newBody = faker.lorem.words(20);
    cy.login();
    cy.visit("/");
    cy.wait("@session");
    cy.intercept("POST", "/api/trpc/post.edit?*").as("editPost");

    cy.get("[data-cy='post-edit-link']").eq(0).click();
    cy.url().should("contain", "/edit");
    cy.get("[data-cy='submit']").should("be.disabled");

    cy.get("[data-cy='edit-post-body']").then(($textarea) => {
      currentBody = $textarea.text();
    });

    cy.get("[data-cy='edit-post-body']").clear().type(newBody);

    cy.get("[data-cy='submit']").click();
    cy.wait("@editPost")
      .its("response.statusCode")
      .should("eq", 200)
      .then(() => {
        expect(currentBody).to.not.equal(newBody);
      });
  });
});
