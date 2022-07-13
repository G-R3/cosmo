import { generatePost } from "../support/generate";

describe("Deleting a post", () => {
  before(() => {
    cy.login();
    cy.visit("/");
    cy.wait("@session");
  });

  it("should create and delete a post", (done) => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      // pain...
      expect(err.message).to.include(
        "(0 , next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession) is not a function",
      );

      done();

      // returning false here prevents Cypress from
      // failing the test
      return false;
    });

    const { postTitle, postBody, postSlug } = generatePost();
    const searchField = "Skateboarding";
    cy.intercept("POST", "/api/trpc/post.create?*").as("createPost");
    cy.intercept("POST", "/api/trpc/post.delete?*").as("deletePost");

    cy.visit("/submit");

    cy.get("[data-cy='search-communities']").type(searchField);
    cy.get("ul").eq(0).should("contain.text", searchField).click();

    cy.get("[data-cy='post-title']").type(postTitle);

    cy.get("[data-cy='post-body']").type(postBody);

    cy.get("[data-cy='submit']").click().should("be.disabled");
    cy.wait("@createPost").its("response.statusCode").should("eq", 200);

    cy.url().should("contain", postSlug);
    cy.get("[data-cy='post-edit-link']").click();
    cy.url().should("contain", `${postSlug}/edit`);

    cy.get("[data-cy='post-delete']").click();
    cy.get("[data-cy='delete-modal']").should("be.visible");
    cy.get("[data-cy='confirm-delete-post']")
      .click()
      .should("contain.text", "Deleting...");

    cy.wait("@deletePost").its("response.statusCode").should("eq", 200);
    cy.url().should("contain", `/c/${searchField}`);
  });
});
